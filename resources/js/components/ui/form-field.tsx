import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    children: ReactNode;
}

export function FormField({ label, htmlFor, children }: FormFieldProps) {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={htmlFor} className="text-right">
                {label}
            </Label>
            <div className="col-span-3">{children}</div>
        </div>
    );
}