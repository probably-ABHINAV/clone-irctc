-- Create database schema for IRCTC clone

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_code VARCHAR(10) UNIQUE NOT NULL,
    station_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trains table
CREATE TABLE IF NOT EXISTS trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_number VARCHAR(10) UNIQUE NOT NULL,
    train_name VARCHAR(255) NOT NULL,
    train_type VARCHAR(50) NOT NULL, -- Express, Superfast, etc.
    source_station_id UUID REFERENCES stations(id),
    destination_station_id UUID REFERENCES stations(id),
    total_distance INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train routes (intermediate stations)
CREATE TABLE IF NOT EXISTS train_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID REFERENCES trains(id) ON DELETE CASCADE,
    station_id UUID REFERENCES stations(id),
    sequence_number INTEGER NOT NULL,
    arrival_time TIME,
    departure_time TIME,
    distance_from_source INTEGER,
    halt_duration INTEGER DEFAULT 0, -- in minutes
    day_number INTEGER DEFAULT 1, -- for multi-day journeys
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train classes and their configurations
CREATE TABLE IF NOT EXISTS train_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID REFERENCES trains(id) ON DELETE CASCADE,
    class_code VARCHAR(10) NOT NULL, -- SL, 3A, 2A, 1A, CC, EC
    class_name VARCHAR(100) NOT NULL,
    total_seats INTEGER NOT NULL,
    base_fare DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train schedules (for specific dates)
CREATE TABLE IF NOT EXISTS train_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID REFERENCES trains(id) ON DELETE CASCADE,
    journey_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, CANCELLED, DELAYED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(train_id, journey_date)
);

-- Seat availability for each class on specific dates
CREATE TABLE IF NOT EXISTS seat_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES train_schedules(id) ON DELETE CASCADE,
    class_id UUID REFERENCES train_classes(id) ON DELETE CASCADE,
    from_station_id UUID REFERENCES stations(id),
    to_station_id UUID REFERENCES stations(id),
    available_seats INTEGER NOT NULL,
    waiting_list INTEGER DEFAULT 0,
    current_fare DECIMAL(10, 2) NOT NULL,
    quota_type VARCHAR(20) DEFAULT 'GENERAL', -- GENERAL, TATKAL, PREMIUM_TATKAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr VARCHAR(10) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    schedule_id UUID REFERENCES train_schedules(id),
    class_id UUID REFERENCES train_classes(id),
    from_station_id UUID REFERENCES stations(id),
    to_station_id UUID REFERENCES stations(id),
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    journey_date DATE NOT NULL,
    total_passengers INTEGER NOT NULL,
    total_fare DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'CONFIRMED', -- CONFIRMED, WAITING, CANCELLED, RAC
    payment_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Passengers table (linked to bookings)
CREATE TABLE IF NOT EXISTS passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    seat_number VARCHAR(10),
    berth_preference VARCHAR(20), -- LOWER, MIDDLE, UPPER, SIDE_LOWER, SIDE_UPPER
    status VARCHAR(20) DEFAULT 'CONFIRMED', -- CONFIRMED, WAITING, RAC, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    payment_id VARCHAR(255) UNIQUE NOT NULL, -- from payment gateway
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- CARD, UPI, NETBANKING, WALLET
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stations_code ON stations(station_code);
CREATE INDEX IF NOT EXISTS idx_trains_number ON trains(train_number);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_train_routes_train ON train_routes(train_id);
CREATE INDEX IF NOT EXISTS idx_seat_availability_schedule ON seat_availability(schedule_id);
CREATE INDEX IF NOT EXISTS idx_passengers_booking ON passengers(booking_id);
