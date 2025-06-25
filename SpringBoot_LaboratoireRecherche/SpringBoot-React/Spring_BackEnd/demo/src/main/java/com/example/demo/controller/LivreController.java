package com.example.demo.controller;

import com.example.demo.model.Livre;
import com.example.demo.repository.LivreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livres")
@CrossOrigin(origins = "http://localhost:3000")
public class LivreController {

    @Autowired
    private LivreRepository livreRepository;

    @GetMapping
    public List<Livre> getAll() {
        return livreRepository.findAll();
    }

    @PostMapping
    public Livre add(@RequestBody Livre livre) {
        return livreRepository.save(livre);
    }

    @PutMapping("/{id}")
    public Livre update(@PathVariable (name="id")Long id, @RequestBody Livre l) {
        return livreRepository.findById(id).map(livre -> {
            livre.setIntituleLivre(l.getIntituleLivre());
            livre.setIsbn(l.getIsbn());
            livre.setMaisonEdition(l.getMaisonEdition());
            livre.setAnneeParution(l.getAnneeParution());
            livre.setAuteurs(l.getAuteurs());
            return livreRepository.save(livre);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable (name="id")Long id) {
        livreRepository.deleteById(id);
    }
}
