import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, CalendarIcon, Download } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

export function ErrorLogFilters() {
    const [date, setDate] = useState<DateRange | undefined>()

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Buscar por mensaje o ID..." className="pl-8 w-full md:w-[300px]" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Filtrar por nivel</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>Error</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked>Advertencia</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked>Info</DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Estado</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>Pendiente</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked>Resuelto</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "dd/MM/yy", { locale: es })} - {format(date.to, "dd/MM/yy", { locale: es })}
                                    </>
                                ) : (
                                    format(date.from, "dd/MM/yy", { locale: es })
                                )
                            ) : (
                                <span>Rango de fechas</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            locale={es}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex items-center gap-2">
                <Select defaultValue="newest">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Más recientes primero</SelectItem>
                        <SelectItem value="oldest">Más antiguos primero</SelectItem>
                        <SelectItem value="level">Nivel de error</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="h-9 w-9">
                    <Download className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

