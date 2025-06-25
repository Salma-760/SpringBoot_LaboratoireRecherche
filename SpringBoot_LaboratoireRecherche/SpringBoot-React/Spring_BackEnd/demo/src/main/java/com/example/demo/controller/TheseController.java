package com.example.demo.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.DirecteurDTO;
import com.example.demo.model.TheseDTO;
import com.example.demo.model.Directeur;
import com.example.demo.model.These;
import com.example.demo.repository.DirecteurRepository;
import com.example.demo.repository.TheseRepository;

@RestController
@RequestMapping("/theses")
@CrossOrigin(origins = "http://localhost:3000")
public class TheseController {

    @Autowired
    private TheseRepository theseRepository;

    @Autowired
    private DirecteurRepository directeurRepository;

    @GetMapping
    public List<TheseDTO> getAll() {
        System.out.println("[LOG] Récupération de toutes les thèses avec directeurs");
        List<These> theses = theseRepository.findAllWithDirecteurs();
        System.out.println("[LOG] Nombre de thèses récupérées : " + theses.size());
        for (These t : theses) {
            System.out.println("[LOG] Thèse ID " + t.getId() + " - directeurs : " + t.getDirecteurs());
        }
        // Conversion en DTO
        return theses.stream().map(t -> new TheseDTO(
            t.getId(),
            t.getNomDoctorant(),
            t.getPrenomDoctorant(),
            t.getTitreThese(),
            t.getSpecialite(),
            t.getAnneeUniversitaire(),
            t.getDateSoutenance(),
            t.getDirecteurs().stream()
                .map(d -> new DirecteurDTO(d.getId(), d.getNom(), d.getPrenom()))
                .collect(Collectors.toList())
        )).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<These> create(@RequestBody These these) {
        System.out.println("[LOG] Création d'une nouvelle thèse avec directeurs reçus : " + these.getDirecteurs());
        Set<Directeur> directeursFromDb = new HashSet<>();
        if (these.getDirecteurs() != null) {
            for (Directeur d : these.getDirecteurs()) {
                directeurRepository.findById(d.getId()).ifPresentOrElse(
                    directeur -> {
                        System.out.println("[LOG] Directeur trouvé en base : " + directeur.getNom() + " " + directeur.getPrenom());
                        directeursFromDb.add(directeur);
                    },
                    () -> System.out.println("[WARN] Directeur avec ID " + d.getId() + " non trouvé en base")
                );
            }
        } else {
            System.out.println("[WARN] Pas de directeurs fournis pour cette thèse");
        }
        these.setDirecteurs(directeursFromDb);
        These savedThese = theseRepository.save(these);
        System.out.println("[LOG] Thèse sauvegardée avec ID : " + savedThese.getId());
        return ResponseEntity.ok(savedThese);
    }

    @PutMapping("/{id}")
    public ResponseEntity<These> update(@PathVariable(name="id") Long id, @RequestBody These updatedThese) {
        System.out.println("[LOG] Mise à jour de la thèse ID " + id);
        return theseRepository.findById(id).map(existingThese -> {
            existingThese.setNomDoctorant(updatedThese.getNomDoctorant());
            existingThese.setPrenomDoctorant(updatedThese.getPrenomDoctorant());
            existingThese.setTitreThese(updatedThese.getTitreThese());
            existingThese.setSpecialite(updatedThese.getSpecialite());
            existingThese.setAnneeUniversitaire(updatedThese.getAnneeUniversitaire());
            existingThese.setDateSoutenance(updatedThese.getDateSoutenance());

            Set<Directeur> directeursFromDb = new HashSet<>();
            if (updatedThese.getDirecteurs() != null) {
                for (Directeur d : updatedThese.getDirecteurs()) {
                    directeurRepository.findById(d.getId()).ifPresentOrElse(
                        directeur -> {
                            System.out.println("[LOG] Directeur trouvé en base (update) : " + directeur.getNom() + " " + directeur.getPrenom());
                            directeursFromDb.add(directeur);
                        },
                        () -> System.out.println("[WARN] Directeur avec ID " + d.getId() + " non trouvé en base (update)")
                    );
                }
            } else {
                System.out.println("[WARN] Pas de directeurs fournis pour la mise à jour");
            }
            existingThese.setDirecteurs(directeursFromDb);

            These savedThese = theseRepository.save(existingThese);
            System.out.println("[LOG] Thèse mise à jour avec succès ID : " + savedThese.getId());
            return ResponseEntity.ok(savedThese);
        }).orElseGet(() -> {
            System.out.println("[WARN] Thèse ID " + id + " non trouvée pour mise à jour");
            return ResponseEntity.notFound().build();
        });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name="id") Long id) {
        if (theseRepository.existsById(id)) {
            System.out.println("[LOG] Suppression de la thèse ID : " + id);
            theseRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        System.out.println("[WARN] Tentative de suppression d'une thèse inexistante ID : " + id);
        return ResponseEntity.notFound().build();
    }
}
