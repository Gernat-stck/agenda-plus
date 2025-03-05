import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function CitaOverview() {
    return (
        <Card className="h-full w-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 md:p-5">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-extrabold">Citas para Hoy</CardTitle>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-muted-foreground mx-2 sm:mx-4 md:mx-6" />
            </CardHeader>
            <CardContent className="pb-3 sm:pb-4 md:pb-5">
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold">0</div>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">+2 programadas para mañana</p>
            </CardContent>
        </Card>
    )
}

