package com.landify.mapper;

import com.landify.dto.property.OwnerPropertyResponse;
import com.landify.dto.property.PropertyCreateRequest;
import com.landify.dto.property.PropertyDetailResponse;
import com.landify.dto.property.PropertyResponse;
import com.landify.dto.property.PropertySummaryResponse;
import com.landify.entity.Property;
import com.landify.entity.User;
import org.springframework.stereotype.Component;

@Component
public class PropertyMapper {

    public Property toEntity(PropertyCreateRequest dto, User owner) {
        return Property.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .subtype(dto.getSubtype())
                .state(dto.getState())
                .district(dto.getDistrict())
                .locality(dto.getLocality())
                .totalArea(dto.getTotalArea() != null ? java.math.BigDecimal.valueOf(dto.getTotalArea()) : null)
                .areaUnit(dto.getAreaUnit())
                .price(dto.getPrice() != null ? java.math.BigDecimal.valueOf(dto.getPrice()) : null)
                .priceNegotiable(dto.isPriceNegotiable())
                .status(dto.getStatus())
                .owner(owner)
                .isActive(true)
                .isDeleted(false)
                .viewCount(0)
                .build();
    }

    public PropertySummaryResponse toSummaryDTO(Property property) {
        return PropertySummaryResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .category(property.getCategory())
                .price(property.getPrice() != null ? property.getPrice().doubleValue() : null)
                .status(property.getStatus())
                .state(property.getState())
                .district(property.getDistrict())
                .viewCount(property.getViewCount())
                .createdAt(property.getCreatedAt())
                .build();
    }

    public PropertyDetailResponse toDetailDTO(Property property) {
        PropertyDetailResponse.OwnerInfo ownerInfo = new PropertyDetailResponse.OwnerInfo(
                property.getOwner().getId(),
                property.getOwner().getName()
        );

        return PropertyDetailResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .category(property.getCategory())
                .subtype(property.getSubtype())
                .state(property.getState())
                .district(property.getDistrict())
                .locality(property.getLocality())
                .googleMapLink(property.getGoogleMapLink())
                .totalArea(property.getTotalArea() != null ? property.getTotalArea().doubleValue() : null)
                .areaUnit(property.getAreaUnit())
                .plotDimensions(property.getPlotDimensions())
                .price(property.getPrice() != null ? property.getPrice().doubleValue() : null)
                .priceNegotiable(property.getPriceNegotiable() != null ? property.getPriceNegotiable() : false)
                .status(property.getStatus())
                .viewCount(property.getViewCount())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .owner(ownerInfo)
                .build();
    }

    public OwnerPropertyResponse toOwnerSummaryDTO(Property property) {
        return OwnerPropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .category(property.getCategory())
                .price(property.getPrice() != null ? property.getPrice().doubleValue() : null)
                .status(property.getStatus())
                .state(property.getState())
                .district(property.getDistrict())
                .viewCount(property.getViewCount())
                .createdAt(property.getCreatedAt())
                .build();
    }

    public PropertyResponse toPropertyResponse(Property property) {
        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .category(property.getCategory())
                .subtype(property.getSubtype())
                .price(property.getPrice() != null ? property.getPrice().doubleValue() : null)
                .status(property.getStatus())
                .isActive(property.getIsActive() != null ? property.getIsActive() : false)
                .isDeleted(property.getIsDeleted() != null ? property.getIsDeleted() : false)
                .ownerEmail(property.getOwner() != null ? property.getOwner().getEmail() : null)
                .createdAt(property.getCreatedAt())
                .build();
    }
}
