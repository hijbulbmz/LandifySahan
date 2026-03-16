package com.landify.dto.property;

import com.landify.enums.PropertyStatus;
import com.landify.entity.PropertyCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDetailResponse {
    private Long id;
    private String title;
    private String description;
    private PropertyCategory category;
    private String subtype;
    private String state;
    private String district;
    private String locality;
    private String googleMapLink;
    private Double totalArea;
    private String areaUnit;
    private String plotDimensions;
    private Double price;
    private boolean priceNegotiable;
    private PropertyStatus status;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private OwnerInfo owner;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OwnerInfo {
        private Long id;
        private String name;
    }
}
