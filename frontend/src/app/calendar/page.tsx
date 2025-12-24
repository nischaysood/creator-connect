"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ContentCalendar } from "@/components/ContentCalendar";

export default function CalendarPage() {
    return (
        <DashboardLayout>
            <div className="space-y-4">
                <ContentCalendar />
            </div>
        </DashboardLayout>
    );
}
