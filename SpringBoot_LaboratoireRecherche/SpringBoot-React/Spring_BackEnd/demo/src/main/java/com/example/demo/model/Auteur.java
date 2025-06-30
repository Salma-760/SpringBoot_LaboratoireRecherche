package com.example.demo.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Auteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;

    @ManyToMany(mappedBy = "auteurs")
    @JsonIgnore 
    private Set<Publication> publications = new HashSet<>();

    @ManyToMany(mappedBy = "auteurs")
    @JsonIgnore 
    private Set<Chapitre> chapitres = new HashSet<>();

    @ManyToMany(mappedBy = "auteurs")
    @JsonIgnore 
    private Set<Livre> livres = new HashSet<>();

    // === Getters et Setters ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Set<Publication> getPublications() { return publications; }
    public void setPublications(Set<Publication> publications) { this.publications = publications; }

    public Set<Chapitre> getChapitres() { return chapitres; }
    public void setChapitres(Set<Chapitre> chapitres) { this.chapitres = chapitres; }

    public Set<Livre> getLivres() { return livres; }
    public void setLivres(Set<Livre> livres) { this.livres = livres; }

    // === equals et hashCode basés sur id ===
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Auteur)) return false;
        Auteur auteur = (Auteur) o;
        return id != null && id.equals(auteur.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
