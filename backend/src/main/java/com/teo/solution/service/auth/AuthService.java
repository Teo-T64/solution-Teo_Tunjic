package com.teo.solution.service.auth;

import com.teo.solution.dto.AuthResponseDTO;
import com.teo.solution.dto.auth.LoginReqDTO;

public interface AuthService {
    AuthResponseDTO login(LoginReqDTO loginRequest);
    AuthResponseDTO getProfile(String bearerToken);
}