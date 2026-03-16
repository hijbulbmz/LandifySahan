SET FOREIGN_KEY_CHECKS = 0;

-- Landify Database Schema (Final Production Freeze - v3)
-- Optimized for MySQL 8.0+
-- Standardized on InnoDB with utf8mb4_unicode_ci

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    is_email_verified TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0,
    avatar_initials VARCHAR(255),
    owner_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Optimized Indexes
    INDEX idx_user_visibility (is_active, is_deleted),
    INDEX idx_user_role_active (role, is_active, is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'RESIDENTIAL', 'OTHER') NOT NULL,
    subtype VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    locality VARCHAR(255) NOT NULL,
    google_map_link TEXT,
    total_area DECIMAL(10, 2) NOT NULL,
    area_unit VARCHAR(255) NOT NULL,
    plot_dimensions VARCHAR(100),
    price DECIMAL(15, 2),
    price_negotiable TINYINT(1) DEFAULT 0,
    status ENUM('AVAILABLE', 'SOLD', 'RENTED', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    owner_id BIGINT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Integrity Constraints
    CONSTRAINT chk_prop_price CHECK (price >= 0),
    CONSTRAINT chk_prop_area CHECK (total_area > 0),
    CONSTRAINT chk_prop_views CHECK (view_count >= 0),
    
    -- Foreign Keys
    CONSTRAINT fk_prop_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Production-Frozen Performance Indexes
    -- Visibility Indexes (Optimized Order)
    INDEX idx_prop_visibility (is_active, is_deleted),
    INDEX idx_prop_visibility_filter (is_active, is_deleted, status, category),
    
    -- Location Optimization
    INDEX idx_prop_location (state, district, locality),
    
    -- Owner Lookup Indexes
    INDEX idx_prop_owner (owner_id, is_deleted),
    
    -- Individual Filter/Sort Indexes
    INDEX idx_prop_status (status),
    INDEX idx_prop_category (category),
    INDEX idx_prop_price (price),
    INDEX idx_prop_created (created_at),
    INDEX idx_prop_views_sort (view_count),
    
    -- Fulltext search
    FULLTEXT INDEX idx_prop_fulltext (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Agricultural Details
CREATE TABLE IF NOT EXISTS agricultural_details (
    property_id BIGINT PRIMARY KEY,
    subtype ENUM('FARMLAND', 'PLANTATION', 'FARMHOUSE', 'AGRI_PLOT', 'MIXED_AGRI') NOT NULL,
    soil_type ENUM('BLACK_COTTON', 'RED_LATERITE', 'ALLUVIAL', 'SANDY_LOAM', 'CLAY', 'MIXED'),
    water_source ENUM('RIVER', 'CANAL', 'BORE_WELL', 'OPEN_WELL', 'RAIN_FED', 'TANK', 'LAKE'),
    electricity_available TINYINT(1) DEFAULT 0,
    irrigation_facility TINYINT(1) DEFAULT 0,
    crop_type VARCHAR(255),
    fencing_available TINYINT(1) DEFAULT 0,
    well_count INT,
    tube_well_count INT,
    distance_from_road INT,
    organic_farming TINYINT(1) DEFAULT 0,
    
    CONSTRAINT fk_agri_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Commercial Details
CREATE TABLE IF NOT EXISTS commercial_details (
    property_id BIGINT PRIMARY KEY,
    subtype ENUM('OFFICE', 'SHOP', 'SHOWROOM', 'WAREHOUSE', 'INDUSTRIAL') NOT NULL,
    washrooms INT,
    pantry TINYINT(1) DEFAULT 0,
    conference_rooms INT,
    workstations_capacity INT,
    parking_spaces INT,
    power_backup TINYINT(1) DEFAULT 0,
    central_ac TINYINT(1) DEFAULT 0,
    lift_available TINYINT(1) DEFAULT 0,
    floor_number INT,
    total_floors INT,
    carpet_area DECIMAL(10, 2),
    carpet_area_unit ENUM('SQ_FT', 'SQ_M'),
    business_type ENUM('IT', 'RETAIL', 'MANUFACTURING', 'WAREHOUSE', 'SERVICE'),
    
    CONSTRAINT fk_comm_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20),
    message TEXT,
    budget_range VARCHAR(100),
    visit_requested TINYINT(1) DEFAULT 0,
    status ENUM('NEW', 'RESPONDED', 'SCHEDULED', 'VISITED', 'CLOSED') DEFAULT 'NEW',
    seller_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_enq_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_enq_prop_status (property_id, status),
    INDEX idx_enq_email (buyer_email),
    INDEX idx_enq_created (created_at),
    INDEX idx_enq_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    image_type VARCHAR(100),
    file_name VARCHAR(255),
    file_size BIGINT,
    upload_order INT,
    is_primary TINYINT(1) DEFAULT 0,
    primary_flag TINYINT GENERATED ALWAYS AS (IF(is_primary = 1, 1, NULL)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_img_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_img_property_id (property_id),
    INDEX idx_img_upload_order (property_id, upload_order),
    UNIQUE INDEX unq_primary_image (property_id, primary_flag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Residential Details Table
CREATE TABLE IF NOT EXISTS residential_details (
    property_id BIGINT PRIMARY KEY,
    subtype ENUM('APARTMENT', 'INDEPENDENT', 'VILLA', 'BUILDER_FLOOR', 'STUDIO', 'PENTHOUSE', 'ROW_HOUSE') NOT NULL,
    bedrooms INT,
    bathrooms INT,
    balconies INT,
    car_parking INT,
    furnishing ENUM('UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'),
    property_age INT,
    floor_number INT,
    total_floors INT,
    carpet_area DECIMAL(10, 2),
    carpet_area_unit ENUM('SQ_FT', 'SQ_M'),
    facing_direction ENUM('NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'),
    society_name VARCHAR(255),
    possession_status ENUM('READY_TO_MOVE', 'UNDER_CONSTRUCTION'),
    
    CONSTRAINT fk_res_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Title Documents Table
CREATE TABLE IF NOT EXISTS title_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    document_type ENUM('OCCUPANCY_CERTIFICATE', 'RIGHT_OF_OCCUPANCY', 'SALE_DEED', 'SURVEY_PLAN', 'LAYOUT_PLAN', 'REGISTERED_DEED', 'GOVERNOR_CONSENT', 'OTHER') NOT NULL,
    document_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    is_verified TINYINT(1) DEFAULT 0,
    verified_by BIGINT,
    verified_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_doc_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_doc_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_doc_property_lookup (property_id, is_verified),
    INDEX idx_doc_type_verified (document_type, is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Undeveloped Details Table
CREATE TABLE IF NOT EXISTS undeveloped_details (
    property_id BIGINT PRIMARY KEY,
    subtype ENUM('VACANT_PLOT', 'RAW_LAND', 'WATERFRONT', 'CORNER_PIECE') NOT NULL,
    plot_shape ENUM('RECTANGULAR', 'SQUARE', 'IRREGULAR', 'TRAPEZOIDAL'),
    road_frontage DECIMAL(10, 2),
    zoning_classification ENUM('RESIDENTIAL', 'COMMERCIAL', 'MIXED_USE', 'INDUSTRIAL', 'AGRICULTURAL'),
    development_status ENUM('READY_CONSTRUCTION', 'REQUIRES_LEVELING', 'NEEDS_CLEARING', 'PARTIALLY_DEVELOPED'),
    boundary_wall TINYINT(1) DEFAULT 0,
    land_classification ENUM('REVENUE', 'FOREST_ADJACENT', 'HILL_SLOPE', 'PLAINS_FLAT', 'WASTELAND'),
    access_road ENUM('TAR', 'GRAVEL', 'CART_TRACK', 'NONE'),
    utilities_nearby ENUM('POWER', 'WATER', 'BOTH', 'NONE'),
    distance_from_water_body INT,
    flood_risk ENUM('LOW', 'MEDIUM', 'HIGH_SEASONAL'),
    road_width_side1 DECIMAL(10, 2),
    road_width_side2 DECIMAL(10, 2),
    
    CONSTRAINT fk_undev_prop FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
