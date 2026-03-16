package com.landify.entity;

import com.landify.enums.PropertyStatus;
import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyCategory category;

    @Column(nullable = false)
    private String subtype;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String locality;

    @Column(name = "google_map_link", columnDefinition = "TEXT")
    private String googleMapLink;

    @Column(name = "total_area", nullable = false)
    private BigDecimal totalArea;

    @Column(name = "area_unit", nullable = false)
    private String areaUnit;

    @Column(name = "plot_dimensions")
    private String plotDimensions;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "price_negotiable")
    @Builder.Default
    private Boolean priceNegotiable = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PropertyStatus status = PropertyStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "is_deleted")
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isDeleted == null) isDeleted = false;
        if (isActive == null) isActive = true;
        if (viewCount == null) viewCount = 0;
        if (priceNegotiable == null) priceNegotiable = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
