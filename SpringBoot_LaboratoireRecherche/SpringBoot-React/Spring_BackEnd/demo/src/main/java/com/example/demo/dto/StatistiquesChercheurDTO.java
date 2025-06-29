package com.example.demo.dto;

import java.util.Map;

import lombok.Data;

@Data
public class StatistiquesChercheurDTO {

 private long totalPublications;
 private long publicationsValidees;
 private long publicationsEnAttente;
 private long publicationsRefusees;
 
 private Map<Integer, Long> publicationsParAnnee;
}
