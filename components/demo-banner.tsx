import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function DemoBanner() {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> This is a demonstration of the IRCTC clone. To enable full authentication features,
        please configure Supabase by adding your credentials to the environment variables.
      </AlertDescription>
    </Alert>
  )
}
