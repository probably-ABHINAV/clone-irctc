import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Shield, CreditCard, FileText, Users, Settings } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Real-time Availability",
    description: "Check live seat availability and book instantly with up-to-date information",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Multiple payment options with bank-level security and instant confirmations",
  },
  {
    icon: FileText,
    title: "Digital Tickets",
    description: "Download e-tickets instantly and access your booking history anytime",
  },
  {
    icon: Users,
    title: "Group Booking",
    description: "Book for multiple passengers with saved passenger details for quick booking",
  },
  {
    icon: CreditCard,
    title: "PNR Status",
    description: "Track your booking status and get real-time updates on your journey",
  },
  {
    icon: Settings,
    title: "Easy Management",
    description: "Manage bookings, cancel tickets, and get refunds with just a few clicks",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose RailBook?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the fastest and most reliable way to book train tickets with our advanced features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
