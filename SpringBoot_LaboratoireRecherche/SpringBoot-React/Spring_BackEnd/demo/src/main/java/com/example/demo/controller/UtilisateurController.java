package com.example.demo.controller;

import com.example.demo.dto.UtilisateurDTO;
import com.example.demo.dto.UtilisateurUpdateDTO; 
import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.service.UtilisateurService;
import com.example.demo.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService = new UtilisateurService(); 

    @GetMapping("/me")
    public ResponseEntity<UtilisateurDTO> getMonProfil() {
        // C'est beaucoup plus propre et sécurisé d'utiliser le contexte de sécurité
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        UtilisateurDTO dto = utilisateurService.getUtilisateurDTOByEmail(userEmail);
        return ResponseEntity.ok(dto);
    }
    
    @PutMapping("/me")
    public ResponseEntity<UtilisateurDTO> updateMonProfil(@RequestBody UtilisateurUpdateDTO updateDTO) {
        // 1. Obtenir l'email de l'utilisateur actuellement authentifié
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        // 2. Appeler le service pour effectuer la mise à jour
        UtilisateurDTO updatedUserDTO = utilisateurService.updateUtilisateur(userEmail, updateDTO);

        // 3. Renvoyer les informations mises à jour
        return ResponseEntity.ok(updatedUserDTO);
    }
}