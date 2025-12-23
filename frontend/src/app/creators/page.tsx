"use client";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function CreatorsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">Creators</h1>
                <p className="text-muted-foreground">Discover and collaborate with top content creators.</p>
                <div className="p-12 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-muted-foreground">
                    Creator discovery interface coming soon...
                </div>
            </div>
        </DashboardLayout>
    );
}
