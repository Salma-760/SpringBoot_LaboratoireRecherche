package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.StatistiquesChercheurDTO;
import com.example.demo.model.Auteur;
import com.example.demo.model.Publication;
import com.example.demo.model.StatutPublication;
import com.example.demo.repository.AuteurRepository;
import com.example.demo.repository.PublicationRepository;

@RestController
@RequestMapping("/api/chercheur-dashboard") 
@CrossOrigin(origins = "http://localhost:3000")
public class ChercheurDashboardController {

    @Autowired
    private PublicationRepository publicationRepo;
    @Autowired
    private AuteurRepository auteurRepo;

    @GetMapping("/statistiques")
    public ResponseEntity<StatistiquesChercheurDTO> getStatistiques(Authentication authentication) {
        //Pour identifier l'auteur connecté
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
       
        Auteur auteurConnecte = auteurRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Auteur non trouvé pour l'email: " + userDetails.getUsername()));
       

        // Pour  Récupérer toutes ses publications une seule fois
        List<Publication> publications = publicationRepo.findPublicationsByAuteurId(auteurConnecte.getId());

        // POur Calculer les statistiques de base avec les Streams Java
        long total = publications.size();
        long validees = publications.stream().filter(p -> p.getStatut() == StatutPublication.VALIDEE).count();
        long enAttente = publications.stream().filter(p -> p.getStatut() == StatutPublication.EN_ATTENTE).count();
        long refusees = publications.stream().filter(p -> p.getStatut() == StatutPublication.REFUSEE).count();

        // Pour Calculer les données pour le graphique : regrouper par année et compter
        Map<Integer, Long> publicationsParAnnee = publications.stream()
                .filter(p -> p.getAnnee() != null)
                .collect(Collectors.groupingBy(
                        Publication::getAnnee,
                        Collectors.counting()
                ));
        
        // Pour  Remplir le DTO avec toutes les informations
        StatistiquesChercheurDTO stats = new StatistiquesChercheurDTO();
        stats.setTotalPublications(total);
        stats.setPublicationsValidees(validees);
        stats.setPublicationsEnAttente(enAttente);
        stats.setPublicationsRefusees(refusees);
        stats.setPublicationsParAnnee(publicationsParAnnee);

        return ResponseEntity.ok(stats);
    }
}