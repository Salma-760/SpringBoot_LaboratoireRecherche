package com.example.demo.controller;

import com.example.demo.model.Auteur;
import com.example.demo.model.AuteurDTO;
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

    private AuteurDTO toAuteurDTO(Auteur auteur) {
        System.out.println("toAuteurDTO appelé pour auteur id=" + auteur.getId());
        return new AuteurDTO(auteur.getId(), auteur.getNom(), auteur.getPrenom());
    }

    private LivreDTO toDTO(Livre livre) {
        System.out.println("Conversion Livre -> LivreDTO id=" + livre.getId());
        Set<AuteurDTO> auteursDTO = livre.getAuteurs() != null
            ? livre.getAuteurs().stream()
                .map(this::toAuteurDTO)
                .collect(Collectors.toSet())
            : Collections.emptySet();

        LivreDTO dto = new LivreDTO();
        dto.setId(livre.getId());
        dto.setIntituleLivre(livre.getIntituleLivre());
        dto.setIsbn(livre.getIsbn());
        dto.setMaisonEdition(livre.getMaisonEdition());
        dto.setAnneeParution(livre.getAnneeParution());
        dto.setAuteursDTO(auteursDTO);
        return dto;
    }

    private Livre toEntity(LivreDTO dto) {
        System.out.println("Conversion LivreDTO -> Livre id=" + dto.getId());
        Livre livre = new Livre();
        livre.setId(dto.getId());
        livre.setIntituleLivre(dto.getIntituleLivre());
        livre.setIsbn(dto.getIsbn());
        livre.setMaisonEdition(dto.getMaisonEdition());
        livre.setAnneeParution(dto.getAnneeParution());

        Set<Auteur> auteurs = new HashSet<>();
        if (dto.getAuteursDTO() != null) {
            for (AuteurDTO auteurDTO : dto.getAuteursDTO()) {
                auteurRepository.findById(auteurDTO.getId())
                    .ifPresent(auteur -> {
                        System.out.println("Ajout auteur id=" + auteur.getId() + " au livre");
                        auteurs.add(auteur);
                    });
            }
        }
        livre.setAuteurs(auteurs);

        return livre;
    }

    @GetMapping
    public List<LivreDTO> getAll() {
        System.out.println("GET /api/livres appelé");
        List<Livre> livres = livreRepository.findAll();
        System.out.println("Livres trouvés : " + livres.size());
        return livres.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<LivreDTO> add(@RequestBody LivreDTO dto) {
        System.out.println("POST /api/livres avec dto id=" + dto.getId());
        Livre livre = toEntity(dto);
        Livre savedLivre = livreRepository.save(livre);
        System.out.println("Livre sauvegardé avec id=" + savedLivre.getId());
        return ResponseEntity.ok(toDTO(savedLivre));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivreDTO> update(@PathVariable(name="id") Long id, @RequestBody LivreDTO dto) {
        System.out.println("PUT /api/livres/" + id);
        return livreRepository.findById(id).map(existingLivre -> {
            existingLivre.setIntituleLivre(dto.getIntituleLivre());
            existingLivre.setIsbn(dto.getIsbn());
            existingLivre.setMaisonEdition(dto.getMaisonEdition());
            existingLivre.setAnneeParution(dto.getAnneeParution());

            Set<Auteur> auteurs = new HashSet<>();
            if (dto.getAuteursDTO() != null) {
                for (AuteurDTO auteurDTO : dto.getAuteursDTO()) {
                    auteurRepository.findById(auteurDTO.getId())
                        .ifPresent(auteur -> {
                            System.out.println("Mise à jour auteur id=" + auteur.getId());
                            auteurs.add(auteur);
                        });
                }
            }
            existingLivre.setAuteurs(auteurs);

            Livre savedLivre = livreRepository.save(existingLivre);
            System.out.println("Livre mis à jour avec id=" + savedLivre.getId());
            return ResponseEntity.ok(toDTO(savedLivre));
        }).orElseGet(() -> {
            System.out.println("Livre non trouvé avec id=" + id);
            return ResponseEntity.notFound().build();
        });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name="id") Long id) {
        System.out.println("DELETE /api/livres/" + id);
        if (livreRepository.existsById(id)) {
            livreRepository.deleteById(id);
            System.out.println("Livre supprimé avec id=" + id);
            return ResponseEntity.noContent().build();
        }
        System.out.println("Livre non trouvé pour suppression id=" + id);
        return ResponseEntity.notFound().build();
    }
}
