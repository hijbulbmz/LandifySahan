package com.landify.service;

import com.landify.dto.PaginatedResponse;
import com.landify.dto.property.*;
import com.landify.entity.Property;
import com.landify.entity.PropertyCategory;
import com.landify.entity.User;
import com.landify.common.exception.ApiException;
import com.landify.repository.PropertyRepository;
import com.landify.repository.UserRepository;
import com.landify.specification.PropertySpecification;
import com.landify.mapper.PropertyMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyMapper propertyMapper;

    public PropertyService(PropertyRepository propertyRepository,
                           UserRepository userRepository,
                           PropertyMapper propertyMapper) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.propertyMapper = propertyMapper;
    }

    public PropertyDetailResponse createProperty(PropertyCreateRequest request) {
        String currentEmail = getCurrentUserEmail();
        User owner = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ApiException("Owner not found"));

        Property property = propertyMapper.toEntity(request, owner);
        Property savedProperty = propertyRepository.save(property);
        
        return propertyMapper.toDetailDTO(savedProperty);
    }

    public PropertyDetailResponse updateProperty(Long id, PropertyUpdateRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found"));

        validateOwnershipOrAdmin(property);

        if (Boolean.TRUE.equals(property.getIsDeleted())) {
            throw new ApiException("Cannot update a deleted property");
        }

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setCategory(request.getCategory());
        property.setSubtype(request.getSubtype());
        property.setState(request.getState());
        property.setDistrict(request.getDistrict());
        property.setLocality(request.getLocality());
        property.setTotalArea(request.getTotalArea() != null ? java.math.BigDecimal.valueOf(request.getTotalArea()) : null);
        property.setAreaUnit(request.getAreaUnit());
        property.setPrice(request.getPrice() != null ? java.math.BigDecimal.valueOf(request.getPrice()) : null);
        property.setPriceNegotiable(request.isPriceNegotiable());
        property.setStatus(request.getStatus());

        Property updatedProperty = propertyRepository.save(property);
        return propertyMapper.toDetailDTO(updatedProperty);
    }

    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found"));

        validateOwnershipOrAdmin(property);

        property.setIsActive(false);
        property.setIsDeleted(true);
        propertyRepository.save(property);
    }

    public PropertyDetailResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found"));

        if (Boolean.FALSE.equals(property.getIsActive()) || Boolean.TRUE.equals(property.getIsDeleted())) {
            throw new EntityNotFoundException("Property not found");
        }

        return propertyMapper.toDetailDTO(property);
    }

    public PaginatedResponse<OwnerPropertyResponse> getMyProperties(int page, int size) {
        String currentEmail = getCurrentUserEmail();
        User owner = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Property> propertyPage = propertyRepository.findByOwnerAndIsActiveTrueAndIsDeletedFalse(owner, pageable);

        return new PaginatedResponse<>(
                propertyPage.getContent().stream()
                        .map(propertyMapper::toOwnerSummaryDTO)
                        .collect(Collectors.toList()),
                propertyPage.getNumber(),
                propertyPage.getSize(),
                propertyPage.getTotalElements(),
                propertyPage.getTotalPages()
        );
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void validateOwnershipOrAdmin(Property property) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = auth.getName();
        
        if (isAdmin(auth)) {
            log.info("Admin override granted for property {} by admin {}", property.getId(), currentEmail);
            return;
        }

        if (!property.getOwner().getEmail().equals(currentEmail)) {
            log.warn("Unauthorized access attempt on property {} by user {}", property.getId(), currentEmail);
            throw new AccessDeniedException("You are not authorized to perform this action");
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }

    public PaginatedResponse<PropertySummaryResponse> getAllProperties(
            int page, int size, PropertyCategory category, String state, String district,
            Double minPrice, Double maxPrice, String sort) {

        Sort sortObj = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null && sort.contains(",")) {
            String[] parts = sort.split(",");
            sortObj = Sort.by(parts[1].equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC, parts[0]);
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);

        Specification<Property> spec = PropertySpecification.filterProperties(
                category, state, district, minPrice, maxPrice
        );

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);

        return new PaginatedResponse<>(
                propertyPage.getContent().stream()
                        .map(propertyMapper::toSummaryDTO)
                        .collect(Collectors.toList()),
                propertyPage.getNumber(),
                propertyPage.getSize(),
                propertyPage.getTotalElements(),
                propertyPage.getTotalPages()
        );
    }

    public Page<PropertyResponse> getAllPropertiesAdmin(Pageable pageable) {
        return propertyRepository.findAll(pageable)
                .map(propertyMapper::toPropertyResponse);
    }

    public void hardDeleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new EntityNotFoundException("Property not found");
        }
        propertyRepository.deleteById(id);
    }

    public PropertyDetailResponse updatePropertyActiveStatus(Long id, boolean isActive) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found"));
        
        validateOwnershipOrAdmin(property);
        
        property.setIsActive(isActive);
        return propertyMapper.toDetailDTO(propertyRepository.save(property));
    }
}
