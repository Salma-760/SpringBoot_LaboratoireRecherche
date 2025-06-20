package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Evenement;
import com.example.demo.repository.EvenementRepository;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/evenements")
@CrossOrigin(origins = "http://localhost:3000")
public class EvenementController {
    @Autowired private EvenementRepository repository;

    @GetMapping
    public List<Evenement> getAllEvenements() {
        return repository.findAll();
    }

    // Endpoint pour la page d'accueil, ex: /api/evenements/prochains?count=3
    @GetMapping("/prochains")
    public List<Evenement> getUpcomingEvents(@RequestParam(defaultValue = "3") int count) {
        return repository.findByDateDebutAfterOrderByDateDebutAsc(Instant.now(), PageRequest.of(0, count));
    }
}
