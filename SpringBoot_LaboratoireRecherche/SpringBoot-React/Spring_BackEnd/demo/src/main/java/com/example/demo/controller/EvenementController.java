package com.example.demo.controller;

import com.example.demo.model.Evenement;
import com.example.demo.repository.EvenementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/evenements")
@CrossOrigin(origins = "http://localhost:3000")
public class EvenementController {

    @Autowired
    private EvenementRepository repository;

    @GetMapping
    public List<Evenement> getAllEvenements() {
        List<Evenement> list = repository.findAll();
        list.forEach(e -> System.out.println("Titre: " + e.getTitre()));
        return list;
    }

    // Endpoint pour la page d'accueil, ex: /api/evenements/prochains?count=3
    @GetMapping("/prochains")
    public List<Evenement> getUpcomingEvents(@RequestParam(defaultValue = "3") int count) {
        return repository.findByDateDebutAfterOrderByDateDebutAsc(Instant.now(), PageRequest.of(0, count));
    }

    // ✅ Méthode pour supprimer un événement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable(name="id") Long id) {
        Optional<Evenement> evenement = repository.findById(id);
        if (evenement.isPresent()) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build();  // 404 Not Found
        }
    }
}
