"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User, CreditCard, Shield, AlertCircle } from "lucide-react"

interface BookingDetails {
  trainNumber: string
  trainName: string
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  date: string
  classCode: string
  className: string
  fare: number
  passengers: number
}

interface Passenger {
  id: string
  name: string
  age: string
  gender: string
  berthPreference: string
}

interface BookingFormProps {
  bookingDetails: BookingDetails
}

export function BookingForm({ bookingDetails }: BookingFormProps) {
  // Initialize passengers array with useMemo to prevent recreation on every render
  const initialPassengers = useMemo(
    () =>
      Array.from({ length: bookingDetails.passengers }, (_, index) => ({
        id: `passenger-${index}`, // Add stable ID
        name: "",
        age: "",
        gender: "",
        berthPreference: "",
      })),
    [bookingDetails.passengers],
  )

  const [passengers, setPassengers] = useState<Passenger[]>(initialPassengers)
  const [contactDetails, setContactDetails] = useState({
    email: "",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { toast } = useToast()
  const router = useRouter()

  // Use useCallback to prevent function recreation on every render
  const updatePassenger = useCallback((index: number, field: keyof Passenger, value: string) => {
    setPassengers((prev) => prev.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger)))
  }, [])

  const updateContactDetails = useCallback((field: "email" | "phone", value: string) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handlePaymentMethodChange = useCallback((method: string) => {
    setPaymentMethod(method)
  }, [])

  const handleTermsChange = useCallback((checked: boolean) => {
    setAgreeTerms(checked)
  }, [])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    // Validate passengers
    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`passenger_${index}_name`] = "Name is required"
      }
      if (!passenger.age.trim() || Number.parseInt(passenger.age) < 1 || Number.parseInt(passenger.age) > 120) {
        newErrors[`passenger_${index}_age`] = "Valid age is required"
      }
      if (!passenger.gender) {
        newErrors[`passenger_${index}_gender`] = "Gender is required"
      }
    })

    // Validate contact details
    if (!contactDetails.email.trim() || !/\S+@\S+\.\S+/.test(contactDetails.email)) {
      newErrors.email = "Valid email is required"
    }
    if (!contactDetails.phone.trim() || !/^\d{10}$/.test(contactDetails.phone)) {
      newErrors.phone = "Valid 10-digit phone number is required"
    }

    // Validate payment method
    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method"
    }

    // Validate terms agreement
    if (!agreeTerms) {
      newErrors.agreeTerms = "Please agree to terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [passengers, contactDetails, paymentMethod, agreeTerms])

  const handleBooking = useCallback(async () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check all required fields and try again",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate booking API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock PNR
      const pnr = Math.random().toString().slice(2, 12)

      toast({
        title: "Booking Confirmed!",
        description: `Your PNR is ${pnr}. Redirecting to booking confirmation...`,
      })

      // Redirect to booking confirmation page
      setTimeout(() => {
        router.push(`/booking-confirmation?pnr=${pnr}`)
      }, 2000)
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [validateForm, toast, router])

  const totalFare = useMemo(
    () => bookingDetails.fare * bookingDetails.passengers,
    [bookingDetails.fare, bookingDetails.passengers],
  )

  return (
    <div className="space-y-6">
      {/* Passenger Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Passenger Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="border rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-gray-900">Passenger {index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name_${index}`}>Full Name *</Label>
                  <Input
                    id={`name_${index}`}
                    placeholder="Enter full name"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(index, "name", e.target.value)}
                    className={errors[`passenger_${index}_name`] ? "border-red-500" : ""}
                  />
                  {errors[`passenger_${index}_name`] && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors[`passenger_${index}_name`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`age_${index}`}>Age *</Label>
                  <Input
                    id={`age_${index}`}
                    type="number"
                    placeholder="Age"
                    value={passenger.age}
                    onChange={(e) => updatePassenger(index, "age", e.target.value)}
                    className={errors[`passenger_${index}_age`] ? "border-red-500" : ""}
                    min="1"
                    max="120"
                  />
                  {errors[`passenger_${index}_age`] && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors[`passenger_${index}_age`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`gender_${index}`}>Gender *</Label>
                  <select
                    id={`gender_${index}`}
                    value={passenger.gender}
                    onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors[`passenger_${index}_gender`] ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors[`passenger_${index}_gender`] && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors[`passenger_${index}_gender`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`berth_${index}`}>Berth Preference</Label>
                  <select
                    id={`berth_${index}`}
                    value={passenger.berthPreference}
                    onChange={(e) => updatePassenger(index, "berthPreference", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select berth preference</option>
                    <option value="Lower">Lower</option>
                    <option value="Middle">Middle</option>
                    <option value="Upper">Upper</option>
                    <option value="Side Lower">Side Lower</option>
                    <option value="Side Upper">Side Upper</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={contactDetails.email}
                onChange={(e) => updateContactDetails("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={contactDetails.phone}
                onChange={(e) => updateContactDetails("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Credit/Debit Card", "UPI", "Net Banking"].map((method) => (
              <div
                key={method}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === method ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                }`}
                onClick={() => handlePaymentMethodChange(method)}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => handlePaymentMethodChange(method)}
                    className="text-blue-600"
                  />
                  <span className="font-medium">{method}</span>
                </div>
              </div>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.paymentMethod}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions - Using native checkbox */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => handleTermsChange(e.target.checked)}
              className={`mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                errors.agreeTerms ? "border-red-500" : ""
              }`}
            />
            <div className="space-y-1">
              <Label htmlFor="agreeTerms" className="text-sm font-medium cursor-pointer">
                I agree to the Terms and Conditions and Privacy Policy
              </Label>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.agreeTerms}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Book Button */}
      <div className="flex justify-end">
        <Button onClick={handleBooking} disabled={loading} size="lg" className="px-8 py-3 text-lg">
          <Shield className="w-5 h-5 mr-2" />
          {loading ? "Processing Booking..." : `Pay ₹${totalFare} & Book`}
        </Button>
      </div>
    </div>
  )
}
