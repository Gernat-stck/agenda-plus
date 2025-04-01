import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Datos de ejemplo
const recentSales = [
    {
        id: "INV-001",
        customer: "Juan Pérez",
        email: "juan@example.com",
        amount: 125.99,
        date: "2023-10-15T14:23:45Z",
        avatar: "JP",
    },
    {
        id: "INV-002",
        customer: "María García",
        email: "maria@example.com",
        amount: 59.99,
        date: "2023-10-15T12:10:22Z",
        avatar: "MG",
    },
    {
        id: "INV-003",
        customer: "Carlos Rodríguez",
        email: "carlos@example.com",
        amount: 299.5,
        date: "2023-10-14T09:45:12Z",
        avatar: "CR",
    },
    {
        id: "INV-004",
        customer: "Ana Martínez",
        email: "ana@example.com",
        amount: 149.99,
        date: "2023-10-14T08:30:55Z",
        avatar: "AM",
    },
]

export function RecentSalesWidget() {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(amount)
    }

    return (
        <div className="space-y-8">
            {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{sale.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.customer}</p>
                        <p className="text-sm text-muted-foreground">{sale.email}</p>
                    </div>
                    <div className="ml-auto font-medium">{formatCurrency(sale.amount)}</div>
                </div>
            ))}
        </div>
    )
}

