package com.landify.controller;

import com.landify.common.response.ApiResponse;
import com.landify.dto.PaginatedResponse;
import com.landify.dto.property.*;
import com.landify.entity.PropertyCategory;
import com.landify.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> createProperty(
            @Valid @RequestBody PropertyCreateRequest request) {

        PropertyDetailResponse response = propertyService.createProperty(request);

        return ResponseEntity.status(201)
                .body(ApiResponse.success(response, "Property created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<PropertySummaryResponse>>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) PropertyCategory category,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sort) {

        PaginatedResponse<PropertySummaryResponse> propertyPage = propertyService.getAllProperties(
                page, size, category, state, district, minPrice, maxPrice, sort
        );

        return ResponseEntity.ok(
                ApiResponse.success(propertyPage, "Properties fetched successfully")
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyUpdateRequest request) {

        PropertyDetailResponse response = propertyService.updateProperty(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(response, "Property updated successfully")
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProperty(@PathVariable Long id) {

        propertyService.deleteProperty(id);

        return ResponseEntity.ok(
                ApiResponse.success(null, "Property deleted successfully")
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> getPropertyById(@PathVariable Long id) {

        PropertyDetailResponse response = propertyService.getPropertyById(id);

        return ResponseEntity.ok(
                ApiResponse.success(response, "Property fetched successfully")
        );
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PaginatedResponse<OwnerPropertyResponse>>> getMyProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<OwnerPropertyResponse> response =
                propertyService.getMyProperties(page, size);

        return ResponseEntity.ok(
                ApiResponse.success(response, "My properties fetched successfully")
        );
    }
}
