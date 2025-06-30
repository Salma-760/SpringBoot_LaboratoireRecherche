package com.example.demo.dto;

import java.util.Map;

import lombok.Data;

@Data
public class StatistiquesChercheurDTO {

 private long totalPublications;
 private long publicationsValidees;
 private long publicationsEnAttente;
 private long publicationsRefusees;
 
 private Map<Integer, Long> publicationsParAnnee;

public long getTotalPublications() {
	return totalPublications;
}

public void setTotalPublications(long totalPublications) {
	this.totalPublications = totalPublications;
}

public long getPublicationsValidees() {
	return publicationsValidees;
}

public void setPublicationsValidees(long publicationsValidees) {
	this.publicationsValidees = publicationsValidees;
}

public long getPublicationsEnAttente() {
	return publicationsEnAttente;
}

public void setPublicationsEnAttente(long publicationsEnAttente) {
	this.publicationsEnAttente = publicationsEnAttente;
}

public long getPublicationsRefusees() {
	return publicationsRefusees;
}

public void setPublicationsRefusees(long publicationsRefusees) {
	this.publicationsRefusees = publicationsRefusees;
}

public Map<Integer, Long> getPublicationsParAnnee() {
	return publicationsParAnnee;
}

public void setPublicationsParAnnee(Map<Integer, Long> publicationsParAnnee) {
	this.publicationsParAnnee = publicationsParAnnee;
}
}
