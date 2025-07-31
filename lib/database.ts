import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database utility functions
export async function getStations() {
  try {
    const stations = await sql`
      SELECT station_code, station_name, city, state 
      FROM stations 
      ORDER BY station_name
    `
    return stations
  } catch (error) {
    console.error("Error fetching stations:", error)
    throw error
  }
}

export async function searchTrains(params: {
  fromStation: string
  toStation: string
  journeyDate: string
}) {
  try {
    const trains = await sql`
      SELECT DISTINCT
        t.train_number,
        t.train_name,
        t.train_type,
        tr_from.departure_time,
        tr_to.arrival_time,
        s_from.station_name as from_station_name,
        s_from.station_code as from_station_code,
        s_to.station_name as to_station_name,
        s_to.station_code as to_station_code
      FROM trains t
      JOIN train_routes tr_from ON t.id = tr_from.train_id
      JOIN train_routes tr_to ON t.id = tr_to.train_id
      JOIN stations s_from ON tr_from.station_id = s_from.id
      JOIN stations s_to ON tr_to.station_id = s_to.id
      WHERE s_from.station_code = ${params.fromStation}
        AND s_to.station_code = ${params.toStation}
        AND tr_from.sequence_number < tr_to.sequence_number
      ORDER BY tr_from.departure_time
    `
    return trains
  } catch (error) {
    console.error("Error searching trains:", error)
    throw error
  }
}

export async function getTrainClasses(trainId: string) {
  try {
    const classes = await sql`
      SELECT class_code, class_name, total_seats, base_fare
      FROM train_classes
      WHERE train_id = ${trainId}
      ORDER BY base_fare DESC
    `
    return classes
  } catch (error) {
    console.error("Error fetching train classes:", error)
    throw error
  }
}

export async function getSeatAvailability(params: {
  scheduleId: string
  classId: string
  fromStationId: string
  toStationId: string
}) {
  try {
    const availability = await sql`
      SELECT available_seats, waiting_list, current_fare, quota_type
      FROM seat_availability
      WHERE schedule_id = ${params.scheduleId}
        AND class_id = ${params.classId}
        AND from_station_id = ${params.fromStationId}
        AND to_station_id = ${params.toStationId}
    `
    return availability[0] || null
  } catch (error) {
    console.error("Error fetching seat availability:", error)
    throw error
  }
}

export async function createBooking(bookingData: {
  userId: string
  scheduleId: string
  classId: string
  fromStationId: string
  toStationId: string
  journeyDate: string
  passengers: Array<{
    name: string
    age: number
    gender: string
    berthPreference?: string
  }>
  totalFare: number
}) {
  try {
    // Generate PNR
    const pnr = Math.random().toString().slice(2, 12)

    // Create booking
    const booking = await sql`
      INSERT INTO bookings (
        pnr, user_id, schedule_id, class_id, from_station_id, to_station_id,
        journey_date, total_passengers, total_fare
      ) VALUES (
        ${pnr}, ${bookingData.userId}, ${bookingData.scheduleId}, 
        ${bookingData.classId}, ${bookingData.fromStationId}, ${bookingData.toStationId},
        ${bookingData.journeyDate}, ${bookingData.passengers.length}, ${bookingData.totalFare}
      ) RETURNING *
    `

    // Create passenger records
    for (const passenger of bookingData.passengers) {
      await sql`
        INSERT INTO passengers (booking_id, name, age, gender, berth_preference)
        VALUES (${booking[0].id}, ${passenger.name}, ${passenger.age}, 
                ${passenger.gender}, ${passenger.berthPreference || null})
      `
    }

    return booking[0]
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export async function getPNRStatus(pnr: string) {
  try {
    const booking = await sql`
      SELECT 
        b.*,
        t.train_number,
        t.train_name,
        s_from.station_name as from_station_name,
        s_from.station_code as from_station_code,
        s_to.station_name as to_station_name,
        s_to.station_code as to_station_code,
        tc.class_name
      FROM bookings b
      JOIN train_schedules ts ON b.schedule_id = ts.id
      JOIN trains t ON ts.train_id = t.id
      JOIN stations s_from ON b.from_station_id = s_from.id
      JOIN stations s_to ON b.to_station_id = s_to.id
      JOIN train_classes tc ON b.class_id = tc.id
      WHERE b.pnr = ${pnr}
    `

    if (booking.length === 0) {
      return null
    }

    // Get passengers
    const passengers = await sql`
      SELECT name, age, gender, seat_number, status
      FROM passengers
      WHERE booking_id = ${booking[0].id}
      ORDER BY name
    `

    return {
      ...booking[0],
      passengers,
    }
  } catch (error) {
    console.error("Error fetching PNR status:", error)
    throw error
  }
}
