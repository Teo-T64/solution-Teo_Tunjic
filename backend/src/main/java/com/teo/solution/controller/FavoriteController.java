package com.teo.solution.controller;

import com.teo.solution.dto.ProductResponseDTO;
import com.teo.solution.service.favorites.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoritesService;

    public FavoriteController(FavoriteService favoritesService) {
        this.favoritesService = favoritesService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getFavorites(@RequestHeader("Authorization") String token) {
        try {
            return ResponseEntity.ok(favoritesService.getFavorites(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<Void> addFavorite(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            favoritesService.addFavorite(token, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFavorite(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            favoritesService.removeFavorite(token, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}