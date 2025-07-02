package com.example.demo.controller;

import com.example.demo.model.Chercheur;
import com.example.demo.repository.ChercheurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chercheurs")
@CrossOrigin(origins = "http://localhost:3000")
public class ChercheurController {

    @Autowired
    private ChercheurRepository chercheurRepository;

    // 🔍 Get all researchers
    @GetMapping
    public List<Chercheur> getAllChercheurs() {
        return chercheurRepository.findAll();
    }

    // ➕ Create a new researcher
    @PostMapping
    public Chercheur addChercheur(@RequestBody Chercheur chercheur) {
        return chercheurRepository.save(chercheur);
    }

    // ❌ Delete a researcher
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChercheur(@PathVariable(name = "id") Long id) {
        if (!chercheurRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        chercheurRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // 🔍 Get a researcher by ID
    @GetMapping("/{id}")
    public ResponseEntity<Chercheur> getChercheurById(@PathVariable(name = "id") Long id) {
        return chercheurRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✏️ Update a researcher
    @PutMapping("/{id}")
    public ResponseEntity<Chercheur> updateChercheur(
            @PathVariable(name = "id") Long id,
            @RequestBody Chercheur chercheurDetails) {

        return chercheurRepository.findById(id)
                .map(chercheur -> {
                    chercheur.setNom(chercheurDetails.getNom());
                    chercheur.setPrenom(chercheurDetails.getPrenom());
                    chercheur.setEmail(chercheurDetails.getEmail());
                    chercheur.setSpecialite(chercheurDetails.getSpecialite());
                    return ResponseEntity.ok(chercheurRepository.save(chercheur));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
