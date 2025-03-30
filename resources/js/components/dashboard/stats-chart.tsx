import { ChartContainer } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface StatsChartProps {
    data: {
        date: string;
        value: number;
    }[];
}


export default function StatsChart({ data }: StatsChartProps) {
    return (
        <ChartContainer
            config={{
                value: {
                    label: 'Cantidad',
                    color: 'hsl(302, 100%, 50%)',
                },
            }}
            className="h-[200px] w-full sm:h-[240px] md:h-[270px]"
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
                    <YAxis hide={true} domain={['auto', 'auto']} />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background rounded-lg border p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-muted-foreground text-[0.70rem] uppercase">Cantidad</span>
                                                <span className="text-muted-foreground font-bold">{payload[0].value}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-muted-foreground text-[0.70rem] uppercase">Fecha</span>
                                                <span className="font-bold">{payload[0].payload.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
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
    );
}
