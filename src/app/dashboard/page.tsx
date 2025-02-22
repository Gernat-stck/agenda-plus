import { Plus } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import Metrics from "@/app/components/dashboard/Metrics"
import RecomendedSection from "@/app/components/dashboard/RecommendedSections"
import Wallet from "@/app/components/dashboard/Wallet"
import Overview from "@/app/components/dashboard/Overview"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cita
        </Button>
      </div>
      {/* Métricas Principales en una fila */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metrics />
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {/* Secciones Recomendadas */}
        <RecomendedSection />
        {/* Cartera */}
        <Wallet />
      </div>
      {/* Vista General */}
      <Overview />
    </div>
  )
}

