"use server";

import { analyzeSalesInsights } from "@/ai/flows/sales-insights";
import type { SalesData } from "@/lib/types";

export async function getAiInsights(data: SalesData[]) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      error: 'A chave da API da Gemini não foi configurada. Por favor, adicione-a ao arquivo .env'
    };
  }
  try {
    const relevantData = data.map(item => ({
        valor: item.data_purchase_original_offer_price_value,
        produto: item.data_product_name,
        data: new Date(Number(item.data_purchase_approved_date)).toLocaleDateString(),
        pagamento: item.data_purchase_payment_type,
        estado: item.data_buyer_address_state
    }));

    const result = await analyzeSalesInsights({ salesData: JSON.stringify(relevantData, null, 2) });
    return result;
  } catch (e: any) {
    console.error(e);
    return {
      error: `Ocorreu um erro ao analisar os insights: ${e.message}`
    };
  }
}
