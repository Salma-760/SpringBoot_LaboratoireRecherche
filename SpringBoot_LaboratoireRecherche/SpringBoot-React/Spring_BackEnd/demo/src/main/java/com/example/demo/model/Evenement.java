package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Data
public class Evenement {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    @Column(length = 1000)
    private String description;
    private Instant dateDebut;
    private Instant dateFin;
    private String lieu;
    private String imageUrl;
}