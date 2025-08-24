"use client"

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { SalesData } from '@/lib/types';
import { formatCurrencyBRL } from '@/lib/helpers';

type Props = {
  data: SalesData[];
};

export default function ProductSalesChart({ data }: Props) {
  const chartData = useMemo(() => {
    const productStats: { [key: string]: { revenue: number, count: number } } = {};

    data.forEach(item => {
      const productName = item.data_product_name;
      if (!productName) return;
      
      const price = parseFloat(item.data_purchase_original_offer_price_value?.replace(',', '.')) || 0;
      if (!productStats[productName]) {
        productStats[productName] = { revenue: 0, count: 0 };
      }
      productStats[productName].revenue += price;
      productStats[productName].count += 1;
    });

    return Object.keys(productStats)
      .map(name => ({
        name: name.substring(0, 25) + (name.length > 25 ? '...' : ''), // shorten long names
        fullName: name,
        Receita: productStats[name].revenue,
        Vendas: productStats[name].count,
      }))
      .sort((a, b) => b.Receita - a.Receita)
      .slice(0, 7); // top 7 products
  }, [data]);

  const chartConfig = {
    Receita: {
      label: 'Receita',
      color: 'hsl(var(--accent))',
    },
     Vendas: {
      label: 'Vendas',
    },
  };

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Vendas por Produto</CardTitle>
        <CardDescription>Receita e quantidade dos produtos mais vendidos.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart layout="vertical" data={chartData} margin={{ left: 50 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={100} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent
                formatter={(value, name, item) => {
                  const { fullName, Receita, Vendas } = item.payload;
                  return (
                    <div className="flex flex-col gap-1 text-sm">
                       <div className="font-bold">{fullName}</div>
                       <div>
                         <span className="font-medium">Receita:</span> {formatCurrencyBRL(Receita as number)}
                       </div>
                       <div>
                         <span className="font-medium">Vendas:</span> {Vendas}
                       </div>
                    </div>
                  )
                }}
                indicator="dot"
              />}
            />
            <Bar dataKey="Receita" fill="var(--color-Receita)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
