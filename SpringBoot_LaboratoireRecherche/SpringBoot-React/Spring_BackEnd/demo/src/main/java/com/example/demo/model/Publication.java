package com.example.demo.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String journal;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "publication_base_indexation", joinColumns = @JoinColumn(name = "publication_id"))
    @Column(name = "base_indexation")
    private Set<String> baseIndexation = new HashSet<>();
    @Column(name = "annee")
    private Integer annee;
    private int volume;
    private int pages;
    private String doi;
    
    
    @Enumerated(EnumType.STRING)
    private StatutPublication statut;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "publication_auteur",
        joinColumns = @JoinColumn(name = "publication_id"),
        inverseJoinColumns = @JoinColumn(name = "auteur_id")
    )
    @JsonIgnoreProperties("publications")
    private Set<Auteur> auteurs = new HashSet<>();

    // Getters et Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }
    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getJournal() {
        return journal;
    }
    public void setJournal(String journal) {
        this.journal = journal;
    }

    public Set<String> getBaseIndexation() {
        return baseIndexation;
    }
    public void setBaseIndexation(Set<String> baseIndexation) {
        this.baseIndexation = baseIndexation;
    }
    
    public Integer getAnnee() {
        return annee;
    }
    public void setAnnee(int annee) {
        this.annee = annee;
    }

    public int getVolume() {
        return volume;
    }
    public void setVolume(int volume) {
        this.volume = volume;
    }

    public int getPages() {
        return pages;
    }
    public void setPages(int pages) {
        this.pages = pages;
    }

    public String getDoi() {
        return doi;
    }
    public void setDoi(String doi) {
        this.doi = doi;
    }

    public Set<Auteur> getAuteurs() {
        return auteurs;
    }
    public void setAuteurs(Set<Auteur> auteurs) {
        this.auteurs = auteurs;
    }


    public StatutPublication getStatut() {
        return statut;
    }

    public void setStatut(StatutPublication statut) {
        this.statut = statut;
    }
	
}
