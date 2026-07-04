package com.teo.solution.service.auth;

import com.teo.solution.dto.auth.AuthResponseDTO;
import com.teo.solution.dto.auth.LoginReqDTO;
import com.teo.solution.service.auth.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class DummyJsonAuthService implements AuthService {

    private final RestClient restClient;

    public DummyJsonAuthService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://dummyjson.com")
                .build();
    }

    @Override
    public AuthResponseDTO login(LoginReqDTO loginRequest) {
        return restClient.post()
                .uri("/auth/login")
                .body(loginRequest)
                .retrieve()
                .body(AuthResponseDTO.class);
    }

    @Override
    public AuthResponseDTO getProfile(String bearerToken) {
        return restClient.get()
                .uri("/auth/me")
                .header("Authorization", bearerToken)
                .retrieve()
                .body(AuthResponseDTO.class);
    }
}