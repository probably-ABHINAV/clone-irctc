import { PNRStatusChecker } from "@/components/pnr-status-checker"

export default function PNRStatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Check PNR Status</h1>
          <p className="text-gray-600">
            Enter your 10-digit PNR number to check your booking status and journey details
          </p>
        </div>
        <PNRStatusChecker />
      </div>
    </div>
  )
}
