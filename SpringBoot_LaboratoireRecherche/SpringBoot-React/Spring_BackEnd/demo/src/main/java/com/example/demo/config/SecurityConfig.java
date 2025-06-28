package com.example.demo.config;

import com.example.demo.security.JwtFilter;
import com.example.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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
@EnableMethodSecurity // tres important pour que @PreAuthorize fonctionne
public class SecurityConfig {

    private final AuthService authService;
    private final JwtFilter jwtFilter;

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
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
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
                        // ===================== 1. RÈGLES PUBLIQUES (permitAll) =====================
                        // Tout le monde, même non connecté, peut accéder à ces URLs.
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/actualites/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/evenements/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/projets/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/equipe/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/auteurs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/publications").permitAll()

                        // ===================== 2. RÈGLES POUR UTILISATEURS CONNECTÉS (authenticated) =====================
                        // N'importe quel utilisateur connecté, peu importe son rôle.
                       
                        .requestMatchers(HttpMethod.POST, "/publications/soumettre").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/utilisateurs/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/utilisateurs/me").authenticated()

                        // ===================== 3. RÈGLES SPÉCIFIQUES PAR RÔLE (hasRole) =====================
                        
                        .requestMatchers(HttpMethod.GET, "/publications/en-attente").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/publications/*/valider").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/publications/*/refuser").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/publications").hasRole("ADMIN") // Endpoint de création directe par admin
                        .requestMatchers(HttpMethod.PUT, "/publications/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/publications/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ===================== 4. RÈGLE FINALE (Fallback) =====================
                        // Toute autre requête non listée ci-dessus doit être authentifiée.
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}