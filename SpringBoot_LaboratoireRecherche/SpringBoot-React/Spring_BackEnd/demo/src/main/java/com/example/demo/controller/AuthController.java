package com.example.demo.controller;

import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
// @RequiredArgsConstructor supprimé car remplacé par le constructeur manuel
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    // ✅ Constructeur manuel ajouté
    public AuthController(UtilisateurRepository utilisateurRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          AuthenticationManager authenticationManager) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

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
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            utilisateurRequest.getEmail(),
                            utilisateurRequest.getMotPasse()
                    )
            );

            org.springframework.security.core.userdetails.UserDetails userDetails =
                    (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();

            String email = userDetails.getUsername();

            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .orElseThrow(() -> new IllegalStateException("Le rôle de l'utilisateur n'a pas été trouvé."));

            String token = jwtUtil.generateToken(email, role);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("type", "Bearer");

            return ResponseEntity.ok(responseData);

        } catch (AuthenticationException e) {
            log.error("Échec de l'authentification pour l'email {}: {}", utilisateurRequest.getEmail(), e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Email ou mot de passe invalide.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}
