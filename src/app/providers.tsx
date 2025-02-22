// app/providers.tsx
"use client";

import { ReactNode } from "react";
import { CitaProvider } from "@/app/contexts/CitaContext";

export function Providers({ children }: { children: ReactNode }) {
    return <CitaProvider>{children}</CitaProvider>;
}
