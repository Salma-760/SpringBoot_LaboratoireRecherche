package com.example.demo.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    @Autowired
    private PublicationRepository publicationRepo;

    @Autowired
    private AuteurRepository auteurRepo;

    // Méthode utilitaire pour convertir entity -> DTO
    private PublicationDTO convertToDTO(Publication pub) {
        PublicationDTO dto = new PublicationDTO();
        dto.setId(pub.getId());
        dto.setTitre(pub.getTitre());
        dto.setJournal(pub.getJournal());
        dto.setBaseIndexation(pub.getBase_indexation());
        dto.setAnneePublication(pub.getAnnee_publication());
        dto.setVolume(pub.getVolume());
        dto.setPages(pub.getPages());
        dto.setDoi(pub.getDoi());

        Set<AuteurDTO> auteursDTO = pub.getAuteurs().stream()
            .map(a -> new AuteurDTO(a.getId(), a.getNom(), a.getPrenom()))
            .collect(Collectors.toSet());
        dto.setAuteurs(auteursDTO);

        return dto;
    }

    // Méthode utilitaire pour convertir DTO -> entity
    private Publication convertToEntity(PublicationDTO dto) {
        Publication pub = new Publication();
        pub.setId(dto.getId());
        pub.setTitre(dto.getTitre());
        pub.setJournal(dto.getJournal());
        pub.setBase_indexation(dto.getBaseIndexation());
        pub.setAnnee_publication(dto.getAnneePublication());
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
        List<Publication> pubs = publicationRepo.findAllWithAuteurs();
        return pubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<PublicationDTO> create(@RequestBody PublicationDTO dto) {
        Publication pub = convertToEntity(dto);
        Publication saved = publicationRepo.save(pub);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublicationDTO> update(@PathVariable(name="id") Long id, @RequestBody PublicationDTO dto) {
        return publicationRepo.findById(id).map(existing -> {
            existing.setTitre(dto.getTitre());
            existing.setJournal(dto.getJournal());
            existing.setBase_indexation(dto.getBaseIndexation());
            existing.setAnnee_publication(dto.getAnneePublication());
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
            return ResponseEntity.ok(convertToDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name="id") Long id) {
        if (publicationRepo.existsById(id)) {
            publicationRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
