"use client"

import { useMemo } from 'react';
import { Pie, PieChart, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { SalesData } from '@/lib/types';

type Props = {
  data: SalesData[];
};

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

export default function PaymentMethodChart({ data }: Props) {
  const { chartData, chartConfig } = useMemo(() => {
    const paymentCounts: { [key: string]: number } = {};
    data.forEach(item => {
      const paymentType = item.data_purchase_payment_type;
      if (!paymentCounts[paymentType]) {
        paymentCounts[paymentType] = 0;
      }
      paymentCounts[paymentType]++;
    });
    
    const formattedData = Object.keys(paymentCounts).map((name, index) => ({
      name,
      value: paymentCounts[name],
      fill: chartColors[index % chartColors.length]
    }));

    const config = formattedData.reduce((acc, item) => {
        acc[item.name] = { label: item.name, color: item.fill };
        return acc;
    }, {});
    
    return { chartData: formattedData, chartConfig: config };
  }, [data]);

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Métodos de Pagamento</CardTitle>
        <CardDescription>Distribuição de vendas por tipo de pagamento.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent
                hideLabel
                formatter={(value, name) => `${name}: ${value}`}
              />}
            />
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={5}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
