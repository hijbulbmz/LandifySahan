package com.landify.landify_backend.repository;

import com.landify.landify_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Returns true if a user with the given email already exists. */
    boolean existsByEmail(String email);

    /** Finds a user by their email address. */
    java.util.Optional<User> findByEmail(String email);
}
