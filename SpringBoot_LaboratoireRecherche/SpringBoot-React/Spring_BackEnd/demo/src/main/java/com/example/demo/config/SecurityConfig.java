package com.example.demo.config;

import com.example.demo.security.JwtFilter;
import com.example.demo.service.AuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final AuthService authService;
    private final JwtFilter jwtFilter;

    public SecurityConfig(AuthService authService, JwtFilter jwtFilter) {
        this.authService = authService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.userDetailsService(authService).passwordEncoder(passwordEncoder);
        return builder.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults(""); // supprime le préfixe ROLE_
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Public access
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/actualites/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/equipe/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/evenements/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/publications/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/missions/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auteurs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/chapitres/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/directeurs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/theses/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/livres/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/evenements/**").permitAll()

                // Cas particulier pour les chercheurs
                .requestMatchers(HttpMethod.POST, "/api/publications/soumettre").hasAnyAuthority("CHERCHEUR", "ADMIN")

                // Ajout explicite autorisé uniquement aux ADMIN
                .requestMatchers(HttpMethod.POST, "/api/evenements").hasAuthority("ADMIN")

                // Protection générale ADMIN
                .requestMatchers(HttpMethod.POST, "/api/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAuthority("ADMIN")

                // Autres requêtes nécessitent une authentification
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
