package com.example.demo.model;

import java.util.Set;

public class LivreDTO {
    private Long id;
    private String intituleLivre;
    private String isbn;
    private String maisonEdition;
    private int anneeParution;

    // Remplacer Set<Long> auteursIds par Set<AuteurDTO> auteursDTO
    private Set<AuteurDTO> auteursDTO;

    public LivreDTO() {}

    // Getters et setters

    public Set<AuteurDTO> getAuteursDTO() {
        return auteursDTO;
    }

    public void setAuteursDTO(Set<AuteurDTO> auteursDTO) {
        this.auteursDTO = auteursDTO;
    }

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

	public LivreDTO(Long id, String intituleLivre, String isbn, String maisonEdition, int anneeParution,
			Set<AuteurDTO> auteursDTO) {
		super();
		this.id = id;
		this.intituleLivre = intituleLivre;
		this.isbn = isbn;
		this.maisonEdition = maisonEdition;
		this.anneeParution = anneeParution;
		this.auteursDTO = auteursDTO;
	}
    
    // autres getters/setters...
}
