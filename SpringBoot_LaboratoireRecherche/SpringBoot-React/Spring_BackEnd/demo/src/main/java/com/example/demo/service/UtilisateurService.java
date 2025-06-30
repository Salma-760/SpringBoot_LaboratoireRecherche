package com.example.demo.service;

import com.example.demo.dto.UtilisateurDTO;
import com.example.demo.dto.UtilisateurUpdateDTO;
import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

 private final UtilisateurRepository utilisateurRepository;

 public UtilisateurService(UtilisateurRepository utilisateurRepository) {
	super();
	this.utilisateurRepository = utilisateurRepository;
}

// Méthode pour GET /me
 @Transactional(readOnly = true)
 public UtilisateurDTO getUtilisateurDTOByEmail(String email) {
     Utilisateur user = utilisateurRepository.findByEmail(email);
     if (user == null) {
         throw new UsernameNotFoundException("Utilisateur introuvable avec l'email: " + email);
     }
     return new UtilisateurDTO(user.getIdUtilisateur(), user.getNom(), user.getEmail(), user.getRole());
 }

 // Méthode pour PUT /me
 @Transactional
 public UtilisateurDTO updateUtilisateur(String email, UtilisateurUpdateDTO updateDTO) {
     Utilisateur userToUpdate = utilisateurRepository.findByEmail(email);
     if (userToUpdate == null) {
         throw new UsernameNotFoundException("Utilisateur introuvable avec l'email: " + email);
     }

     // Mettre à jour les champs autorisés
     userToUpdate.setNom(updateDTO.getNom());
     userToUpdate.setEmail(updateDTO.getEmail());
     // Note: une vraie application vérifierait si le nouvel email n'est pas déjà pris

     Utilisateur updatedUser = utilisateurRepository.save(userToUpdate);

     return new UtilisateurDTO(updatedUser.getIdUtilisateur(), updatedUser.getNom(), updatedUser.getEmail(), updatedUser.getRole());
 }
}