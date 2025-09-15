"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { SalesData } from '@/lib/types'
import { formatCurrencyBRL } from '@/lib/helpers'
import { Badge } from "@/components/ui/badge"
import { parse, format } from 'date-fns'

type Props = {
  data: SalesData[];
};

export default function RecentSalesTable({ data }: Props) {
  const recentSales = data
    .sort((a, b) => {
        try {
          const dateA = parse(a.timestamp_incoming_webhook, 'dd/MM/yyyy HH:mm:ss', new Date()).getTime();
          const dateB = parse(b.timestamp_incoming_webhook, 'dd/MM/yyyy HH:mm:ss', new Date()).getTime();
          return dateB - dateA;
        } catch(e) {
            return 0;
        }
    })
    .slice(0, 10);

  const formatDateTime = (timestamp: string) => {
    try {
      const date = parse(timestamp, 'dd/MM/yyyy HH:mm:ss', new Date());
      return format(date, 'dd/MM/yy HH:mm');
    } catch {
      return 'Data inválida';
    }
  }

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Últimas Vendas</CardTitle>
        <CardDescription>As 10 vendas mais recentes do período selecionado.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Data e Hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Produto</TableHead>
              <TableHead className="hidden sm:table-cell">Origem</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale, index) => (
              <TableRow key={`${sale.id}-${index}`}>
                 <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(sale.timestamp_incoming_webhook)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{sale.data_buyer_name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {sale.data_buyer_email}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{sale.data_product_name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                   <Badge variant="outline" className="capitalize">
                      {(sale.data_purchase_origin_sck || 'N/A').toLowerCase()}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrencyBRL(sale.data_purchase_original_offer_price_value)}</TableCell>
              </TableRow>
            ))}
             {recentSales.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma venda recente encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
