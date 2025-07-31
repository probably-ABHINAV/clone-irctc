import { Train, Clock, Shield, CreditCard } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <Train className="w-12 h-12 mr-3" />
          <h1 className="text-4xl md:text-6xl font-bold">RailBook</h1>
        </div>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Book train tickets instantly with real-time availability, secure payments, and instant confirmations
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <Clock className="w-8 h-8 mb-2" />
            <span className="text-sm">Real-time Updates</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-8 h-8 mb-2" />
            <span className="text-sm">Secure Booking</span>
          </div>
          <div className="flex flex-col items-center">
            <CreditCard className="w-8 h-8 mb-2" />
            <span className="text-sm">Multiple Payment Options</span>
          </div>
          <div className="flex flex-col items-center">
            <Train className="w-8 h-8 mb-2" />
            <span className="text-sm">All Train Routes</span>
          </div>
        </div>
      </div>
    </section>
  )
}
