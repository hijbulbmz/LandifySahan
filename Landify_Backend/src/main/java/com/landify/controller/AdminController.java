package com.landify.controller;

import com.landify.common.response.ApiResponse;
import com.landify.dto.property.PropertyDetailResponse;
import com.landify.dto.property.PropertyResponse;
import com.landify.dto.user.UserResponse;
import com.landify.service.PropertyService;
import com.landify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final PropertyService propertyService;
    private final UserService userService;

    /**
     * Get all properties (including deleted and inactive)
     */
    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PropertyResponse> properties = propertyService.getAllPropertiesAdmin(pageable);
        
        return ResponseEntity.ok(ApiResponse.success(properties, "All properties fetched successfully"));
    }

    /**
     * Hard delete a property
     */
    @DeleteMapping("/properties/{id}")
    public ResponseEntity<ApiResponse<Void>> hardDeleteProperty(@PathVariable Long id) {
        propertyService.hardDeleteProperty(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Property hard deleted successfully"));
    }

    /**
     * Update property active status
     */
    @PatchMapping("/properties/{id}/activate")
    public ResponseEntity<ApiResponse<PropertyDetailResponse>> updateActiveStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {
        
        Boolean isActive = request.get("isActive");
        if (isActive == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("isActive field is required"));
        }
        
        PropertyDetailResponse updated = propertyService.updatePropertyActiveStatus(id, isActive);
        return ResponseEntity.ok(ApiResponse.success(updated, "Property status updated successfully"));
    }

    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<UserResponse> users = userService.getAllUsers(pageable);
        
        return ResponseEntity.ok(ApiResponse.success(users, "All users fetched successfully"));
    }
}
