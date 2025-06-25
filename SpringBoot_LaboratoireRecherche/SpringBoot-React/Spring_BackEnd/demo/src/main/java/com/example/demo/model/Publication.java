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
    private String base_indexation;
    private int annee_publication;
    private int volume;
    private int pages;
    private String doi;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "publication_auteur",
        joinColumns = @JoinColumn(name = "publication_id"),
        inverseJoinColumns = @JoinColumn(name = "auteur_id")
    )
    
    @JsonIgnoreProperties("publications") // << AJOUTER CETTE LIGNE
    private Set<Auteur> auteurs = new HashSet<>();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public String getJournal() { return journal; }
    public void setJournal(String journal) { this.journal = journal; }
    public String getBase_indexation() { return base_indexation; }
    public void setBase_indexation(String base_indexation) { this.base_indexation = base_indexation; }
    public int getAnnee_publication() { return annee_publication; }
    public void setAnnee_publication(int annee_publication) { this.annee_publication = annee_publication; }
    public int getVolume() { return volume; }
    public void setVolume(int volume) { this.volume = volume; }
    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }
    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }
    public Set<Auteur> getAuteurs() { return auteurs; }
    public void setAuteurs(Set<Auteur> auteurs) { this.auteurs = auteurs; }
}

  

