package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Etudiant;
import com.example.demo.repository.EtudiantRepository;
import com.example.demo.service.EtudiantService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/etudiants")
public class EtudiantController {

    
    @Autowired
    private EtudiantService etudiantRepository;

    // Ajouter un étudiant
    @PostMapping
    public Etudiant ajouterEtudiant(@RequestBody Etudiant etudiant) {
        return etudiantRepository.save(etudiant);
    }

    /* Lister tous les étudiants
    @GetMapping
    public List<Etudiant> getEtudiants() {
        return etudiantRepository.;
    }*/
}
