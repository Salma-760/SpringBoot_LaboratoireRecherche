package com.example.demo.model;

import jakarta.persistence.*;
import java.util.HashSet;
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

    public String getPrenom() {
		return prenom;
	}
	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}
	private String nom;
    private String prenom;
    
    private String email;

    public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	@ManyToMany(mappedBy = "auteurs")
    @JsonIgnore 
    private Set<Publication> publications = new HashSet<>();
	@ManyToMany(mappedBy = "auteurs")
	@JsonIgnore
    private Set<Chapitre> chapitres;
	@ManyToMany(mappedBy = "auteurs")
	 @JsonIgnore 
   private Set<Livre> livres;
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public Set<Publication> getPublications() { return publications; }
    public void setPublications(Set<Publication> publications) { this.publications = publications; }
}