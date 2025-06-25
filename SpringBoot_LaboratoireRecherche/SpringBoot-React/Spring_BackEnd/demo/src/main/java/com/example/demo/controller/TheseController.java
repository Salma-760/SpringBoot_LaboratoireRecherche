package com.example.demo.controller;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Directeur;
import com.example.demo.model.These;
import com.example.demo.repository.DirecteurRepository;
import com.example.demo.repository.TheseRepository;

@RestController
@RequestMapping("/theses")
@CrossOrigin(origins = "http://localhost:3000")
public class TheseController {

    @Autowired
    private TheseRepository theseRepository;

    @Autowired
    private DirecteurRepository directeurRepository;

    @GetMapping
    public List<These> getAll() {
        return theseRepository.findAll();
    }

    @PostMapping
    public These add(@RequestBody These these) {
        Set<Directeur> persistedDirecteurs = these.getDirecteurs().stream()
            .map(d -> directeurRepository.findById(d.getId()).orElse(null))
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        these.setDirecteurs(persistedDirecteurs);
        return theseRepository.save(these);
    }

    @PutMapping("/theses/{id}")
    public These updateThese(@PathVariable(name = "id") Long id, @RequestBody These t) {
        return theseRepository.findById(id).map(existingThese -> {
            existingThese.setNomDoctorant(t.getNomDoctorant());
            existingThese.setPrenomDoctorant(t.getPrenomDoctorant());
            existingThese.setTitreThese(t.getTitreThese());
            existingThese.setSpecialite(t.getSpecialite());
            existingThese.setAnneeUniversitaire(t.getAnneeUniversitaire());
            existingThese.setDateSoutenance(t.getDateSoutenance());

            // 💡 Reconstruction des directeurs à partir de leurs IDs
            List<Directeur> directeurs = t.getDirecteurs().stream()
                .map(d -> directeurRepository.findById(d.getId()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

            existingThese.setDirecteurs((Set<Directeur>) directeurs);

            return theseRepository.save(existingThese);
        }).orElse(null);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name="id") Long id) {
        theseRepository.deleteById(id);
    }
}
