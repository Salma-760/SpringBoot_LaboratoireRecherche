package com.example.demo.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Auteur;
import com.example.demo.model.Publication;
import com.example.demo.repository.AuteurRepository;
import com.example.demo.repository.PublicationRepository;

@RestController
@RequestMapping("/publications")
public class PublicationController {

    @Autowired
    private PublicationRepository publicationRepo;

    @Autowired
    private AuteurRepository auteurRepo;

    @GetMapping
    public List<Publication> getAll() {
        List<Publication> publications = publicationRepo.findAllWithAuteurs(); // use custom query with fetch join
        return publications;
    }

    @PostMapping
    public ResponseEntity<Publication> create(@RequestBody Publication publication) {
        Set<Auteur> auteursFromDb = new HashSet<>();
        for (Auteur a : publication.getAuteurs()) {
            auteurRepo.findById(a.getId()).ifPresent(auteursFromDb::add);
        }
        publication.setAuteurs(auteursFromDb);
        return ResponseEntity.ok(publicationRepo.save(publication));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Publication> update(@PathVariable (name = "id") Long id, @RequestBody Publication updated) {
        return publicationRepo.findById(id).map(publication -> {
        	System.out.println("Modification appelée pour ID: " + id);
            publication.setTitre(updated.getTitre());
            publication.setJournal(updated.getJournal());
            publication.setBase_indexation(updated.getBase_indexation());
            publication.setAnnee_publication(updated.getAnnee_publication());
            publication.setVolume(updated.getVolume());
            publication.setPages(updated.getPages());
            publication.setDoi(updated.getDoi());

            Set<Auteur> auteurs = new HashSet<>();
            for (Auteur a : updated.getAuteurs()) {
                auteurRepo.findById(a.getId()).ifPresent(auteurs::add);
            }
            publication.setAuteurs(auteurs);

            return ResponseEntity.ok(publicationRepo.save(publication));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable  (name = "id")  Long id) {
        if (publicationRepo.existsById(id)) {
        	System.out.println("Suppression appelée pour ID: " + id);
            publicationRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
