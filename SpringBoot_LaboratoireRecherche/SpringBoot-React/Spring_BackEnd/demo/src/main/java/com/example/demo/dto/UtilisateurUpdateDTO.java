package com.example.demo.dto;


import lombok.Data;

@Data
public class UtilisateurUpdateDTO {
 private String nom;
 private String email;
 // on n'inclue PAS le rôle ou le mot de passe ici !
}