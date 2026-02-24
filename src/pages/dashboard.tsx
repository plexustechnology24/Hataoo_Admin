import { DashboardCards } from "@/components/dashboard-cards"

export function DashboardPage() {
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-balance">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          Here is an overview of your QR code activity.
        </p>
      </div>
      <DashboardCards />
      <div className="flex-1 rounded-lg border border-dashed flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-muted-foreground">
          Activity feed will appear here once you generate QR codes.
        </p>
      </div>
    </>
  )
}
