package com.landify.common.exception;

import com.landify.common.response.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ApiResponse<Object> response = ApiResponse.error("Validation failed");
        response.setErrors(errors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Object>> handleApiException(ApiException ex) {
        return new ResponseEntity<>(
                ApiResponse.error(ex.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex
    ) {
        return ResponseEntity.badRequest().body(
                ApiResponse.error("Invalid request format or enum value")
        );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleEntityNotFoundException(EntityNotFoundException ex) {
        return new ResponseEntity<>(
                ApiResponse.error("Resource not found"),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return new ResponseEntity<>(
                ApiResponse.error("You are not authorized"),
                HttpStatus.FORBIDDEN
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(
                ApiResponse.error("Invalid argument: " + ex.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrityException(DataIntegrityViolationException ex) {
        log.error("Database integrity violation: ", ex);
        
        String message = "Database constraint violation";
        if (ex.getMostSpecificCause() != null) {
            String cause = ex.getMostSpecificCause().getMessage().toLowerCase();
            if (cause.contains("email")) {
                message = "Email already exists";
            } else if (cause.contains("phone")) {
                message = "Phone number already registered";
            }
        }

        return new ResponseEntity<>(
                ApiResponse.error(message),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception ex) {
        log.error("Unexpected error occurred: ", ex);
        return new ResponseEntity<>(
                ApiResponse.error("Something went wrong"),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
