package com.example.demo.repository;


import com.example.demo.model.Directeur;
import com.example.demo.model.Publication;
import com.example.demo.model.These;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TheseRepository extends JpaRepository<These, Long> {
	

	@Query("SELECT DISTINCT t FROM These t LEFT JOIN FETCH t.directeurs")
    List<These> findAllWithDirecteurs();
}
