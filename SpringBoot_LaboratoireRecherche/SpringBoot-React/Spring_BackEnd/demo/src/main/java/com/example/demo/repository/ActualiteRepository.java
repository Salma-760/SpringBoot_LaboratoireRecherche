package com.example.demo.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Actualite;

import java.util.List;

public interface ActualiteRepository extends JpaRepository<Actualite, Long> {
    // Trouve les N dernières actualités par date de publication décroissante
    List<Actualite> findByOrderByDatePublicationDesc(Pageable pageable);
    //Pageable:Interface pour représenter les infos de pagination (page, taille, tri).
}