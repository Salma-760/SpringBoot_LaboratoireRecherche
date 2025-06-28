package com.example.demo.repository;

import com.example.demo.model.Auteur;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuteurRepository extends JpaRepository<Auteur, Long> {
	 Optional<Auteur> findByNomAndPrenom(String nom, String prenom);
	 Optional<Auteur> findByEmail(String email);
	 
}
