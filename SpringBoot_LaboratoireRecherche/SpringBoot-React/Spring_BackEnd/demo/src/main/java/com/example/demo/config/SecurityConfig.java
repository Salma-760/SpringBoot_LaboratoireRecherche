package com.example.demo.config; 

import com.example.demo.security.JwtFilter;
import com.example.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthService authService = new AuthService();
    
    private final JwtFilter jwtFilter = new JwtFilter(); 

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(authService)
                .passwordEncoder(passwordEncoder);
        return authenticationManagerBuilder.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                
                .authorizeHttpRequests(auth -> auth
                        //Authentification : tout le monde peut s'authentifier
                        .requestMatchers("/api/auth/**").permitAll()

                        //Contenu public : tout le monde peut voir le contenu public du site
                        //    On utilise HttpMethod.GET pour être plus spécifique et sécurisé.
                        .requestMatchers(HttpMethod.GET, "/api/actualites/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/evenements/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/publications/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/projets/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/equipe/**").permitAll()
                        // on doit Ajouter ici toutes les autres routes que nous voulons rendre publiques en lecture seule
                        
                         //les routes protégees
                        //  Profil utilisateur : un utilisateur authentifié peut gérer son propre profil
                        .requestMatchers(HttpMethod.GET, "/api/utilisateurs/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/utilisateurs/me").authenticated()

                        //Espace chercheur : seules les personnes avec le rôle CHERCHEUR ou ADMIN peuvent y accéder
                         .requestMatchers("/api/chercheur/**").hasAnyRole("CHERCHEUR", "ADMIN")
                        
                        //Espace admin : seul un ADMIN peut y accéder
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // ==========================================================
                        // ===================== RÈGLE FINALE =======================
                        // ==========================================================
                        
                        //Regle par défaut : toute autre requête non listée ci-dessus
                        //    doit être authentifiée.
                        .anyRequest().authenticated()
                )
                
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}