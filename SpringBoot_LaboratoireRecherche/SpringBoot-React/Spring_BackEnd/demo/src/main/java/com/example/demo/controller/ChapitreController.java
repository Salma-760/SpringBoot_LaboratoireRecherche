package com.example.demo.controller;

import com.example.demo.model.Auteur;
import com.example.demo.model.Chapitre;
import com.example.demo.repository.AuteurRepository;
import com.example.demo.repository.ChapitreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/chapitres")
@CrossOrigin(origins = "http://localhost:3000")
public class ChapitreController {

    @Autowired
    private ChapitreRepository chapitreRepository;

    @Autowired
    private AuteurRepository auteurRepository;

    @GetMapping
    public List<Chapitre> getAll() {
        return chapitreRepository.findAll();
    }

    @PostMapping
    public Chapitre add(@RequestBody Chapitre chapitre) {
        // ✅ Charger les auteurs existants depuis la base
        Set<Auteur> auteursExistants = new HashSet<>();
        for (Auteur auteur : chapitre.getAuteurs()) {
            auteurRepository.findById(auteur.getId()).ifPresent(auteursExistants::add);
        }
        chapitre.setAuteurs(auteursExistants);

        return chapitreRepository.save(chapitre);
    }

    @PutMapping("/{id}")
    public Chapitre update(@PathVariable(name = "id") Long id, @RequestBody Chapitre ch) {
        return chapitreRepository.findById(id).map(c -> {
            c.setIntituleChapitre(ch.getIntituleChapitre());
            c.setTitreLivre(ch.getTitreLivre());
            c.setIsbn(ch.getIsbn());
            c.setMaisonEdition(ch.getMaisonEdition());
            c.setAnneePublication(ch.getAnneePublication());
            c.setPageDebut(ch.getPageDebut());
            c.setPageFin(ch.getPageFin());

            // ✅ Recharger les bons auteurs depuis la base
            Set<Auteur> auteursExistants = new HashSet<>();
            for (Auteur auteur : ch.getAuteurs()) {
                auteurRepository.findById(auteur.getId()).ifPresent(auteursExistants::add);
            }
            c.setAuteurs(auteursExistants);

            return chapitreRepository.save(c);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name = "id") Long id) {
        chapitreRepository.deleteById(id);
    }
}
