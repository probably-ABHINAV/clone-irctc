-- Insert sample stations
INSERT INTO stations (station_code, station_name, city, state, zone) VALUES
('NDLS', 'New Delhi', 'New Delhi', 'Delhi', 'Northern Railway'),
('BCT', 'Mumbai Central', 'Mumbai', 'Maharashtra', 'Western Railway'),
('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal', 'Eastern Railway'),
('MAS', 'Chennai Central', 'Chennai', 'Tamil Nadu', 'Southern Railway'),
('SBC', 'Bangalore City', 'Bangalore', 'Karnataka', 'South Western Railway'),
('PUNE', 'Pune Junction', 'Pune', 'Maharashtra', 'Central Railway'),
('JP', 'Jaipur Junction', 'Jaipur', 'Rajasthan', 'North Western Railway'),
('LKO', 'Lucknow', 'Lucknow', 'Uttar Pradesh', 'Northern Railway'),
('BBS', 'Bhubaneswar', 'Bhubaneswar', 'Odisha', 'East Coast Railway'),
('HYB', 'Hyderabad Deccan', 'Hyderabad', 'Telangana', 'South Central Railway');

-- Insert sample trains
INSERT INTO trains (train_number, train_name, train_type, source_station_id, destination_station_id, total_distance) VALUES
('12951', 'Mumbai Rajdhani Express', 'Rajdhani', 
    (SELECT id FROM stations WHERE station_code = 'BCT'), 
    (SELECT id FROM stations WHERE station_code = 'NDLS'), 1384),
('12301', 'Howrah Rajdhani Express', 'Rajdhani', 
    (SELECT id FROM stations WHERE station_code = 'HWH'), 
    (SELECT id FROM stations WHERE station_code = 'NDLS'), 1441),
('12621', 'Tamil Nadu Express', 'Mail/Express', 
    (SELECT id FROM stations WHERE station_code = 'MAS'), 
    (SELECT id FROM stations WHERE station_code = 'NDLS'), 2180),
('12049', 'Gatimaan Express', 'Superfast', 
    (SELECT id FROM stations WHERE station_code = 'NDLS'), 
    (SELECT id FROM stations WHERE station_code = 'JP'), 308);

-- Insert train classes for Mumbai Rajdhani
INSERT INTO train_classes (train_id, class_code, class_name, total_seats, base_fare) VALUES
((SELECT id FROM trains WHERE train_number = '12951'), '1A', 'AC First Class', 24, 3500.00),
((SELECT id FROM trains WHERE train_number = '12951'), '2A', 'AC 2 Tier', 48, 2200.00),
((SELECT id FROM trains WHERE train_number = '12951'), '3A', 'AC 3 Tier', 72, 1650.00);

-- Insert train classes for Howrah Rajdhani
INSERT INTO train_classes (train_id, class_code, class_name, total_seats, base_fare) VALUES
((SELECT id FROM trains WHERE train_number = '12301'), '1A', 'AC First Class', 24, 3800.00),
((SELECT id FROM trains WHERE train_number = '12301'), '2A', 'AC 2 Tier', 48, 2400.00),
((SELECT id FROM trains WHERE train_number = '12301'), '3A', 'AC 3 Tier', 72, 1750.00);

-- Insert train classes for Tamil Nadu Express
INSERT INTO train_classes (train_id, class_code, class_name, total_seats, base_fare) VALUES
((SELECT id FROM trains WHERE train_number = '12621'), 'SL', 'Sleeper', 96, 450.00),
((SELECT id FROM trains WHERE train_number = '12621'), '3A', 'AC 3 Tier', 72, 1200.00),
((SELECT id FROM trains WHERE train_number = '12621'), '2A', 'AC 2 Tier', 48, 1800.00);

-- Insert train classes for Gatimaan Express
INSERT INTO train_classes (train_id, class_code, class_name, total_seats, base_fare) VALUES
((SELECT id FROM trains WHERE train_number = '12049'), 'CC', 'Chair Car', 78, 750.00),
((SELECT id FROM trains WHERE train_number = '12049'), 'EC', 'Executive Chair Car', 20, 1500.00);

-- Insert sample train routes for Mumbai Rajdhani (12951)
INSERT INTO train_routes (train_id, station_id, sequence_number, arrival_time, departure_time, distance_from_source) VALUES
((SELECT id FROM trains WHERE train_number = '12951'), (SELECT id FROM stations WHERE station_code = 'BCT'), 1, NULL, '16:55:00', 0),
((SELECT id FROM trains WHERE train_number = '12951'), (SELECT id FROM stations WHERE station_code = 'NDLS'), 2, '08:35:00', NULL, 1384);

-- Insert sample train routes for Howrah Rajdhani (12301)
INSERT INTO train_routes (train_id, station_id, sequence_number, arrival_time, departure_time, distance_from_source) VALUES
((SELECT id FROM trains WHERE train_number = '12301'), (SELECT id FROM stations WHERE station_code = 'HWH'), 1, NULL, '16:55:00', 0),
((SELECT id FROM trains WHERE train_number = '12301'), (SELECT id FROM stations WHERE station_code = 'NDLS'), 2, '10:05:00', NULL, 1441);

-- Create train schedules for the next 30 days
INSERT INTO train_schedules (train_id, journey_date)
SELECT 
    t.id,
    CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 29)
FROM trains t;

-- Insert seat availability for all schedules and classes
INSERT INTO seat_availability (schedule_id, class_id, from_station_id, to_station_id, available_seats, current_fare)
SELECT 
    ts.id as schedule_id,
    tc.id as class_id,
    tr_from.station_id as from_station_id,
    tr_to.station_id as to_station_id,
    tc.total_seats as available_seats,
    tc.base_fare as current_fare
FROM train_schedules ts
JOIN trains t ON ts.train_id = t.id
JOIN train_classes tc ON t.id = tc.train_id
JOIN train_routes tr_from ON t.id = tr_from.train_id
JOIN train_routes tr_to ON t.id = tr_to.train_id
WHERE tr_from.sequence_number < tr_to.sequence_number;
