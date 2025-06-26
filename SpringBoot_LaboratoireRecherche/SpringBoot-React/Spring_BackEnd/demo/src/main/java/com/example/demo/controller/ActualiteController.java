package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Actualite;
import com.example.demo.repository.ActualiteRepository;

import java.util.List;

@RestController
@RequestMapping("/api/actualites")
@CrossOrigin(origins = "http://localhost:3000")
public class ActualiteController {
    @Autowired private ActualiteRepository repository;
    //@Autowired:Injection automatique de dépendence

    @GetMapping
    public List<Actualite> getAllActualites() {
        return repository.findAll();
    }

    // Endpoint pour la page d'accueil, ex: /api/actualites/recentes?count=3
    @GetMapping("/recentes")
    public List<Actualite> getRecentActualites(@RequestParam(defaultValue = "3") int count) {
        return repository.findByOrderByDatePublicationDesc(PageRequest.of(0, count));
    }
    //Endpoint pour récuperer les détails d'une actualité
    @GetMapping("/{id}")
    public ResponseEntity<Actualite> getActualiteById(@PathVariable Long id) {
        // repository.findById(id) renvoie un Optional<Actualite>
        // .map() est exécuté si l'Optional contient une valeur
        // .orElse() est exécuté si l'Optional est vide
        return repository.findById(id)
                .map(actualite -> ResponseEntity.ok(actualite)) // Si trouvée renvoie 200 OK avec l'actualité
                .orElse(ResponseEntity.notFound().build());      // Sinon renvoie 404 Not Found
    }
}