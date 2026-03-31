import { cn } from "./ui/utils";

interface AllocationCellProps {
  percentage: number;
  hours?: number;
  projectName?: string;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AllocationCell({ 
  percentage, 
  hours, 
  projectName, 
  showTooltip = false,
  size = "md" 
}: AllocationCellProps) {
  // Determine color based on allocation percentage
  const getColor = () => {
    if (percentage > 100) return "bg-red-500"; // Over allocated
    if (percentage >= 80) return "bg-yellow-400"; // Balanced
    if (percentage >= 50) return "bg-green-400"; // Well allocated
    return "bg-green-200"; // Under allocated
  };

  const getOpacity = () => {
    if (percentage === 0) return "opacity-0";
    if (percentage < 25) return "opacity-30";
    if (percentage < 50) return "opacity-50";
    if (percentage < 75) return "opacity-70";
    return "opacity-100";
  };

  const sizeClasses = {
    sm: "h-8 min-w-[40px]",
    md: "h-10 min-w-[60px]",
    lg: "h-12 min-w-[80px]"
  };

  return (
    <div 
      className={cn(
        "relative group cursor-pointer transition-all hover:ring-2 hover:ring-blue-400",
        sizeClasses[size]
      )}
      title={showTooltip ? `${percentage}% allocated${hours ? ` (${hours}h)` : ''}${projectName ? ` - ${projectName}` : ''}` : undefined}
    >
      <div 
        className={cn(
          "w-full h-full rounded",
          getColor(),
          getOpacity(),
          "transition-opacity"
        )}
      />
      {hours !== undefined && percentage > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-900 drop-shadow-sm">
            {hours}h
          </span>
        </div>
      )}
      {percentage > 100 && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full border-2 border-white" />
      )}
    </div>
  );
}

export function AllocationBar({ 
  percentage, 
  hours, 
  label,
  color = "#3B82F6"
}: { 
  percentage: number; 
  hours: number; 
  label: string;
  color?: string;
}) {
  return (
    <div className="relative h-8 rounded-lg overflow-hidden bg-gray-100 group cursor-pointer hover:ring-2 hover:ring-blue-400">
      <div 
        className="h-full rounded-lg transition-all"
        style={{ 
          width: `${Math.min(percentage, 100)}%`,
          backgroundColor: color 
        }}
      />
      <div className="absolute inset-0 flex items-center px-3 justify-between">
        <span className="text-xs font-medium text-gray-900">{label}</span>
        <span className="text-xs font-medium text-gray-900">{hours}h</span>
      </div>
      {percentage > 100 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-600">
          +{Math.round(percentage - 100)}%
        </div>
      )}
    </div>
  );
}
