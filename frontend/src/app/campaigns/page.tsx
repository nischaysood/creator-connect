"use client";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function CampaignsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">Campaigns</h1>
                <p className="text-muted-foreground">Manage and track your active campaigns here.</p>
                <div className="p-12 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-muted-foreground">
                    Campaign management interface coming soon...
                </div>
            </div>
        </DashboardLayout>
    );
}
