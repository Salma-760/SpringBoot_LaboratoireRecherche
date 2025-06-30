package com.example.demo.dto;


import lombok.Data;

@Data
public class UtilisateurUpdateDTO {
 private String nom;
 private String email;
 // on n'inclue PAS le rôle ou le mot de passe ici !
public String getNom() {
	return nom;
}
public void setNom(String nom) {
	this.nom = nom;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
}