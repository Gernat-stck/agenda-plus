"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ChartArea } from "./ChartArea";

export default function overview() {
    return (
        <>
            <Card className="max-h-[90vh]">
                <CardHeader>
                    <CardTitle>Vista General</CardTitle>
                    <CardDescription>Resumen de actividad y métricas principales</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="overview">
                        <TabsList className="flex gap-4 mb-3">
                            <TabsTrigger value="overview">General<span className="ml-4 border-r-2 border-black"></span></TabsTrigger>
                            <TabsTrigger value="analytics">Análisis<span className="ml-4 border-r-2 border-black"></span></TabsTrigger>
                            <TabsTrigger value="reports">Reportes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4">
                            <div className="flex rounded-lg border bg-muted/10 p-4">
                                <ChartArea />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </>
    )
}