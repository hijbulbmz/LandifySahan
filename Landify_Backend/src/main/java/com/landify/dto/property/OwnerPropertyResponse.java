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
public class OwnerPropertyResponse {
    private Long id;
    private String title;
    private PropertyCategory category;
    private Double price;
    private PropertyStatus status;
    private String state;
    private String district;
    private Integer viewCount;
    private LocalDateTime createdAt;
}
