"use client";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function CalendarPage() {
    return (
        <DashboardLayout>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">Calendar</h1>
                <p className="text-muted-foreground">Stay on top of your content schedule.</p>
                <div className="p-12 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-muted-foreground">
                    Calendar interface coming soon...
                </div>
            </div>
        </DashboardLayout>
    );
}
