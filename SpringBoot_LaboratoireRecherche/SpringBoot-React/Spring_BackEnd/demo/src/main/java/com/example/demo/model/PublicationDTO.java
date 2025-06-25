package com.example.demo.model;

import java.util.Set;

public class PublicationDTO {
    private Long id;
    private String titre;
    private String journal;
    private Set<String> baseIndexation;  // camelCase
    private Integer annee;
    private int volume;
    private int pages;
    private String doi;
    private Set<AuteurDTO> auteurs;

    public PublicationDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getJournal() { return journal; }
    public void setJournal(String journal) { this.journal = journal; }

    public Set<String> getBaseIndexation() { return baseIndexation; }
    public void setBaseIndexation(Set<String> baseIndexation) { this.baseIndexation = baseIndexation; }

    public Integer getAnnee() { return annee; }
    public void setAnnee(int annee) { this.annee = annee; }

    public int getVolume() { return volume; }
    public void setVolume(int volume) { this.volume = volume; }

    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }

    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }

    public Set<AuteurDTO> getAuteurs() { return auteurs; }
    public void setAuteurs(Set<AuteurDTO> auteurs) { this.auteurs = auteurs; }
}
