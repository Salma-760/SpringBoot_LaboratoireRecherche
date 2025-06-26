package com.example.demo.controller;

import com.example.demo.model.MembreEquipe;
import com.example.demo.repository.MembreEquipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/equipe")
public class MembreEquipeController {

 @Autowired
 private MembreEquipeRepository repository;

 @GetMapping
 public List<MembreEquipe> getAllMembres() {
     // On peut trier ici si nécessaire par rôle ou par nom
     return repository.findAll();
 }
}
