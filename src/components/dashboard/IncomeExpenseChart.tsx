"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

const data = [
  { month: "Oct", income: 4200, expense: 3100 },
  { month: "Nov", income: 4500, expense: 3400 },
  { month: "Dec", income: 5200, expense: 3800 },
  { month: "Jan", income: 4300, expense: 3200 },
  { month: "Feb", income: 4400, expense: 3300 },
  { month: "Mar", income: 4600, expense: 3500 },
];

export function IncomeExpenseChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E5DE" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#8A8A8A", fontSize: 12, fontFamily: "Source Sans 3" }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#8A8A8A", fontSize: 11, fontFamily: "JetBrains Mono" }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#FFFFFF", 
              border: "1px solid #D9D5CC", 
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontFamily: "Source Sans 3",
              fontSize: "13px"
            }}
            cursor={{ fill: "#F0EDE6" }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="square" 
            iconSize={10}
            wrapperStyle={{ 
              paddingBottom: "20px",
              fontSize: "12px",
              fontFamily: "Source Sans 3",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          />
          <Bar 
            name="Income" 
            dataKey="income" 
            fill="#2B6CB0" 
            radius={[2, 2, 0, 0]} 
            barSize={20}
          />
          <Bar 
            name="Expense" 
            dataKey="expense" 
            fill="#C53030" 
            radius={[2, 2, 0, 0]} 
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
