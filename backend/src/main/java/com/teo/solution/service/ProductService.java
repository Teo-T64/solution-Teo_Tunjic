package com.teo.solution.service;

import com.teo.solution.dto.ProductResponseDTO;
import java.util.List;

public interface ProductService {
    List<ProductResponseDTO> getAllProducts();
    ProductResponseDTO getProductById(Long id);
    List<ProductResponseDTO> filterProducts(String category, Double minPrice, Double maxPrice);
    List<ProductResponseDTO> searchProducts(String query);
}