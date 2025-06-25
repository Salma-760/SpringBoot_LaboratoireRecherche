package com.example.demo.model;

import jakarta.persistence.*;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Livre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String intituleLivre;
    private String isbn;
    private String maisonEdition;
    private int anneeParution;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "livre_auteur",
        joinColumns = @JoinColumn(name = "livre_id"),
        inverseJoinColumns = @JoinColumn(name = "auteur_id")
    )
    private Set<Auteur> auteurs;

    public Livre() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIntituleLivre() {
        return intituleLivre;
    }

    public void setIntituleLivre(String intituleLivre) {
        this.intituleLivre = intituleLivre;
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

    public int getAnneeParution() {
        return anneeParution;
    }

    public void setAnneeParution(int anneeParution) {
        this.anneeParution = anneeParution;
    }

    public Set<Auteur> getAuteurs() {
		return auteurs;
	}

	public void setAuteurs(Set<Auteur> auteurs) {
		this.auteurs = auteurs;
	}

}
