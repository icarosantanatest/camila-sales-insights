"use client"

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SalesData } from '@/lib/types';
import { formatCurrencyBRL } from '@/lib/helpers';

type Props = {
  data: SalesData[];
};

export default function SalesOriginChart({ data }: Props) {
  const tableData = useMemo(() => {
    const originStats: { [key: string]: { quantity: number; revenue: number } } = {};
    
    data.forEach(item => {
      const origin = (item.data_purchase_origin_sck || 'N/A').toLowerCase();
      const price = parseFloat(item.data_purchase_original_offer_price_value?.replace(',', '.')) || 0;

      if (!originStats[origin]) {
        originStats[origin] = { quantity: 0, revenue: 0 };
      }
      originStats[origin].quantity++;
      originStats[origin].revenue += price;
    });
    
    return Object.keys(originStats)
      .map(origin => ({
        origin,
        quantity: originStats[origin].quantity,
        revenue: originStats[origin].revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Origem das Vendas</CardTitle>
        <CardDescription>Quantidade e faturamento por canal de venda.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Origem</TableHead>
              <TableHead className="text-center">Quantidade</TableHead>
              <TableHead className="text-right">Faturamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map(({ origin, quantity, revenue }) => (
              <TableRow key={origin}>
                <TableCell className="font-medium capitalize">{origin}</TableCell>
                <TableCell className="text-center">{quantity}</TableCell>
                <TableCell className="text-right">{formatCurrencyBRL(revenue)}</TableCell>
              </TableRow>
            ))}
             {tableData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nenhuma origem encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
