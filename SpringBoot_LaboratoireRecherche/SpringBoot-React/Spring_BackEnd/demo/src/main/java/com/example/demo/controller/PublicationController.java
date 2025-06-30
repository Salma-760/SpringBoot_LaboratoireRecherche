package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.model.AuteurDTO;
import com.example.demo.model.PublicationDTO;
import com.example.demo.repository.AuteurRepository;
import com.example.demo.repository.PublicationRepository;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/publications")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicationController {

    private static final Logger logger = LoggerFactory.getLogger(PublicationController.class);

    @Autowired
    private PublicationRepository publicationRepo;

    @Autowired
    private AuteurRepository auteurRepo;

    @GetMapping
    public List<PublicationDTO> searchPublications(
            @RequestParam(required = false) String auteur,
            @RequestParam(required = false) Integer annee,
            @RequestParam(required = false) String terme) {

        logger.info("Recherche de publications avec critères : auteur={}, annee={}, terme={}", auteur, annee, terme);

        Specification<Publication> spec = (root, query, cb) -> {
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("auteurs", JoinType.LEFT);
                query.distinct(true);
            }
            return cb.equal(root.get("statut"), StatutPublication.VALIDEE);
        };

        if (annee != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("annee"), annee));
        }
        
        Specification<Publication> textSearchSpec = null;

        if (terme != null && !terme.trim().isEmpty()) {
            textSearchSpec = (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("titre")), "%" + terme.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("journal")), "%" + terme.toLowerCase() + "%")
            );
        }
        
        if (auteur != null && !auteur.trim().isEmpty()) {
            Specification<Publication> authorSpec = (root, query, cb) -> {
                Join<Publication, Auteur> auteurJoin = root.join("auteurs");
                String pattern = "%" + auteur.toLowerCase() + "%";
                return cb.or(
                    cb.like(cb.lower(auteurJoin.get("nom")), pattern),
                    cb.like(cb.lower(auteurJoin.get("prenom")), pattern),
                    cb.like(cb.lower(cb.concat(auteurJoin.get("prenom"), cb.literal(" "))), pattern + "%"),
                    cb.like(cb.lower(cb.concat(cb.concat(auteurJoin.get("prenom"), cb.literal(" ")), auteurJoin.get("nom"))), pattern)
                );
            };
            
            if (textSearchSpec != null) {
                textSearchSpec = textSearchSpec.or(authorSpec);
            } else {
                textSearchSpec = authorSpec;
            }
        }
        
        if (textSearchSpec != null) {
            spec = spec.and(textSearchSpec);
        }
        
        List<Publication> pubs = publicationRepo.findAll(spec);
        
        return pubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PostMapping("/soumettre")
    @PreAuthorize("hasAnyRole('CHERCHEUR', 'ADMIN')")
    public ResponseEntity<PublicationDTO> soumettrePublication(@RequestBody PublicationDTO dto, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Auteur auteurConnecte = auteurRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Auteur non trouvé pour l'email: " + userDetails.getUsername()));
        Publication pub = convertToEntity(dto);

        pub.setStatut(StatutPublication.EN_ATTENTE);
        // Associer uniquement l'auteur connecté (chargé depuis la base)
        pub.setAuteurs(Set.of(auteurConnecte));

        Publication saved = publicationRepo.save(pub);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
    }

    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PublicationDTO> getPublicationsEnAttente() {
        List<Publication> pubs = publicationRepo.findAllWithAuteursByStatut(StatutPublication.EN_ATTENTE);
        return pubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    @GetMapping("/validees")
    public List<PublicationDTO> getAllValidated() {
        logger.info("Requête GET /publications - Récupération des publications VALIDÉES (publiques)");
        List<Publication> pubs = publicationRepo.findAllWithAuteursByStatut(StatutPublication.VALIDEE);
        return pubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PatchMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<PublicationDTO> validerPublication(@PathVariable Long id) {
        return publicationRepo.findById(id).map(pub -> {
            pub.setStatut(StatutPublication.VALIDEE);
            Publication updated = publicationRepo.save(pub);
            return ResponseEntity.ok(convertToDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/refuser")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<PublicationDTO> refuserPublication(@PathVariable Long id) {
        return publicationRepo.findById(id).map(pub -> {
            pub.setStatut(StatutPublication.REFUSEE);
            Publication updated = publicationRepo.save(pub);
            return ResponseEntity.ok(convertToDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PublicationDTO> createByAdmin(@RequestBody PublicationDTO dto) {
        Publication pub = new Publication();
        pub.setTitre(dto.getTitre());
        pub.setJournal(dto.getJournal());
        pub.setBaseIndexation(dto.getBaseIndexation() != null ? dto.getBaseIndexation() : new HashSet<>());
        pub.setAnnee(dto.getAnnee());
        pub.setVolume(dto.getVolume());
        pub.setPages(dto.getPages());
        pub.setDoi(dto.getDoi());
        pub.setResume(dto.getResume());

        // Récupération sûre des auteurs attachés (existants en base)
        Set<Auteur> auteurs = new HashSet<>();
        if (dto.getAuteurs() != null) {
            for (AuteurDTO aDto : dto.getAuteurs()) {
                Auteur auteur = auteurRepo.findById(aDto.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Auteur non trouvé avec id: " + aDto.getId()));
                auteurs.add(auteur);
            }
        }
        pub.setAuteurs(auteurs);

        pub.setStatut(StatutPublication.VALIDEE); 

        Publication saved = publicationRepo.save(pub);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<PublicationDTO> update(@PathVariable Long id, @RequestBody PublicationDTO dto) {
        logger.info("Début mise à jour publication id={}", id);

        return publicationRepo.findById(id).map(existing -> {
            logger.info("Publication trouvée avant mise à jour : journal='{}', titre='{}'", existing.getJournal(), existing.getTitre());

            existing.setTitre(dto.getTitre());
            existing.setJournal(dto.getJournal());
            existing.setAnnee(dto.getAnnee());
            existing.setVolume(dto.getVolume());
            existing.setPages(dto.getPages());
            existing.setDoi(dto.getDoi());
            existing.setResume(dto.getResume());

            if (dto.getAuteurs() != null) {
                Set<Auteur> auteurs = new HashSet<>();
                for (AuteurDTO aDto : dto.getAuteurs()) {
                    Auteur auteur = auteurRepo.findById(aDto.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Auteur non trouvé avec id: " + aDto.getId()));
                    auteurs.add(auteur);
                }
                existing.setAuteurs(auteurs);
                logger.info("Mise à jour auteurs, count={}", auteurs.size());
            }

            if (dto.getBaseIndexation() != null) {
                existing.setBaseIndexation(dto.getBaseIndexation());
                logger.info("Mise à jour baseIndexation : {}", dto.getBaseIndexation());
            }

            existing.setStatut(dto.getStatut() != null ? StatutPublication.valueOf(dto.getStatut()) : existing.getStatut());
            logger.info("Mise à jour statut : {}", existing.getStatut());

            Publication updated = publicationRepo.save(existing);
            logger.info("Publication mise à jour en base : journal='{}', titre='{}'", updated.getJournal(), updated.getTitre());

            return ResponseEntity.ok(convertToDTO(updated));
        }).orElseGet(() -> {
            logger.warn("Publication avec id={} non trouvée", id);
            return ResponseEntity.notFound().build();
        });
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (publicationRepo.existsById(id)) {
            publicationRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/mes-publications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PublicationDTO>> getMesPublications(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Auteur auteurConnecte = auteurRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Auteur non trouvé pour l'email: " + userDetails.getUsername()));
        List<Publication> publications = publicationRepo.findPublicationsByAuteurId(auteurConnecte.getId());
        List<PublicationDTO> dtos = publications.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private PublicationDTO convertToDTO(Publication pub) {
        PublicationDTO dto = new PublicationDTO();
        dto.setId(pub.getId());
        dto.setTitre(pub.getTitre());
        dto.setJournal(pub.getJournal());
        dto.setBaseIndexation(pub.getBaseIndexation());
        dto.setAnnee(pub.getAnnee());
        dto.setVolume(pub.getVolume());
        dto.setPages(pub.getPages());
        dto.setDoi(pub.getDoi());
        dto.setResume(pub.getResume()); 
        if (pub.getStatut() != null) {
            dto.setStatut(pub.getStatut().name());
        }
        if (pub.getAuteurs() != null) {
            dto.setAuteurs(pub.getAuteurs().stream()
                .map(a -> new AuteurDTO(a.getId(), a.getNom(), a.getPrenom()))
                .collect(Collectors.toSet()));
        }
        return dto;
    }

    private Publication convertToEntity(PublicationDTO dto) {
        Publication pub = new Publication();
        pub.setId(dto.getId());
        pub.setTitre(dto.getTitre());
        pub.setJournal(dto.getJournal());
        pub.setBaseIndexation(dto.getBaseIndexation() != null ? dto.getBaseIndexation() : new HashSet<>());
        pub.setAnnee(dto.getAnnee());
        pub.setVolume(dto.getVolume());
        pub.setPages(dto.getPages());
        pub.setDoi(dto.getDoi());
        pub.setResume(dto.getResume());
        if (dto.getAuteurs() != null) {
            Set<Auteur> auteurs = new HashSet<>();
            for (AuteurDTO aDto : dto.getAuteurs()) {
                auteurRepo.findById(aDto.getId())
                    .ifPresentOrElse(
                        auteurs::add,
                        () -> logger.warn("Auteur non trouvé en base avec id: {}", aDto.getId())
                    );
            }
            pub.setAuteurs(auteurs);
        }
        return pub;
    }

}
