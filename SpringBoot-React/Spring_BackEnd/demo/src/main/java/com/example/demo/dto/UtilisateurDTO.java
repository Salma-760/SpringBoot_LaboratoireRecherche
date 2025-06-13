package com.example.demo.dto;


public class UtilisateurDTO {
 private Integer id;
 private String nom;
 private String email;
public Integer getId() {
	return id;
}
public void setId(Integer idUtilisateur) {
	this.id=idUtilisateur;
}
public void setEmail(String e) {
	this.email=e;
}
public String getEmail() {
	return email;
}
public void setNom(String nom) {
	this.nom=nom;
}
public String getNom() {
	return this.nom;
}
}