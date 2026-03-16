package com.landify.repository;

import com.landify.entity.Property;
import com.landify.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    Page<Property> findByOwner(User owner, Pageable pageable);
    Page<Property> findByOwnerAndIsActiveTrueAndIsDeletedFalse(User owner, Pageable pageable);
}
