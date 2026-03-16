package com.landify.dto.property;

import com.landify.enums.PropertyStatus;
import com.landify.entity.PropertyCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyUpdateRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title cannot exceed 500 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private PropertyCategory category;

    @NotBlank(message = "Subtype is required")
    private String subtype;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Locality is required")
    private String locality;

    @NotNull(message = "Total area is required")
    @Positive(message = "Total area must be positive")
    private Double totalArea;

    @NotBlank(message = "Area unit is required")
    private String areaUnit;

    @Positive(message = "Price must be positive")
    private Double price;

    private boolean priceNegotiable;

    @NotNull(message = "Status is required")
    private PropertyStatus status;
}
