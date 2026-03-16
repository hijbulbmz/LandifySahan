package com.landify.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.landify.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) 
            throws IOException {
        response.setStatus(401);
        response.setContentType("application/json");
        ApiResponse<Object> apiResponse = ApiResponse.error("Unauthorized");
        PrintWriter writer = response.getWriter();
        writer.write(objectMapper.writeValueAsString(apiResponse));
        writer.flush();
    }
}
