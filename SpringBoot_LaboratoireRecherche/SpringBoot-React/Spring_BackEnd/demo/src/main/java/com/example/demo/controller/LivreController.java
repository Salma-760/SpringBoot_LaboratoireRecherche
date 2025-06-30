package com.example.demo.controller;

import com.example.demo.model.Auteur;
import com.example.demo.model.Livre;
import com.example.demo.model.LivreDTO;
import com.example.demo.repository.AuteurRepository;
import com.example.demo.repository.LivreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/livres")
@CrossOrigin(origins = "http://localhost:3000")
public class LivreController {

    @Autowired
    private LivreRepository livreRepository;

    @Autowired
    private AuteurRepository auteurRepository;

    // Convertir Livre en LivreDTO
    private LivreDTO toDTO(Livre livre) {
        Set<Long> auteursIds = livre.getAuteurs() != null
            ? livre.getAuteurs().stream().map(Auteur::getId).collect(Collectors.toSet())
            : Collections.emptySet();

        LivreDTO dto = new LivreDTO();
        dto.setId(livre.getId());
        dto.setIntituleLivre(livre.getIntituleLivre());
        dto.setIsbn(livre.getIsbn());
        dto.setMaisonEdition(livre.getMaisonEdition());
        dto.setAnneeParution(livre.getAnneeParution());
        dto.setAuteursIds(auteursIds);
        return dto;
    }

    // Convertir LivreDTO en Livre (pour création ou mise à jour)
    private Livre toEntity(LivreDTO dto) {
        Livre livre = new Livre();
        livre.setId(dto.getId());
        livre.setIntituleLivre(dto.getIntituleLivre());
        livre.setIsbn(dto.getIsbn());
        livre.setMaisonEdition(dto.getMaisonEdition());
        livre.setAnneeParution(dto.getAnneeParution());

        Set<Auteur> auteurs = new HashSet<>();
        if (dto.getAuteursIds() != null) {
            for (Long auteurId : dto.getAuteursIds()) {
                auteurRepository.findById(auteurId).ifPresent(auteurs::add);
            }
        }
        livre.setAuteurs(auteurs);

        return livre;
    }

    @GetMapping
    public List<LivreDTO> getAll() {
        List<Livre> livres = livreRepository.findAll();
        return livres.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<LivreDTO> add(@RequestBody LivreDTO dto) {
        Livre livre = toEntity(dto);
        Livre savedLivre = livreRepository.save(livre);
        return ResponseEntity.ok(toDTO(savedLivre));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivreDTO> update(@PathVariable(name="id") Long id, @RequestBody LivreDTO dto) {
        return livreRepository.findById(id).map(existingLivre -> {
            existingLivre.setIntituleLivre(dto.getIntituleLivre());
            existingLivre.setIsbn(dto.getIsbn());
            existingLivre.setMaisonEdition(dto.getMaisonEdition());
            existingLivre.setAnneeParution(dto.getAnneeParution());

            Set<Auteur> auteurs = new HashSet<>();
            if (dto.getAuteursIds() != null) {
                for (Long auteurId : dto.getAuteursIds()) {
                    auteurRepository.findById(auteurId).ifPresent(auteurs::add);
                }
            }
            existingLivre.setAuteurs(auteurs);

            Livre savedLivre = livreRepository.save(existingLivre);
            return ResponseEntity.ok(toDTO(savedLivre));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name="id") Long id) {
        if (livreRepository.existsById(id)) {
            livreRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
