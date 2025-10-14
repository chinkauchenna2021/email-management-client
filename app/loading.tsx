import { RefreshCw } from "lucide-react";

export default function Loading() {
  return (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading campaigns lists...
          </div>
  )
}
