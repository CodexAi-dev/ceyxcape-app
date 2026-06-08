-- CeyXcape MySQL Schema
-- Run against XAMPP MySQL to create a fresh database

CREATE DATABASE IF NOT EXISTS ceyxcape_new CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ceyxcape_new;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_pic VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at DATETIME(6) NULL
);

-- Tours
CREATE TABLE IF NOT EXISTS tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    start_location VARCHAR(255),
    location VARCHAR(255),
    duration INT,
    price DECIMAL(10,2),
    discount_price DECIMAL(10,2),
    image VARCHAR(255),
    gallery TEXT,
    itinerary TEXT,
    includes TEXT,
    excludes TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    featured TINYINT(1) DEFAULT 0,
    views INT DEFAULT 0,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at DATETIME(6) NULL
);

-- Guests
CREATE TABLE IF NOT EXISTS guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_token VARCHAR(255) UNIQUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    booking_date DATE,
    tour_date DATE,
    participants INT DEFAULT 1,
    total_amount DECIMAL(10,2),
    booking_status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
    payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
    payment_id VARCHAR(100),
    payment_date DATETIME NULL,
    payment_amount DECIMAL(10,2),
    special_requests TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- Tour reviews
CREATE TABLE IF NOT EXISTS tour_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_id INT NULL,
    rating TINYINT CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    verified_purchase TINYINT(1) DEFAULT 0,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    guest_id VARCHAR(255) NULL,
    tour_id INT NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- Payment logs
CREATE TABLE IF NOT EXISTS payment_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NULL,
    action VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Custom tour requests
CREATE TABLE IF NOT EXISTS custom_tour_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(255),
    duration VARCHAR(50),
    travel_date DATE,
    group_size INT,
    tour_types TEXT,
    budget INT,
    accommodation VARCHAR(100),
    special_requirements TEXT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_country VARCHAR(100),
    notes TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

-- Inquiries (contact form + tour enquiries — inquiry system, no direct booking)
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('general','tour') DEFAULT 'general',
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    tour_id INT NULL,
    tour_name VARCHAR(255) NULL,
    tour_date VARCHAR(30) NULL,
    participants INT NULL,
    status ENUM('new','read','responded','archived') DEFAULT 'new',
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

-- Gallery images (managed from the admin panel)
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    src VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    category VARCHAR(100),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

-- Indexes
CREATE INDEX idx_tours_category_status ON tours(category, status);
CREATE INDEX idx_tours_featured ON tours(featured, status);
CREATE INDEX idx_tours_deleted ON tours(deleted_at);
CREATE INDEX idx_bookings_user ON bookings(user_id, booking_status);
CREATE INDEX idx_reviews_tour ON tour_reviews(tour_id, status);
CREATE INDEX idx_wishlists_user_tour ON wishlists(user_id, tour_id);
CREATE INDEX idx_inquiries_status ON inquiries(status, created_at);

-- Default admin (password: Admin@1234 — bcrypt)
INSERT INTO users (email, username, password, first_name, last_name, role, status)
VALUES (
    'admin@ceyxcape.com',
    'admin',
    '$2b$10$/qeMr8kGbKuLCiRRphGV7.fuRI9Z3TzeOmU7WMLCKOb.SntF7VYPK',
    'Admin',
    'CeyXcape',
    'admin',
    'active'
);

-- Sample tours
INSERT INTO tours (tour_code, name, description, category, start_location, location, duration, price, discount_price, status, featured) VALUES
('CX-001', 'Colombo City Tour',         'Explore Sri Lanka''s vibrant capital with a professional driver guide. Visit Gangaramaya Temple, Independence Square, Pettah Market and the Dutch Hospital.',           'City Tours',     'Colombo Airport', 'Colombo',  1,  55.00,  45.00, 'active', 1),
('CX-002', 'Sigiriya Rock Fortress',    'Climb the iconic Sigiriya Lion Rock, a UNESCO World Heritage Site. Includes Dambulla Cave Temple visit.',                                                            'Cultural',       'Colombo',         'Sigiriya', 2, 130.00, 110.00, 'active', 1),
('CX-003', 'Galle Fort Day Trip',       'Visit the historic Dutch Galle Fort, stroll the ramparts, explore boutique shops and enjoy Unawatuna Beach.',                                                       'Heritage & Beach','Colombo',        'Galle',    1, 100.00,  85.00, 'active', 1),
('CX-004', 'Kandy Temple Tour',         'Visit the sacred Temple of the Tooth Relic, Peradeniya Botanical Gardens, and enjoy a traditional Kandyan dance performance.',                                     'Cultural',       'Colombo',         'Kandy',    2,  95.00,   NULL, 'active', 0),
('CX-005', 'Yala National Park Safari', 'Half-day jeep safari in Yala, home to the highest density of leopards in the world. Elephants, crocodiles and exotic birds included.',                              'Wildlife Safari','Colombo',         'Yala',     2, 160.00, 140.00, 'active', 1),
('CX-006', 'Mirissa Whale Watching',    'Early morning boat tour to spot blue and sperm whales in the Indian Ocean. One of the best whale watching spots in Asia.',                                          'Beach Tours',    'Colombo',         'Mirissa',  2, 120.00,  NULL, 'active', 0),
('CX-007', '7-Day Classic Sri Lanka',   'The perfect first-time Sri Lanka itinerary: Colombo, Sigiriya, Dambulla, Kandy, Nuwara Eliya, Galle and Mirissa. All transport, driver guide included.',           'Multi-Day',      'Colombo Airport', 'Island-wide', 7, 850.00, 750.00, 'active', 1),
('CX-008', 'Nuwara Eliya Tea Country',  'Journey through misty tea plantations, visit a working tea factory, and explore Little England — Sri Lanka''s hill country gem.',                                  'Adventure',      'Colombo',         'Nuwara Eliya', 2, 110.00, NULL, 'active', 0),
('CX-009', 'Ella & Nine Arch Bridge',   'Hike to Little Adam''s Peak, photograph the iconic Nine Arch Bridge, and enjoy stunning views of Ella Rock and the surrounding valleys.',                          'Adventure',      'Colombo',         'Ella',     3, 140.00, 120.00, 'active', 0),
('CX-010', 'Airport Transfer & City',   'Seamless airport pickup from BIA Katunayake with optional Colombo city highlights en route to your hotel. Available 24/7.',                                         'City Tours',     'BIA Airport',     'Colombo',  1,  40.00,  NULL, 'active', 0);
