import { BookingHistory } from "@/components/bookings/booking-history"

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your train ticket bookings</p>
      </div>
      <BookingHistory />
    </div>
  )
}
