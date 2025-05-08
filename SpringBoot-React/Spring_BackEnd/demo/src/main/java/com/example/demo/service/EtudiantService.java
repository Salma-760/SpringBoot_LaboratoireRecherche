package com.example.demo.service;

import org.springframework.stereotype.Service;
import com.example.demo.model.Etudiant;
import com.example.demo.repository.EtudiantRepository;

import java.util.Optional;

@Service
public class EtudiantService {

    private final EtudiantRepository etudiantRepo;

    public EtudiantService(EtudiantRepository repo) {
        this.etudiantRepo = repo;
    }

  
    // 🔹 Ajouter ou modifier un étudiant
    public Etudiant save(Etudiant e) {
        return etudiantRepo.save(e);
    }

  
}
