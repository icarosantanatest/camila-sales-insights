"use client"

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { SalesData } from '@/lib/types';

type Props = {
  data: SalesData[];
};

export default function GeoChart({ data }: Props) {
  const chartData = useMemo(() => {
    const stateSales: { [key: string]: number } = {};

    data.forEach(item => {
      const state = item.data_buyer_address_state;
      if (!state) return;
      if (!stateSales[state]) {
        stateSales[state] = 0;
      }
      stateSales[state]++;
    });

    return Object.keys(stateSales)
      .map(state => ({
        state,
        Vendas: stateSales[state],
      }))
      .sort((a, b) => b.Vendas - a.Vendas)
      .slice(0, 10);
  }, [data]);

  const chartConfig = {
    Vendas: {
      label: 'Vendas',
      color: 'hsl(var(--secondary))',
    },
  };

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Vendas por Estado</CardTitle>
        <CardDescription>Distribuição geográfica das vendas.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData}>
            <XAxis dataKey="state" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent
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
