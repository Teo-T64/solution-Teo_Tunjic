package com.teo.solution.service.favorites;

import com.teo.solution.dto.ProductResponseDTO;
import java.util.List;

public interface FavoriteService {
    void addFavorite(String token, Long productId);
    void removeFavorite(String token, Long productId);
    List<ProductResponseDTO> getFavorites(String token);
}