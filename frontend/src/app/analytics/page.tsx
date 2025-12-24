"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AnalyticsView } from "@/components/AnalyticsView";

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-4">
                <AnalyticsView />
            </div>
        </DashboardLayout>
    );
}
