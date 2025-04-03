import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Datos de ejemplo
const data = [
    {
        name: "Ene",
        total: 2400,
    },
    {
        name: "Feb",
        total: 1398,
    },
    {
        name: "Mar",
        total: 9800,
    },
    {
        name: "Abr",
        total: 3908,
    },
    {
        name: "May",
        total: 4800,
    },
    {
        name: "Jun",
        total: 3800,
    },
    {
        name: "Jul",
        total: 4300,
    },
    {
        name: "Ago",
        total: 5300,
    },
    {
        name: "Sep",
        total: 4900,
    },
    {
        name: "Oct",
        total: 6300,
    },
    {
        name: "Nov",
        total: 5400,
    },
    {
        name: "Dic",
        total: 6200,
    },
]

export function SalesChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

