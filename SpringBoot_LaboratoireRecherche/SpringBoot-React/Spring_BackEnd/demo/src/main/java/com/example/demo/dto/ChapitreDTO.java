package com.example.demo.dto;



import java.util.Set;

public class ChapitreDTO {

    private Long id;
    private String intituleChapitre;
    private String titreLivre;
    private String isbn;
    private String maisonEdition;
    private int anneePublication;
    private int pageDebut;
    private int pageFin;
    
    private Set<Long> auteurIds; // ou List<AuteurDTO> si tu veux afficher les auteurs complets

    public ChapitreDTO() {}

    public ChapitreDTO(Long id, String intituleChapitre, String titreLivre, String isbn,
                       String maisonEdition, int anneePublication, int pageDebut, int pageFin,
                       Set<Long> auteurIds) {
        this.id = id;
        this.intituleChapitre = intituleChapitre;
        this.titreLivre = titreLivre;
        this.isbn = isbn;
        this.maisonEdition = maisonEdition;
        this.anneePublication = anneePublication;
        this.pageDebut = pageDebut;
        this.pageFin = pageFin;
        this.auteurIds = auteurIds;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIntituleChapitre() {
        return intituleChapitre;
    }

    public void setIntituleChapitre(String intituleChapitre) {
        this.intituleChapitre = intituleChapitre;
    }

    public String getTitreLivre() {
        return titreLivre;
    }

    public void setTitreLivre(String titreLivre) {
        this.titreLivre = titreLivre;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getMaisonEdition() {
        return maisonEdition;
    }

    public void setMaisonEdition(String maisonEdition) {
        this.maisonEdition = maisonEdition;
    }

    public int getAnneePublication() {
        return anneePublication;
    }

    public void setAnneePublication(int anneePublication) {
        this.anneePublication = anneePublication;
    }

    public int getPageDebut() {
        return pageDebut;
    }

    public void setPageDebut(int pageDebut) {
        this.pageDebut = pageDebut;
    }

    public int getPageFin() {
        return pageFin;
    }

    public void setPageFin(int pageFin) {
        this.pageFin = pageFin;
    }

    public Set<Long> getAuteurIds() {
        return auteurIds;
    }

    public void setAuteurIds(Set<Long> auteurIds) {
        this.auteurIds = auteurIds;
    }
}
