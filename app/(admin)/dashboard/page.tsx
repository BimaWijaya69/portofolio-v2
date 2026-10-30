// app/(admin)/dashboard/page.tsx
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview project dan statistik</p>
      </div>

      {/* Cards - tanpa padding berlebihan */}
      <SectionCards />

      {/* Chart */}
      <ChartAreaInteractive />

    </div>
  );
}
