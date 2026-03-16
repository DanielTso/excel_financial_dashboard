"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface CategorySpendingChartProps {
  data: { name: string; amount: number; color: string }[];
}

export function CategorySpendingChart({ data }: CategorySpendingChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8E5DE" />
        <XAxis 
          type="number"
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#8A8A8A", fontSize: 11, fontFamily: "JetBrains Mono" }} 
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#1A1A1A", fontSize: 12, fontFamily: "Source Sans 3", fontWeight: 500 }}
          width={100}
        />
        <Tooltip 
          cursor={{ fill: "#F0EDE6", opacity: 0.4 }}
          contentStyle={{ 
            backgroundColor: "#FFFFFF", 
            border: "1px solid #D9D5CC", 
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontFamily: "Source Sans 3",
            fontSize: "13px"
          }}
          formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, "Spending"]}
        />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
