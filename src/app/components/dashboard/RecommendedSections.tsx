import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "../ui/button"
import { BriefcaseBusiness, Calendar, Users } from "lucide-react"
import Link from "next/link"

export default function RecomendedSection() {
    return (
        <>
            <Card className="md:col-span-3">
                <CardHeader>
                    <CardTitle>Secciones Recomendadas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Link
                            href={"/citas"}
                            passHref
                            className="h-20 justify-start"
                        >
                            <Button variant="outline" className="h-full w-full">
                                <Calendar className="mr-2" />
                                Gestionar Citas
                            </Button>
                        </Link>
                        <Link
                            href={"/clientes"}
                            passHref
                            className="h-20 justify-start"
                        >
                            <Button variant="outline" className="h-full w-full">
                                <Users className="mr-2" />
                                Ver Clientes
                            </Button>
                        </Link>
                        <Link
                            href={"/servicios"}
                            passHref
                            className="h-20 justify-start"
                        >
                            <Button variant="outline" className="h-full w-full">
                                <BriefcaseBusiness className="mr-2" />
                                Ver Servicios
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}