"use client"

import { useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { SalesData } from '@/lib/types';
import { formatCurrencyBRL, formatShortDate } from '@/lib/helpers';
import { parse, startOfDay } from 'date-fns';

type Props = {
  data: SalesData[];
};

export default function RevenueChart({ data }: Props) {
  const chartData = useMemo(() => {
    const dailyRevenue: { [key: string]: number } = {};

    data.forEach(item => {
      const dateKey = startOfDay(parse(item.timestamp_incoming_webhook, 'dd/MM/yyyy HH:mm:ss', new Date())).toISOString();
      const price = parseFloat(item.data_purchase_original_offer_price_value.replace(',', '.'));
      if (!dailyRevenue[dateKey]) {
        dailyRevenue[dateKey] = 0;
      }
      dailyRevenue[dateKey] += price;
    });

    return Object.keys(dailyRevenue)
      .map(date => ({
        date: new Date(date).getTime(),
        displayDate: formatShortDate(new Date(date)),
        Receita: dailyRevenue[date],
      }))
      .sort((a, b) => a.date - b.date);
  }, [data]);

  const chartConfig = {
    Receita: {
      label: 'Receita',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Receita ao Longo do Tempo</CardTitle>
        <CardDescription>Análise da receita diária no período selecionado.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickFormatter={(value) => formatCurrencyBRL(value).replace('R$', '')}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent
                formatter={(value) => formatCurrencyBRL(value as number)}
                indicator="dot"
              />}
            />
            <Line
              dataKey="Receita"
              type="monotone"
              stroke="var(--color-Receita)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
