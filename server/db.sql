-- Admin authentication table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP
);

-- Password reset/OTP table
CREATE TABLE IF NOT EXISTS forgetpassword (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    otp_expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (email) REFERENCES admin_users(email) ON DELETE CASCADE
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    long_description TEXT,
    icon VARCHAR(100),
    features TEXT[], -- Array of features
    benefits TEXT[], -- Array of benefits
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Case Studies table
CREATE TABLE IF NOT EXISTS case_studies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    client VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    challenge TEXT,
    solution TEXT,
    results TEXT[], -- Array of results
    technologies TEXT[], -- Array of technologies
    duration VARCHAR(100),
    team_size VARCHAR(100),
    image VARCHAR(500),
    testimonial_author VARCHAR(255),
    testimonial_position VARCHAR(255),
    testimonial_company VARCHAR(255),
    testimonial_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    company VARCHAR(255),
    company_logo VARCHAR(500),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    image VARCHAR(500),
    project VARCHAR(255),
    industry VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    author_name VARCHAR(255),
    publish_date DATE,
    read_time VARCHAR(50),
    category VARCHAR(255),
    tags TEXT[], -- Array of tags
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(100),
    location VARCHAR(500),
    type VARCHAR(100), -- upcoming or past
    description TEXT,
    long_description TEXT,
    speakers TEXT[], -- Array of speakers
    agenda TEXT[], -- Array of agenda items
    registration_link VARCHAR(500),
    is_free BOOLEAN DEFAULT false,
    price VARCHAR(50),
    early_bird_price VARCHAR(50),
    early_bird_deadline DATE,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    image VARCHAR(500),
    category VARCHAR(255),
    tags TEXT[], -- Array of tags
    attendees INTEGER, -- For past events
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Gallery Items table
CREATE TABLE IF NOT EXISTS gallery_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    image VARCHAR(500),
    thumbnail VARCHAR(500),
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    country VARCHAR(100),
    job_title VARCHAR(255),
    job_details TEXT,
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    inquiry_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Chat Sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    is_converted BOOLEAN DEFAULT FALSE
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    message_id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'bot')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure job_title is nullable
ALTER TABLE inquiries ALTER COLUMN job_title DROP NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_title ON services(title);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_case_studies_client ON case_studies(client);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON case_studies(industry);
CREATE INDEX IF NOT EXISTS idx_case_studies_created_at ON case_studies(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_testimonials_company ON testimonials(company);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
-- CREATE INDEX IF NOT EXISTS idx_testimonials_date ON testimonials(date DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_name ON blog_posts(author_name);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
-- CREATE INDEX IF NOT EXISTS idx_gallery_items_date ON gallery_items(date DESC);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_inquiry_at ON inquiries(inquiry_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_updated_at ON inquiries(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_forgetpassword_email ON forgetpassword(email);
CREATE INDEX IF NOT EXISTS idx_forgetpassword_otp_expires ON forgetpassword(otp_expires_at);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_started_at ON chat_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp DESC);

-- Add updated_at column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_services_updated_at ON services(updated_at DESC);

-- Add updated_at column to case_studies table
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_case_studies_updated_at ON case_studies(updated_at DESC);

-- Add updated_at column to testimonials table
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_testimonials_updated_at ON testimonials(updated_at DESC);

-- Add updated_at column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_at ON blog_posts(updated_at DESC);

-- Add updated_at column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_events_updated_at ON events(updated_at DESC);

-- Add updated_at column to gallery_items table
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_gallery_items_updated_at ON gallery_items(updated_at DESC);