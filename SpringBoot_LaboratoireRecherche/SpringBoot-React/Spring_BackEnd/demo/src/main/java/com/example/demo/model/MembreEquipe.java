package com.example.demo.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MembreEquipe {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String nomComplet;
 private String role; 
 private String specialite; 
 
 @Column(length = 1000)
 private String biographie;
 
 private String imageUrl; 

}