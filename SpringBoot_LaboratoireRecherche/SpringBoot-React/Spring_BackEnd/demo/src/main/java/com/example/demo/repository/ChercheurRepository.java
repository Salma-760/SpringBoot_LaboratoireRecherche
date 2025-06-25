package com.example.demo.repository;

import com.example.demo.model.Chercheur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChercheurRepository extends JpaRepository<Chercheur, Long> {
}
