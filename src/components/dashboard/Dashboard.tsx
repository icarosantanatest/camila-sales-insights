"use client";

import React, { useState, useMemo } from 'react';
import type { SalesData, DateRange } from '@/lib/types';
import { startOfMonth, endOfMonth } from 'date-fns';
import { BarChartBig, DollarSign, ShoppingCart, TrendingUp, RefreshCw } from 'lucide-react';
import { parse } from 'date-fns';

import DashboardFilters from './DashboardFilters';
import KpiCard from './KpiCard';
import RevenueChart from './RevenueChart';
import RecentSalesTable from './RecentSalesTable';
import ProductSalesChart from './ProductSalesChart';
import PaymentMethodChart from './PaymentMethodChart';
import { formatCurrencyBRL } from '@/lib/helpers';
import { Button } from '@/components/ui/button';

type Props = {
  data: SalesData[];
};

export default function Dashboard({ data }: Props) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  
  const uniqueProducts = useMemo(() => {
    const products = new Set(data.map(item => item.data_product_name));
    return ['all', ...Array.from(products)];
  }, [data]);

  const filteredData = useMemo(() => {
    const validStatuses = ['APPROVED', 'COMPLETED'];
    return data.filter(item => {
      if (!item.timestamp_incoming_webhook) {
        return false;
      }
      try {
        const incomingDate = parse(item.timestamp_incoming_webhook, 'dd/MM/yyyy HH:mm:ss', new Date());
        
        const isDateInRange = 
          (!dateRange.from || incomingDate >= dateRange.from) &&
          (!dateRange.to || incomingDate <= dateRange.to);
        
        const isProductMatch = selectedProduct === 'all' || item.data_product_name === selectedProduct;
        
        return validStatuses.includes(item.data_purchase_status) && isDateInRange && isProductMatch;
      } catch (error) {
        console.error("Error parsing date:", item.timestamp_incoming_webhook);
        return false;
      }
    });
  }, [data, dateRange, selectedProduct]);
  
  const { totalRevenue, totalSales, averageTicket } = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + parseFloat(item.data_purchase_original_offer_price_value.replace(',', '.')), 0);
    const salesCount = filteredData.length;
    const averageTicket = salesCount > 0 ? totalRevenue / salesCount : 0;
    return { totalRevenue, totalSales: salesCount, averageTicket };
  }, [filteredData]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-2">
            <BarChartBig className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Camila Sales Insights</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <DashboardFilters
                dateRange={dateRange}
                setDateRange={setDateRange}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                products={uniqueProducts}
            />
            <Button variant="outline" size="icon" onClick={handleRefresh} className="group">
              <RefreshCw className="h-4 w-4 group-hover:animate-spin" />
              <span className="sr-only">Atualizar Relatório</span>
            </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <KpiCard title="Receita Total" value={formatCurrencyBRL(totalRevenue)} icon={DollarSign} />
            <KpiCard title="Total de Vendas" value={totalSales.toString()} icon={ShoppingCart} />
            <KpiCard title="Ticket Médio" value={formatCurrencyBRL(averageTicket)} icon={TrendingUp} />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <ProductSalesChart data={filteredData} />
          <PaymentMethodChart data={filteredData} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <RevenueChart data={filteredData} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <RecentSalesTable data={filteredData} />
        </div>
      </main>
    </div>
  );
}