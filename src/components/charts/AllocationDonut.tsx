"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

const CHART_COLORS = [
  "#2B6CB0", // steel-blue
  "#2D7D46", // forest
  "#B7791F", // amber
  "#C53030", // brick
  "#6B46C1", // muted violet
  "#2C7A7B", // teal
  "#9C4221", // rust
  "#5C5C5C", // medium gray
];

interface AllocationDonutProps {
  data: { name: string; value: number; percent: number }[];
}

export function AllocationDonut({ data }: AllocationDonutProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="40%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: unknown) => `$${Number(value).toLocaleString()}`}
            contentStyle={{ 
              backgroundColor: "#FFFFFF", 
              border: "1px solid #D9D5CC", 
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontFamily: "Source Sans 3",
              fontSize: "13px"
            }}
          />
          <Legend 
            layout="vertical" 
            align="center" 
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value, entry: any) => (
              <span className="text-[12px] font-medium text-foreground">
                {value} {entry?.payload?.percent ? `(${entry.payload.percent.toFixed(1)}%)` : ''}
              </span>
            )}
            wrapperStyle={{ 
              paddingTop: "20px",
              fontSize: "12px",
              fontFamily: "Source Sans 3"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
