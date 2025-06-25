package com.example.demo.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.AuteurDTO;
import com.example.demo.model.PublicationDTO;
import com.example.demo.model.Auteur;
import com.example.demo.model.Publication;
import com.example.demo.repository.AuteurRepository;
import com.example.demo.repository.PublicationRepository;

@RestController
@RequestMapping("/publications")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicationController {

    private static final Logger logger = LoggerFactory.getLogger(PublicationController.class);

    @Autowired
    private PublicationRepository publicationRepo;

    @Autowired
    private AuteurRepository auteurRepo;

    // entity -> DTO
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

        Set<AuteurDTO> auteursDTO = pub.getAuteurs().stream()
            .map(a -> new AuteurDTO(a.getId(), a.getNom(), a.getPrenom()))
            .collect(Collectors.toSet());
        dto.setAuteurs(auteursDTO);

        return dto;
    }

    // DTO -> entity
    private Publication convertToEntity(PublicationDTO dto) {
        logger.debug("Conversion DTO -> entity pour PublicationDTO id={}", dto.getId());
        Publication pub = new Publication();
        pub.setId(dto.getId());
        pub.setTitre(dto.getTitre());
        pub.setJournal(dto.getJournal());

        logger.info("Base indexations reçues : {}", dto.getBaseIndexation());

        if (dto.getBaseIndexation() != null) {
            pub.setBaseIndexation(dto.getBaseIndexation());
        } else {
            pub.setBaseIndexation(new HashSet<>());
        }

        pub.setAnnee(dto.getAnnee());
        pub.setVolume(dto.getVolume());
        pub.setPages(dto.getPages());
        pub.setDoi(dto.getDoi());

        Set<Auteur> auteurs = new HashSet<>();
        if (dto.getAuteurs() != null) {
            for (AuteurDTO aDto : dto.getAuteurs()) {
                auteurRepo.findById(aDto.getId()).ifPresent(auteurs::add);
            }
        }
        pub.setAuteurs(auteurs);

        return pub;
    }

    @GetMapping
    public List<PublicationDTO> getAll() {
        logger.info("Requête GET /publications - récupération de toutes les publications");
        List<Publication> pubs = publicationRepo.findAllWithAuteurs();
        logger.debug("Nombre de publications récupérées : {}", pubs.size());
        return pubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<PublicationDTO> create(@RequestBody PublicationDTO dto) {
        logger.info("Requête POST /publications - création d'une publication");
        Publication pub = convertToEntity(dto);
        Publication saved = publicationRepo.save(pub);
        logger.info("Publication créée avec id={}", saved.getId());
        return ResponseEntity.ok(convertToDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublicationDTO> update(@PathVariable(name = "id") Long id, @RequestBody PublicationDTO dto) {
        logger.info("Requête PUT /publications/{} - mise à jour d'une publication", id);
        return publicationRepo.findById(id).map(existing -> {
            existing.setTitre(dto.getTitre());
            existing.setJournal(dto.getJournal());
            existing.setBaseIndexation(dto.getBaseIndexation() != null ? dto.getBaseIndexation() : new HashSet<>());
            existing.setAnnee(dto.getAnnee());
            existing.setVolume(dto.getVolume());
            existing.setPages(dto.getPages());
            existing.setDoi(dto.getDoi());

            Set<Auteur> auteurs = new HashSet<>();
            if (dto.getAuteurs() != null) {
                for (AuteurDTO aDto : dto.getAuteurs()) {
                    auteurRepo.findById(aDto.getId()).ifPresent(auteurs::add);
                }
            }
            existing.setAuteurs(auteurs);

            Publication updated = publicationRepo.save(existing);
            logger.info("Publication id={} mise à jour", id);
            return ResponseEntity.ok(convertToDTO(updated));
        }).orElseGet(() -> {
            logger.warn("Publication id={} non trouvée pour mise à jour", id);
            return ResponseEntity.notFound().build();
        });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name = "id") Long id) {
        logger.info("Requête DELETE /publications/{} - suppression d'une publication", id);
        if (publicationRepo.existsById(id)) {
            publicationRepo.deleteById(id);
            logger.info("Publication id={} supprimée", id);
            return ResponseEntity.noContent().build();
        } else {
            logger.warn("Publication id={} non trouvée pour suppression", id);
            return ResponseEntity.notFound().build();
        }
    }
}
