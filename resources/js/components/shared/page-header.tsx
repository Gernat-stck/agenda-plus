import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import AppearanceToggleDropdown from "@/components/shared/appearance-dropdown"

interface PageHeaderProps {
    title: string
    onBack?: () => void
    showBackButton?: boolean
}

export function PageHeader({ title, onBack, showBackButton = true }: PageHeaderProps) {
    return (
        <div className="flex items-center mb-6 justify-between">
            <Button
                variant="ghost"
                size="sm"
                className="mr-2"
                onClick={onBack}
                disabled={!showBackButton}
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{title}</h1>
            <AppearanceToggleDropdown />
        </div>
    )
}