"use client"

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { SalesData } from '@/lib/types';

type Props = {
  data: SalesData[];
};

export default function StateSalesChart({ data }: Props) {
  const chartData = useMemo(() => {
    const stateStats: { [key: string]: number } = {};

    data.forEach(item => {
      const state = item.data_buyer_address_state;
      if (state && state.trim() !== '') {
        if (!stateStats[state]) {
          stateStats[state] = 0;
        }
        stateStats[state]++;
      }
    });

    return Object.keys(stateStats)
      .map(name => ({
        name,
        Vendas: stateStats[name],
      }))
      .sort((a, b) => b.Vendas - a.Vendas)
      .slice(0, 7); // top 7 states
  }, [data]);

  const chartConfig = {
    Vendas: {
      label: 'Vendas',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Vendas por Estado</CardTitle>
        <CardDescription>Estados com o maior número de vendas.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart layout="vertical" data={chartData} margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={40} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent
                 formatter={(value, name) => `${value} vendas`}
                 indicator="dot"
              />}
            />
            <Bar dataKey="Vendas" fill="var(--color-Vendas)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
