package com.teo.solution.dto;

public record DummyJsonProduct(
        Long id,
        String title,
        String description,
        Double price,
        String category,
        String thumbnail
) {}