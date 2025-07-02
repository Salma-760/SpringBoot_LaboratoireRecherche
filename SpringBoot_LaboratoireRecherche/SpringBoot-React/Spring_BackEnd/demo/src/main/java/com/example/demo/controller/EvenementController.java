package com.example.demo.controller;

import com.example.demo.dto.EvenementDTO;
import com.example.demo.model.Evenement;
import com.example.demo.repository.EvenementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evenements")
@CrossOrigin(origins = "http://localhost:3000")
public class EvenementController {

    @Autowired
    private EvenementRepository repository;

    // === MAPPER intégré ===
    private EvenementDTO toDTO(Evenement e) {
        if (e == null) return null;
        return new EvenementDTO(
                e.getId(),
                e.getTitre(),
                e.getDescription(),
                e.getDateDebut(),
                e.getDateFin(),
                e.getLieu(),
                e.getImageUrl()
        );
    }

    private Evenement toEntity(EvenementDTO dto) {
        if (dto == null) return null;
        Evenement e = new Evenement();
        e.setId(dto.getId());
        e.setTitre(dto.getTitre());
        e.setDescription(dto.getDescription());
        e.setDateDebut(dto.getDateDebut());
        e.setDateFin(dto.getDateFin());
        e.setLieu(dto.getLieu());
        e.setImageUrl(dto.getImageUrl());
        return e;
    }

    // === ENDPOINTS ===

    @GetMapping
    public List<EvenementDTO> getAllEvenements() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/prochains")
    public List<EvenementDTO> getUpcomingEvents(@RequestParam(defaultValue = "3") int count) {
        return repository.findByDateDebutAfterOrderByDateDebutAsc(Instant.now(), PageRequest.of(0, count))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<EvenementDTO> createEvenement(@RequestBody EvenementDTO dto) {
        Evenement saved = repository.save(toEntity(dto));
        return ResponseEntity.ok(toDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Long id) {
        Optional<Evenement> evenement = repository.findById(id);
        if (evenement.isPresent()) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
