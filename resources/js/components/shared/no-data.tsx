import { FileQuestion } from "lucide-react"
import type * as React from "react"

import { cn } from "@/lib/utils"

interface NoDataProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    icon?: React.ReactNode
}

export function NoData({
    title = "No data available",
    description = "There are no items to display at the moment.",
    icon,
    className,
    ...props
}: NoDataProps) {
    return (
        <div
            className={cn(
                "flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50",
                className,
            )}
            {...props}
        >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                {icon || <FileQuestion className="h-6 w-6 text-muted-foreground" />}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
    )
}

