package com.landify.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.landify.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public CustomAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) 
            throws IOException {
        response.setStatus(403);
        response.setContentType("application/json");
        ApiResponse<Object> apiResponse = ApiResponse.error("You are not authorized");
        PrintWriter writer = response.getWriter();
        writer.write(objectMapper.writeValueAsString(apiResponse));
        writer.flush();
    }
}
