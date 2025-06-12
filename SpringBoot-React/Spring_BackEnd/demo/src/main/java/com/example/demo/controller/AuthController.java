package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Utilisateur;
import com.example.demo.service.AuthService;

import lombok.AllArgsConstructor;
import lombok.Data;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Utilisateur user = authService.authenticate(request.getEmail(), request.getMotPasse());
        return ResponseEntity.ok(new AuthResponse(user.getIdUtilisateur(), user.getRole().name()));
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String motPasse;
    }

    @Data
    @AllArgsConstructor
    public static class AuthResponse {
        private Integer idUtilisateur;
        private String role;
    }

}

