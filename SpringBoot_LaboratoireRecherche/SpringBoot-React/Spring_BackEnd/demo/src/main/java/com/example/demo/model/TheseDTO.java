package com.example.demo.model;



import java.time.LocalDate;
import java.util.List;

public class TheseDTO {
    private Long id;
    private String nomDoctorant;
    private String prenomDoctorant;
    private String titreThese;
    private String specialite;
    private String anneeUniversitaire;
    private LocalDate dateSoutenance;
    private List<DirecteurDTO> directeurs;

    // constructeur avec tous les champs
    public TheseDTO(Long id, String nomDoctorant, String prenomDoctorant, String titreThese, String specialite, String anneeUniversitaire, LocalDate dateSoutenance, List<DirecteurDTO> directeurs) {
        this.id = id;
        this.nomDoctorant = nomDoctorant;
        this.prenomDoctorant = prenomDoctorant;
        this.titreThese = titreThese;
        this.specialite = specialite;
        this.anneeUniversitaire = anneeUniversitaire;
        this.dateSoutenance = dateSoutenance;
        this.directeurs = directeurs;
    }

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

	public List<DirecteurDTO> getDirecteurs() {
		return directeurs;
	}

	public void setDirecteurs(List<DirecteurDTO> directeurs) {
		this.directeurs = directeurs;
	}

    
}

