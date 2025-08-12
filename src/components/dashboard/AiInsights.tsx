"use client"

import React, { useState, useTransition } from 'react';
import { Lightbulb, Loader, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAiInsights } from '@/app/actions';
import type { SalesData } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

type Props = {
  filteredData: SalesData[];
};

type Insights = {
    summary: string;
    insights: string;
    potentialIssues: string;
    futureSalesPatterns: string;
    error?: string;
}

export default function AiInsights({ filteredData }: Props) {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<Insights | null>(null);

  const handleGenerateInsights = () => {
    startTransition(async () => {
      const result = await getAiInsights(filteredData);
      setInsights(result);
    });
  };

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary" />
                Insights com Inteligência Artificial
                </CardTitle>
                <CardDescription>
                Analise seus dados de vendas para obter insights e recomendações.
                </CardDescription>
            </div>
            <Button onClick={handleGenerateInsights} disabled={isPending}>
                {isPending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                {isPending ? 'Analisando...' : 'Gerar Insights'}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPending && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                <p>Aguarde, nossa IA está analisando os dados...</p>
            </div>
        )}
        {!isPending && insights && (
            <div className="space-y-4">
            {insights.error ? (
                <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle/>
                    <p>{insights.error}</p>
                </div>
            ) : (
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Resumo das Tendências</AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
                          {insights.summary}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Insights para Melhoria</AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
                           {insights.insights}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Possíveis Problemas</AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
                           {insights.potentialIssues}
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-4">
                        <AccordionTrigger>Padrões de Vendas Futuros</AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
                           {insights.futureSalesPatterns}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
            </div>
        )}
        {!isPending && !insights && (
            <div className="text-center p-8 text-muted-foreground">
                <p>Clique em "Gerar Insights" para começar a análise.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
