package com.example.demo.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.example.demo.repository.DirecteurRepository;

@RestController
@RequestMapping("/directeurs")
@CrossOrigin(origins = "http://localhost:3000")
public class DirecteurController {

    @Autowired
    private DirecteurRepository directeurRepository;

    @GetMapping
    public List<Directeur> getAll() {
        return directeurRepository.findAll();
    }

    @PostMapping
    public Directeur add(@RequestBody Directeur directeur) {
        return directeurRepository.save(directeur);
    }

    @PutMapping("/{id}")
    public Directeur update(@PathVariable(name="id") Long id, @RequestBody Directeur d) {
        return directeurRepository.findById(id).map(dir -> {
            dir.setNom(d.getNom());
            dir.setPrenom(d.getPrenom());
            return directeurRepository.save(dir);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name="id") Long id) {
        directeurRepository.deleteById(id);
    }
}
