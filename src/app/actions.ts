"use server";

import { analyzeSalesInsights } from "@/ai/flows/sales-insights";
import type { SalesData } from "@/lib/types";

export async function getAiInsights(salesData: SalesData[]) {
  try {
    // We select a subset of fields to send to the AI to avoid exceeding context limits
    // and to focus the analysis on the most relevant data.
    const simplifiedData = salesData.map(item => ({
        product_name: item.data_product_name,
        price: item.data_purchase_price_value,
        status: item.data_purchase_status,
        payment_type: item.data_purchase_payment_type,
        state: item.data_buyer_address_state,
        approved_date: new Date(Number(item.data_purchase_approved_date)).toISOString(),
    }));

    if (simplifiedData.length === 0) {
        return {
            summary: "Nenhum dado de venda disponível para o período selecionado.",
            insights: "Sem dados, sem insights. Tente ajustar os filtros.",
            potentialIssues: "A ausência de dados pode ser um problema. Verifique a integração da fonte de dados.",
            futureSalesPatterns: "Impossível prever o futuro sem dados do passado."
        }
    }

    const salesDataString = JSON.stringify(simplifiedData);
    
    const result = await analyzeSalesInsights({ salesData: salesDataString });
    return result;

  } catch (error) {
    console.error("Error getting AI insights:", error);
    return { error: "Failed to get AI insights. Please try again later." };
  }
}
