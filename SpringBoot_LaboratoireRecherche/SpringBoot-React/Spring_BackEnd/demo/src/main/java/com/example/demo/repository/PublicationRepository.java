package com.example.demo.repository;

import com.example.demo.model.Publication;
import com.example.demo.model.StatutPublication;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long>, JpaSpecificationExecutor<Publication> {

    @Query("SELECT DISTINCT p FROM Publication p LEFT JOIN FETCH p.auteurs")
    List<Publication> findAllWithAuteurs();

    @Query("SELECT p FROM Publication p LEFT JOIN FETCH p.auteurs WHERE p.id = :id")
    Optional<Publication> findByIdWithAuteurs(@Param("id") Long id);

    @Query("SELECT p FROM Publication p LEFT JOIN FETCH p.auteurs WHERE p.statut = :statut")
    List<Publication> findAllWithAuteursByStatut(@Param("statut") StatutPublication statut);

    @Query("SELECT DISTINCT p FROM Publication p LEFT JOIN FETCH p.auteurs a WHERE a.id = :auteurId ORDER BY p.annee DESC")
    List<Publication> findPublicationsByAuteurId(@Param("auteurId") Long auteurId);

}
