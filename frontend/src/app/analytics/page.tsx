"use client";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">Analytics</h1>
                <p className="text-muted-foreground">Deep dive into your campaign performance.</p>
                <div className="p-12 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-muted-foreground">
                    Analytics dashboard coming soon...
                </div>
            </div>
        </DashboardLayout>
    );
}
