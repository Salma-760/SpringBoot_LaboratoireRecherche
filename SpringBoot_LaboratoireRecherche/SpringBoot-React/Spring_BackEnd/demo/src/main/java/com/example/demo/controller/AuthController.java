package com.example.demo.controller;

import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UtilisateurRepository utilisateurRepository = null;
    private final PasswordEncoder passwordEncoder = null;
    private final JwtUtil jwtUtil = new JwtUtil();
    private final AuthenticationManager authenticationManager = null;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur nouvelUtilisateur) {
        if (utilisateurRepository.findByEmail(nouvelUtilisateur.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé.");
        }
        nouvelUtilisateur.setMotPasse(passwordEncoder.encode(nouvelUtilisateur.getMotPasse()));
        Utilisateur utilisateurEnregistre = utilisateurRepository.save(nouvelUtilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(utilisateurEnregistre);
    }

 
     @PostMapping("/login")
     public ResponseEntity<?> login(@RequestBody Utilisateur utilisateurRequest) {
         try {
             // L'authentification se fait ici. Si elle réussit, on obtient un objet Authentication complet.
             Authentication authentication = authenticationManager.authenticate(
                     new UsernamePasswordAuthenticationToken(
                             utilisateurRequest.getEmail(),
                             utilisateurRequest.getMotPasse()
                     )
             );

            

             // 1. Récupérer les détails de l'utilisateur depuis l'objet Authentication
             //    Le "principal" est l'objet UserDetails que notre AuthService a créé.
             org.springframework.security.core.userdetails.UserDetails userDetails = 
                     (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();

             // 2. Extraire l'email 
             String email = userDetails.getUsername();

             // 3. Extraire le rôle depuis les "authorities"
             String role = userDetails.getAuthorities().stream()
                     .findFirst() // On prend la première autorité (vous n'en avez qu'une par utilisateur)
                     .map(grantedAuthority -> grantedAuthority.getAuthority())
                     .orElseThrow(() -> new IllegalStateException("Le rôle de l'utilisateur n'a pas été trouvé."));

             // 4. Générer le token avec les informations récupérées
             String token = jwtUtil.generateToken(email, role);

             // 5. Construire et renvoyer la réponse
             Map<String, Object> responseData = new HashMap<>();
             responseData.put("token", token);
             responseData.put("type", "Bearer");

             return ResponseEntity.ok(responseData);

         } catch (AuthenticationException e) {
             log.error("Échec de l'authentification pour l'email {}: {}", utilisateurRequest.getEmail(), e.getMessage());
             // Il est préférable de renvoyer un objet JSON pour l'erreur aussi
             Map<String, String> errorResponse = new HashMap<>();
             errorResponse.put("message", "Email ou mot de passe invalide.");
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
         }
     }
}