"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    selectedProduct: string;
    setSelectedProduct: (product: string) => void;
    products: string[];
}

export default function DashboardFilters({ dateRange, setDateRange, selectedProduct, setSelectedProduct, products }: Props) {
  
  return (
    <div className="flex items-center gap-2">
       <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-[180px] hidden md:flex">
            <SelectValue placeholder="Filtrar produto..." />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
                <SelectItem key={product} value={product}>
                    {product === 'all' ? 'Todos os Produtos' : product}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y", { locale: ptBR })
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => range && setDateRange(range)}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
