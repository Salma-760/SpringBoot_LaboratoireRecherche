package com.example.demo.model;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderTest {
    public static void main(String[] args) {
        String password = "123";
        String hashedPassword = new BCryptPasswordEncoder().encode(password);
        System.out.println("Mot de passe encodé : " + hashedPassword);
    }
}
