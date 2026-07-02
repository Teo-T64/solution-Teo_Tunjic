package com.teo.solution.dto;

import lombok.Builder;


@Builder
public record ProductResponseDTO(
        Long id,
        String title,
        String description,
        Double price,
        String category,
        String thumbnail
) {}