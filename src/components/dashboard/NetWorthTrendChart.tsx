"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NetWorthData {
  month: string;
  value: number;
}

interface NetWorthTrendChartProps {
  data?: NetWorthData[];
}

const defaultData: NetWorthData[] = [
  { month: "Apr", value: 155000 },
  { month: "May", value: 158000 },
  { month: "Jun", value: 162000 },
  { month: "Jul", value: 165000 },
  { month: "Aug", value: 168000 },
  { month: "Sep", value: 172000 },
  { month: "Oct", value: 175000 },
  { month: "Nov", value: 178000 },
  { month: "Dec", value: 182000 },
  { month: "Jan", value: 184000 },
  { month: "Feb", value: 186000 },
  { month: "Mar", value: 187420 },
];

export function NetWorthTrendChart({ data = defaultData }: NetWorthTrendChartProps) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2B6CB0" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2B6CB0" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            domain={['dataMin - 5000', 'dataMax + 5000']}
            tickFormatter={(value) => `$${(value / 1000)}k`}
          />
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
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#2B6CB0" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
