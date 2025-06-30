package com.example.demo.repository;

import com.example.demo.model.Chapitre;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChapitreRepository extends JpaRepository<Chapitre, Long> {
	@Query("SELECT DISTINCT c FROM Chapitre c LEFT JOIN FETCH c.auteurs")
    List<Chapitre> findAllWithAuteurs();
}
