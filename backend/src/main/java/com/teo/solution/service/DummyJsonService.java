package com.teo.solution.service;

import com.teo.solution.dto.DummyJsonProduct;
import com.teo.solution.dto.DummyJsonResponse;
import com.teo.solution.dto.ProductResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class DummyJsonService implements ProductService {

    private final RestClient restClient;

    public DummyJsonService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://dummyjson.com")
                .build();
    }

    @Override
    public List<ProductResponseDTO> getAllProducts() {
        DummyJsonResponse wrapper = restClient.get()
                .uri("/products")
                .retrieve()
                .body(DummyJsonResponse.class);

        return fetchAndMapList(wrapper);
    }

    @Override
    public ProductResponseDTO getProductById(Long id) {
        DummyJsonProduct rawProduct = restClient.get()
                .uri("/products/" + id)
                .retrieve()
                .body(DummyJsonProduct.class);

        return convertToDTO(rawProduct);
    }

    @Override
    public List<ProductResponseDTO> filterProducts(String category, Double minPrice, Double maxPrice) {
        String uri = (category != null && !category.isEmpty())
                ? "/products/category/" + category
                : "/products";

        DummyJsonResponse wrapper = restClient.get()
                .uri(uri)
                .retrieve()
                .body(DummyJsonResponse.class);

        if (wrapper == null || wrapper.products() == null) {
            return List.of();
        }

        return wrapper.products().stream()
                .filter(p -> minPrice == null || p.price() >= minPrice)
                .filter(p -> maxPrice == null || p.price() <= maxPrice)
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<ProductResponseDTO> searchProducts(String query) {
        DummyJsonResponse wrapper = restClient.get()
                .uri("/products/search?q=" + query)
                .retrieve()
                .body(DummyJsonResponse.class);

        return fetchAndMapList(wrapper);
    }

    private List<ProductResponseDTO> fetchAndMapList(DummyJsonResponse wrapper) {
        if (wrapper == null || wrapper.products() == null) {
            return List.of();
        }
        return wrapper.products().stream()
                .map(this::convertToDTO)
                .toList();
    }

    private ProductResponseDTO convertToDTO(DummyJsonProduct raw) {
        if (raw == null) return null;

        String shortDesc = raw.description();
        if (shortDesc != null && shortDesc.length() > 100) {
            shortDesc = shortDesc.substring(0, 100) + "...";
        }

        return ProductResponseDTO.builder()
                .id(raw.id())
                .title(raw.title())
                .description(shortDesc)
                .price(raw.price())
                .category(raw.category())
                .thumbnail(raw.thumbnail())
                .build();
    }
}