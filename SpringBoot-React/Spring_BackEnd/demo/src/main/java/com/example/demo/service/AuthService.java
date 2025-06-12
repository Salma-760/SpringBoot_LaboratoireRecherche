package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import java.util.Optional; // Assurez-vous d'avoir cet import

@Service
public class AuthService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Utilisateur authenticate(String email, String motDePasseBrut) {
        Optional<Utilisateur> userOptional = utilisateurRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            System.out.println("DEBUG: Aucun utilisateur trouvé pour l'email: " + email);
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        Utilisateur user = userOptional.get();
        String motDePasseHashe = user.getMotPasse();

        System.out.println("DEBUG: Tentative de connexion pour l'email: " + email);
        System.out.println("DEBUG: Mot de passe fourni (brut): " + motDePasseBrut);
        System.out.println("DEBUG: Mot de passe stocké (hashé): " + motDePasseHashe);

        boolean correspond = passwordEncoder.matches(motDePasseBrut, motDePasseHashe);
        System.out.println("DEBUG: La comparaison des mots de passe retourne: " + correspond);

        if (!correspond) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        return user;
    }
}