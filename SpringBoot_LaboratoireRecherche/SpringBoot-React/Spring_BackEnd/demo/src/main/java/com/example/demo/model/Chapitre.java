package com.example.demo.model;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Chapitre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	private String intituleChapitre;
    private String titreLivre;
    private String isbn;
    private String maisonEdition;
    private int anneePublication;
    private int pageDebut;
    private int pageFin;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "chapitre_auteur",
        joinColumns = @JoinColumn(name = "chapitre_id"),
        inverseJoinColumns = @JoinColumn(name = "auteur_id")
    )
    private Set<Auteur> auteurs;
    public Chapitre() {
        
    }
    public Chapitre(Long id, String intituleChapitre, String titreLivre, String isbn, String maisonEdition,
			int anneePublication, int pageDebut, int pageFin, Set<Auteur> auteurs) {
		super();
		this.id = id;
		this.intituleChapitre = intituleChapitre;
		this.titreLivre = titreLivre;
		this.isbn = isbn;
		this.maisonEdition = maisonEdition;
		this.anneePublication = anneePublication;
		this.pageDebut = pageDebut;
		this.pageFin = pageFin;
		this.auteurs = auteurs;
	}

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

	public Set<Auteur> getAuteurs() {
		return auteurs;
	}

	public void setAuteurs(Set<Auteur> auteurs) {
		this.auteurs = auteurs;
	}
    
}
