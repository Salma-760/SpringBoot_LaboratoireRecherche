package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UtilisateurDTO;
import com.example.demo.model.Utilisateur;


@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

  

    /**
     * Endpoint pour récupérer les informations de l'utilisateur actuellement authentifié.
     * Spring Security injecte l'utilisateur connecté grâce à @AuthenticationPrincipal.
     */
    @GetMapping("/me")
    public ResponseEntity<UtilisateurDTO> getCurrentUser(@AuthenticationPrincipal Utilisateur utilisateurDetails) {
        // Il est crucial de ne pas renvoyer l'entité JPA directement (surtout avec le mot de passe !)
        // On utilise un DTO (Data Transfer Object) pour ne renvoyer que les données nécessaires.
        if (utilisateurDetails == null) {
            // Cela ne devrait pas arriver si l'endpoint est bien sécurisé, mais c'est une bonne pratique
            return ResponseEntity.status(401).build(); 
        }
        
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateurDetails.getIdUtilisateur());
        dto.setNom(utilisateurDetails.getNom());
        dto.setEmail(utilisateurDetails.getEmail());
        // Ajoute d'autres champs si nécessaire, comme le grade pour un chercheur
        // dto.setGrade(utilisateurDetails.getGrade()); 

        return ResponseEntity.ok(dto);
    }
}


