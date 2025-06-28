package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.AuteurRepository;
import com.example.demo.repository.PublicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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


    //Soumission par un Chercheur et admin

    @PostMapping("/soumettre")
    @PreAuthorize("hasAnyRole('CHERCHEUR', 'ADMIN')")
    public ResponseEntity<PublicationDTO> soumettrePublication(@RequestBody PublicationDTO dto, Authentication authentication) {
    	logger.info("### DÉBOGAGE SÉCURITÉ ### Authentication object: {}", authentication);
        logger.info("Requête POST /publications/soumettre - Soumission par un chercheur");
       

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername(); 

        
        Auteur auteurConnecte = auteurRepo.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Auteur non trouvé pour l'email: " + username));
        
        Publication pub = convertToEntity(dto);

        // Force le statut à EN_ATTENTE et assigne le chercheur connecte comme auteur unique
        pub.setStatut(StatutPublication.EN_ATTENTE);
        pub.setAuteurs(Set.of(auteurConnecte));

        Publication saved = publicationRepo.save(pub);
        logger.info("Publication soumise avec id={} par l'auteur id={}", saved.getId(), auteurConnecte.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
    }

    // ENDPOINTS DE GESTION POUR L'ADMINISTRATEUR
    
    @GetMapping("/en-attente")
    public List<PublicationDTO> getPublicationsEnAttente() {
        logger.info("Requête GET /publications/en-attente - Récupération des publications en attente pour l'admin");
        List<Publication> pubs = publicationRepo.findAllWithAuteursByStatut(StatutPublication.EN_ATTENTE);
        return pubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PatchMapping("/{id}/valider")
    public ResponseEntity<PublicationDTO> validerPublication(@PathVariable Long id) {
        logger.info("Requête PATCH /publications/{}/valider - Validation de la publication", id);
        return publicationRepo.findById(id).map(pub -> {
            pub.setStatut(StatutPublication.VALIDEE);
            Publication updated = publicationRepo.save(pub);
            logger.info("Publication id={} validée par un admin", updated.getId());
            return ResponseEntity.ok(convertToDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/refuser")
    public ResponseEntity<PublicationDTO> refuserPublication(@PathVariable Long id) {
        logger.info("Requête PATCH /publications/{}/refuser - Refus de la publication", id);
        return publicationRepo.findById(id).map(pub -> {
            pub.setStatut(StatutPublication.REFUSEE);
            Publication updated = publicationRepo.save(pub);
            logger.info("Publication id={} refusée par un admin", updated.getId());
            return ResponseEntity.ok(convertToDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ENDPOINTS CRUD MODIFIÉS

    //Ne retourne que les publications VALIDÉES au public
    @GetMapping
    public List<PublicationDTO> getAllValidated() {
        logger.info("Requête GET /publications - Récupération des publications VALIDÉES (publiques)");
        List<Publication> pubs = publicationRepo.findAllWithAuteursByStatut(StatutPublication.VALIDEE);
        return pubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    //Création directe par un ADMIN, la publication est automatiquement VALIDÉE
    @PostMapping
    public ResponseEntity<PublicationDTO> createByAdmin(@RequestBody PublicationDTO dto) {
        logger.info("Requête POST /publications - Création directe par un ADMIN");
        Publication pub = convertToEntity(dto);
        pub.setStatut(StatutPublication.VALIDEE); // L'admin crée directement une publication validée
        
        Publication saved = publicationRepo.save(pub);
        logger.info("Publication créée avec id={} et statut VALIDEE", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
    }

    // L'Update et le Delete sont  protégés par la config de sécurité (rôle ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<PublicationDTO> update(@PathVariable(name = "id") Long id, @RequestBody PublicationDTO dto) {

        return publicationRepo.findById(id).map(existing -> {
            
             Publication updated = publicationRepo.save(existing);
             return ResponseEntity.ok(convertToDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name = "id") Long id) {
     
         if (publicationRepo.existsById(id)) {
            publicationRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // MÉTHODES UTILITAIRES DE CONVERSION

    private PublicationDTO convertToDTO(Publication pub) {
        logger.debug("Conversion entity -> DTO pour Publication id={}", pub.getId());
        PublicationDTO dto = new PublicationDTO();
        dto.setId(pub.getId());
        dto.setTitre(pub.getTitre());
        dto.setJournal(pub.getJournal());
        dto.setBaseIndexation(pub.getBaseIndexation());
        dto.setAnnee(pub.getAnnee());
        dto.setVolume(pub.getVolume());
        dto.setPages(pub.getPages());
        dto.setDoi(pub.getDoi());
        
        if (pub.getStatut() != null) {
            dto.setStatut(pub.getStatut().name()); 
        }

        Set<AuteurDTO> auteursDTO = pub.getAuteurs().stream()
            .map(a -> new AuteurDTO(a.getId(), a.getNom(), a.getPrenom()))
            .collect(Collectors.toSet());
        dto.setAuteurs(auteursDTO);

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
        
        if (dto.getAuteurs() != null) {
            Set<Auteur> auteurs = new HashSet<>();
            for (AuteurDTO aDto : dto.getAuteurs()) {
                auteurRepo.findById(aDto.getId()).ifPresent(auteurs::add);
            }
            pub.setAuteurs(auteurs);
        }
        return pub;
    }
}