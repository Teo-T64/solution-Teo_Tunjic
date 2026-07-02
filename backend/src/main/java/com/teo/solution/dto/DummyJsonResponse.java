package com.teo.solution.dto;

import java.util.List;

public record DummyJsonResponse(
        List<DummyJsonProduct> products,
        Integer total,
        Integer skip,
        Integer limit
) {}