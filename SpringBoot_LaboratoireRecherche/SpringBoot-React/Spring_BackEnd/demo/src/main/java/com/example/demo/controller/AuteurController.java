package com.example.demo.controller;

import com.example.demo.model.Auteur;
import com.example.demo.repository.AuteurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auteurs")
@CrossOrigin(origins = "http://localhost:3000")
public class AuteurController {

    @Autowired
    private AuteurRepository auteurRepository;

    @GetMapping
    public List<Auteur> getAllAuteurs() {
        return auteurRepository.findAll();
    }

    @PostMapping
    public Auteur addAuteur(@RequestBody Auteur auteur) {
        return auteurRepository.save(auteur);
    }

    @GetMapping("/{id}")
    public Auteur getAuteurById(@PathVariable(name = "id") Long id) {
        return auteurRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Auteur updateAuteur(@PathVariable(name = "id") Long id, @RequestBody Auteur updatedAuteur) {
        return auteurRepository.findById(id)
                .map(auteur -> {
                    auteur.setNom(updatedAuteur.getNom());
                    auteur.setPrenom(updatedAuteur.getPrenom());
                    auteur.setEmail(updatedAuteur.getEmail());
                    return auteurRepository.save(auteur);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteAuteur(@PathVariable(name = "id") Long id) {
        auteurRepository.deleteById(id);
    }
}
