package com.landify.specification;

import com.landify.entity.Property;
import com.landify.entity.PropertyCategory;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> filterProperties(
            PropertyCategory category,
            String state,
            String district,
            Double minPrice,
            Double maxPrice
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter for active and non-deleted properties
            predicates.add(criteriaBuilder.equal(root.get("isActive"), true));
            predicates.add(criteriaBuilder.equal(root.get("isDeleted"), false));

            if (category != null) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            if (state != null && !state.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("state"), state));
            }

            if (district != null && !district.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("district"), district));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
