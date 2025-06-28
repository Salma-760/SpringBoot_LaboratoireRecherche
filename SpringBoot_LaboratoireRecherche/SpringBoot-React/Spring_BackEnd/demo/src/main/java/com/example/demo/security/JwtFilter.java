package com.example.demo.security;

import com.example.demo.service.AuthService;
import io.jsonwebtoken.Claims; // Assurez-vous que cet import est présent
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwt);
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = authService.loadUserByUsername(email);

            if (jwtUtil.isTokenValid(jwt)) {

                // ================== VOICI LE CODE CORRECT ET FINAL ==================

                // 1. On extrait le rôle directement depuis le token.
                String roleFromToken = jwtUtil.extractRole(jwt);
                
                // 2. On crée la liste des autorités en ajoutant le préfixe "ROLE_".
                List<GrantedAuthority> authorities = new ArrayList<>();
                if (roleFromToken != null) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + roleFromToken));
                }
                
                // Log pour vérifier que tout est correct dans la console du backend
                System.out.println("FINAL CHECK - Authorities construites pour " + email + ": " + authorities);

                // 3. On crée le jeton d'authentification avec la liste d'autorités corrigée.
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                // ====================================================================

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}