"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

const data = [
    { date: "Mar", value: 300 },
    { date: "Apr", value: 350 },
    { date: "May", value: 200 },
    { date: "Jun", value: 400 },
    { date: "Jul", value: 300 },
    { date: "Aug", value: 200 },
    { date: "Sep", value: 450 },
    { date: "Oct", value: 500 },
    { date: "Nov", value: 480 },
    { date: "Dec", value: 400 },
    { date: "Jan", value: 350 },
    { date: "Feb", value: 400 },
]

export default function StatsChart() {
    return (
        <ChartContainer
            config={{
                value: {
                    label: "Cantidad",
                    color: "hsl(302, 100%, 50%)",
                },
            }}
            className="h-[200px] sm:h-[240px] md:h-[270px] w-full"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        height={20}
                        tickMargin={8}
                        className="text-xs sm:text-sm"
                    />
                    <YAxis hide={true} domain={["auto", "auto"]} />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">Cantidad</span>
                                                <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">Fecha</span>
                                                <span className="font-bold">{payload[0].payload.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-value)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}

