import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  suffix?: string;
}

export function KpiCard({ title, value, icon: Icon, trend, suffix }: KpiCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-semibold text-gray-900">
              {value}
              {suffix && <span className="text-lg ml-1">{suffix}</span>}
            </h3>
          </div>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% vs last month
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </Card>
  );
}
