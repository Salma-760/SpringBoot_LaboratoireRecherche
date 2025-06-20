package com.example.demo.dto;

import com.example.demo.model.Utilisateur.Role;

public class UtilisateurDTO {
    private Integer idUtilisateur;
    private String nom;
    private String email;
    private Role role;

    public UtilisateurDTO(Integer idUtilisateur, String nom, String email, Role role) {
        this.idUtilisateur = idUtilisateur;
        this.nom = nom;
        this.email = email;
        this.role = role;
    }

    // Getters
    public Integer getIdUtilisateur() { return idUtilisateur; }
    public String getNom() { return nom; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
}
