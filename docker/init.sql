-- CeyXcape Database Initialization Script
-- This script sets up the initial database schema for the tourism platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_pic VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    tour_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    start_location VARCHAR(255),
    location VARCHAR(255),
    duration INTEGER,
    price DECIMAL(10, 2),
    discount_price DECIMAL(10, 2),
    image VARCHAR(255),
    gallery TEXT, -- JSON array stored as text
    itinerary TEXT, -- JSON array stored as text
    includes TEXT, -- JSON array stored as text
    excludes TEXT, -- JSON array stored as text
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    booking_date DATE,
    tour_date DATE,
    participants INTEGER DEFAULT 1,
    total_amount DECIMAL(10, 2),
    booking_status VARCHAR(50) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id VARCHAR(100),
    payment_date TIMESTAMP NULL,
    payment_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tour_reviews table
CREATE TABLE IF NOT EXISTS tour_reviews (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    verified_purchase BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    guest_id VARCHAR(255),
    tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    guest_token VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_logs table
CREATE TABLE IF NOT EXISTS payment_logs (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    action VARCHAR(50),
    details TEXT, -- JSON stored as text
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create custom_tour_requests table
CREATE TABLE IF NOT EXISTS custom_tour_requests (
    id SERIAL PRIMARY KEY,
    destination VARCHAR(255),
    duration VARCHAR(50),
    travel_date DATE,
    group_size INTEGER,
    tour_types TEXT, -- JSON array
    budget INTEGER,
    accommodation VARCHAR(100),
    special_requirements TEXT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_country VARCHAR(100),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tours_category_status ON tours(category, status);
CREATE INDEX idx_tours_featured ON tours(featured, status);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, booking_status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status, booking_date);
CREATE INDEX idx_reviews_tour_status ON tour_reviews(tour_id, status);
CREATE INDEX idx_reviews_user ON tour_reviews(user_id);
CREATE INDEX idx_wishlists_user_tour ON wishlists(user_id, tour_id);
CREATE INDEX idx_payment_logs_booking ON payment_logs(booking_id);

-- Insert default admin user (password: admin123 - hashed with bcrypt)
-- This is just for development. Change immediately in production!
INSERT INTO users (email, username, password, first_name, last_name, role, status)
VALUES (
    'admin@ceyxcape.com',
    'admin',
    '$2b$10$N9qo8uLOickgx2ZMRZoMye.H0Hzx5mZdWiP7RjmEVpqn8eYRUuuDG', -- bcrypt hash of "admin123"
    'Admin',
    'User',
    'admin',
    'active'
) ON CONFLICT DO NOTHING;

-- Insert sample tours for development
INSERT INTO tours (tour_code, name, description, category, start_location, location, duration, price, discount_price, status, featured)
VALUES
    ('TUR001', 'Colombo City Tour', 'Explore the vibrant capital city with our professional driver guide', 'City Tours', 'Colombo', 'Colombo', 1, 50.00, 45.00, 'active', TRUE),
    ('TUR002', 'Sigiriya Rock Adventure', 'Experience the majestic Sigiriya rock fortress', 'Adventure', 'Colombo', 'Sigiriya', 2, 120.00, 100.00, 'active', TRUE),
    ('TUR003', 'Galle Fort & Beach', 'Historic Galle Fort and beautiful beaches', 'Heritage & Beach', 'Colombo', 'Galle', 2, 100.00, 85.00, 'active', FALSE),
    ('TUR004', 'Kandy Temple Tour', 'Visit the sacred Temple of the Tooth Relic', 'Cultural', 'Colombo', 'Kandy', 2, 90.00, NULL, 'active', FALSE),
    ('TUR005', 'Seven-Day Island Tour', 'Complete Sri Lanka experience', 'Multi-Day', 'Colombo', 'Nationwide', 7, 800.00, 700.00, 'active', TRUE)
ON CONFLICT DO NOTHING;

-- Create TIMESTAMP update trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Apply trigger to tours table
CREATE TRIGGER update_tours_timestamp
BEFORE UPDATE ON tours
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Apply trigger to bookings table
CREATE TRIGGER update_bookings_timestamp
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Apply trigger to reviews table
CREATE TRIGGER update_reviews_timestamp
BEFORE UPDATE ON tour_reviews
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
