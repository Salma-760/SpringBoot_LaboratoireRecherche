package com.example.demo.repository;

import com.example.demo.model.Publication;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
@Repository
public interface PublicationRepository extends CrudRepository<Publication, Long> {

    @Query("SELECT DISTINCT p FROM Publication p LEFT JOIN FETCH p.auteurs")
    List<Publication> findAllWithAuteurs();
    @Query("SELECT p FROM Publication p LEFT JOIN FETCH p.auteurs WHERE p.id = :id")
    Optional<Publication> findByIdWithAuteurs(@Param("id") Long id);

    boolean existsById(@Param("id") Long id);

    void deleteById(@Param("id")Long id);

    List<Publication> findAll();
}
