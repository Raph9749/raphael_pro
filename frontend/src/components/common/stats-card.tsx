import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ label, value, icon, iconBg = "bg-primary-100", trend, className }: StatsCardProps) {
  return (
    <Card className={cn("p-6 hover:shadow-card-hover transition-shadow", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.positive ? (
                <ArrowUp className="h-3.5 w-3.5 text-success-500" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 text-error-500" />
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  trend.positive ? "text-success-600" : "text-error-600"
                )}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBg)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
