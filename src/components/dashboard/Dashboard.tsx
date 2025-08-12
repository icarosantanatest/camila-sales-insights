"use client";

import React, { useState, useMemo } from 'react';
import type { SalesData, DateRange } from '@/lib/types';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { BarChartBig, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

import DashboardFilters from './DashboardFilters';
import KpiCard from './KpiCard';
import RevenueChart from './RevenueChart';
import ProductSalesChart from './ProductSalesChart';
import PaymentMethodChart from './PaymentMethodChart';
import RecentSalesTable from './RecentSalesTable';
import { formatCurrencyBRL } from '@/lib/helpers';

type Props = {
  data: SalesData[];
};

export default function Dashboard({ data }: Props) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  
  const uniqueProducts = useMemo(() => {
    const products = new Set(data.map(item => item.data_product_name));
    return ['all', ...Array.from(products)];
  }, [data]);

  const filteredData = useMemo(() => {
    const validStatuses = ['COMPLETED'];
    return data.filter(item => {
      const approvedDate = new Date(Number(item.data_purchase_approved_date));
      const isDateInRange = 
        (!dateRange.from || approvedDate >= startOfDay(dateRange.from)) &&
        (!dateRange.to || approvedDate <= endOfDay(dateRange.to));
      
      const isProductMatch = selectedProduct === 'all' || item.data_product_name === selectedProduct;
      
      return validStatuses.includes(item.data_purchase_status) && isDateInRange && isProductMatch;
    });
  }, [data, dateRange, selectedProduct]);
  
  const { totalRevenue, totalSales, averageTicket } = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + parseFloat(item.data_purchase_original_offer_price_value), 0);
    const salesCount = filteredData.length;
    const averageTicket = salesCount > 0 ? totalRevenue / salesCount : 0;
    return { totalRevenue, totalSales: salesCount, averageTicket };
  }, [filteredData]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-2">
            <BarChartBig className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Hotmart Sales Insights</h1>
        </div>
        <div className="ml-auto">
            <DashboardFilters
                dateRange={dateRange}
                setDateRange={setDateRange}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                products={uniqueProducts}
            />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <KpiCard title="Receita Total" value={formatCurrencyBRL(totalRevenue)} icon={DollarSign} />
            <KpiCard title="Total de Vendas" value={totalSales.toString()} icon={ShoppingCart} />
            <KpiCard title="Ticket Médio" value={formatCurrencyBRL(averageTicket)} icon={TrendingUp} />
        </div>
        
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
          <RevenueChart data={filteredData} />
          <ProductSalesChart data={filteredData} />
          <PaymentMethodChart data={filteredData} />
        </div>

        <div>
          <RecentSalesTable data={filteredData} />
        </div>
      </main>
    </div>
  );
}
