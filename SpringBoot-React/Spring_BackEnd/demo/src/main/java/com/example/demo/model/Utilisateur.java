package com.example.demo.model;
import jakarta.persistence.*; 
@Entity
@Table(name = "Utilisateur")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Integer idUtilisateur;

    private String nom;

    @Column(unique = true)
    private String email;

    @Column(name = "mot_passe") 
    private String motPasse;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        ADMIN,
        CHERCHEUR,
        VISITEUR
    }

    public String getNom() {
    	return this.nom;
    	}
    public void setNom(String nom) {
    	this.nom=nom;
    }
    public void setEmail(String email) {
    	this.email=email;
    }
    public String getEmail() {
    	return this.email;
    	}
    public String getMotPasse() {
    	return this.motPasse;
    	}
    public void setMotPasse(String motpasse) {
    	this.motPasse=motpasse;
    }
    public Integer getIdUtilisateur() {
    	return this.idUtilisateur;
    }
    
    public void setIdUtilisateur(Integer id) {
    	this.idUtilisateur=id;
    }
     public Role getRole() {
    	 return this.role;
     }
      public void setRole(Role role) {
    	  this.role=role;
      }
}
