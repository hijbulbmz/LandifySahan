package com.landify.dto.property;

import com.landify.entity.PropertyCategory;
import com.landify.enums.PropertyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyResponse {
    private Long id;
    private String title;
    private PropertyCategory category;
    private String subtype;
    private Double price;
    private PropertyStatus status;
    private boolean isActive;
    private boolean isDeleted;
    private String ownerEmail;
    private LocalDateTime createdAt;
}
