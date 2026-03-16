"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

const data = [
  { name: "Housing", value: 1800.00, color: "#2B6CB0" },
  { name: "Food & Dining", value: 620.00, color: "#2D7D46" },
  { name: "Transportation", value: 435.00, color: "#B7791F" },
  { name: "Utilities", value: 340.00, color: "#C53030" },
  { name: "Entertainment", value: 210.00, color: "#6B46C1" },
  { name: "Other", value: 250.00, color: "#5C5C5C" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export function SpendingDonutChart() {
  return (
    <div className="h-[250px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="35%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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
            align="right" 
            verticalAlign="middle"
            iconType="square"
            iconSize={10}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value, entry: any) => (
              <span className="flex items-baseline justify-between gap-8 min-w-[150px]">
                <span className="text-[13px] font-medium text-foreground">{value as string}</span>
                <span className="text-[12px] font-mono text-muted-foreground">${entry?.payload?.value ? entry.payload.value.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}</span>
              </span>
            )}
            wrapperStyle={{ 
              paddingLeft: "20px",
              fontSize: "12px",
              fontFamily: "Source Sans 3"
            }}
          />
          {/* Custom label in the center */}
          <text
            x="35%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground font-mono text-lg font-bold"
          >
            ${total.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </text>
          <text
            x="35%"
            y="60%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[11px] font-medium italic"
          >
            this month
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
