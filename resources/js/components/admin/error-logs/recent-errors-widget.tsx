import { AlertCircle, AlertTriangle, Info } from "lucide-react"

// Datos de ejemplo
const recentErrors = [
    {
        id: "ERR-1001",
        message: "Error de conexión a la base de datos",
        timestamp: "2023-10-15T14:23:45Z",
        level: "error",
        source: "api/database.js",
    },
    {
        id: "ERR-1002",
        message: "Timeout en solicitud de pago",
        timestamp: "2023-10-15T12:10:22Z",
        level: "warning",
        source: "api/payments.js",
    },
    {
        id: "ERR-1003",
        message: "Validación de formulario fallida",
        timestamp: "2023-10-14T09:45:12Z",
        level: "info",
        source: "components/Form.jsx",
    },
    {
        id: "ERR-1004",
        message: "Error de autenticación",
        timestamp: "2023-10-14T08:30:55Z",
        level: "error",
        source: "api/auth.js",
    },
]

export function RecentErrorsWidget() {
    const getLevelIcon = (level: string) => {
        switch (level) {
            case "error":
                return <AlertCircle className="h-4 w-4 text-destructive" />
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-amber-500" />
            case "info":
                return <Info className="h-4 w-4 text-blue-500" />
            default:
                return <Info className="h-4 w-4" />
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <div className="space-y-4">
            {recentErrors.map((error) => (
                <div key={error.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="mt-0.5">{getLevelIcon(error.level)}</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{error.id}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(error.timestamp)}</span>
                        </div>
                        <p className="text-sm">{error.message}</p>
                        <p className="text-xs text-muted-foreground">{error.source}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

