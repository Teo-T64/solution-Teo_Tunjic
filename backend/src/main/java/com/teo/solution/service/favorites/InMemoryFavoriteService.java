package com.teo.solution.service.favorites;

import com.teo.solution.dto.AuthResponseDTO;
import com.teo.solution.dto.ProductResponseDTO;
import com.teo.solution.service.ProductService;
import com.teo.solution.service.auth.AuthService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InMemoryFavoriteService implements FavoriteService {

    private final AuthService authService;
    private final ProductService productService;

    private final Map<String, Set<Long>> userFavorites = new ConcurrentHashMap<>();

    public InMemoryFavoriteService(AuthService authService, ProductService productService) {
        this.authService = authService;
        this.productService = productService;
    }

    private String getUsernameFromToken(String token) {
        AuthResponseDTO profile = authService.getProfile(token);
        return profile.getUsername();
    }

    @Override
    public void addFavorite(String token, Long productId) {
        String username = getUsernameFromToken(token);
        userFavorites.computeIfAbsent(username, k -> new HashSet<>()).add(productId);
    }

    @Override
    public void removeFavorite(String token, Long productId) {
        String username = getUsernameFromToken(token);
        if (userFavorites.containsKey(username)) {
            userFavorites.get(username).remove(productId);
        }
    }

    @Override
    public List<ProductResponseDTO> getFavorites(String token) {
        String username = getUsernameFromToken(token);
        Set<Long> productIds = userFavorites.getOrDefault(username, Collections.emptySet());

        List<ProductResponseDTO> favoritesList = new ArrayList<>();
        for (Long id : productIds) {
            try {
                favoritesList.add(productService.getProductById(id));
            } catch (Exception ignored){}
        }
        return favoritesList;
    }
}