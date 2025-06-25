package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class These {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomDoctorant;
    private String prenomDoctorant;
    private String titreThese;
    private String specialite;
    private String anneeUniversitaire;
    private LocalDate dateSoutenance;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "these_directeur",
        joinColumns = @JoinColumn(name = "these_id"),
        inverseJoinColumns = @JoinColumn(name = "directeur_id")
    )
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    private Set<Directeur> directeurs = new HashSet<>();

    public These() {}

    public These(String nomDoctorant, String prenomDoctorant, String titreThese, String specialite,
                 String anneeUniversitaire, LocalDate dateSoutenance) {
        this.nomDoctorant = nomDoctorant;
        this.prenomDoctorant = prenomDoctorant;
        this.titreThese = titreThese;
        this.specialite = specialite;
        this.anneeUniversitaire = anneeUniversitaire;
        this.dateSoutenance = dateSoutenance;
    }

    // Getters et setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomDoctorant() {
        return nomDoctorant;
    }

    public void setNomDoctorant(String nomDoctorant) {
        this.nomDoctorant = nomDoctorant;
    }

    public String getPrenomDoctorant() {
        return prenomDoctorant;
    }

    public void setPrenomDoctorant(String prenomDoctorant) {
        this.prenomDoctorant = prenomDoctorant;
    }

    public String getTitreThese() {
        return titreThese;
    }

    public void setTitreThese(String titreThese) {
        this.titreThese = titreThese;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getAnneeUniversitaire() {
        return anneeUniversitaire;
    }

    public void setAnneeUniversitaire(String anneeUniversitaire) {
        this.anneeUniversitaire = anneeUniversitaire;
    }

    public LocalDate getDateSoutenance() {
        return dateSoutenance;
    }

    public void setDateSoutenance(LocalDate dateSoutenance) {
        this.dateSoutenance = dateSoutenance;
    }

    public Set<Directeur> getDirecteurs() {
        return directeurs;
    }

    public void setDirecteurs(Set<Directeur> directeurs) {
        this.directeurs = directeurs;
    }
}
