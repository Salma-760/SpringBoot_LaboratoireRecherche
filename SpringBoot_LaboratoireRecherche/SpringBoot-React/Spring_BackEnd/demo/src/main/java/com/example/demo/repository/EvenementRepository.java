package com.example.demo.repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Evenement;

import java.time.Instant;
import java.util.List;

public interface EvenementRepository extends JpaRepository<Evenement, Long> {
    // Trouve les N prochains événements (ceux qui n'ont pas encore eu lieu)
    List<Evenement> findByDateDebutAfterOrderByDateDebutAsc(Instant now, Pageable pageable);
}