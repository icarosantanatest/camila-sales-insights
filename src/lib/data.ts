import type { SalesData } from './types';
import { parse } from 'papaparse';

// Fallback data in case the spreadsheet is unavailable
const fallbackData: SalesData[] = [
  {
    "timestamp_incoming_webhook": "12/08/2025 12:48:55",
    "data_product_name": "TEMPLATE - 75 SOFT FEM",
    "data_purchase_original_offer_price_value": "29.90",
    "data_purchase_status": "COMPLETED",
    "data_purchase_payment_type": "PIX",
    "data_buyer_name": "Vitória Marques",
    "data_buyer_email": "vitoriamarquescampos@hotmail.com",
    "id": "e60bcae3-2b1f-4a55-8b49-2a6f65d4774e",
  },
  {
    "timestamp_incoming_webhook": "12/08/2025 13:02:29",
    "data_product_name": "Notion Template - Minha vida dos sonhos",
    "data_purchase_original_offer_price_value": "29.90",
    "data_purchase_status": "COMPLETED",
    "data_purchase_payment_type": "PIX",
    "data_buyer_name": "Vitória Marques",
    "data_buyer_email": "vitoriamarquescampos@hotmail.com",
    "id": "2e0de7bd-869e-4702-a078-a0119b53a8aa",
  },
  {
    "timestamp_incoming_webhook": "12/08/2025 17:47:39",
    "data_product_name": "ELA - Guia para a sua versão feminina.",
    "data_purchase_original_offer_price_value": "297",
    "data_purchase_status": "COMPLETED",
    "data_purchase_payment_type": "CREDIT_CARD",
    "data_buyer_name": "Lyse de Melo",
    "data_buyer_email": "lysegaby@hotmail.com",
    "id": "1a74d9c9-1fd5-409e-b7b8-3e5dd570a130",
  }
] as SalesData[];

const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1WZBCP7q-VwiloyVui2Kva_lnFBt4QGKei2nEWQdb12I/export?format=csv&gid=1550216413';

function csvToSalesData(csvText: string): SalesData[] {
  const parsed = parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.error("CSV Parsing errors:", parsed.errors);
  }
  
  // Assuming the CSV headers match the keys in SalesData type
  // This requires a type assertion, be careful with data consistency
  return parsed.data as SalesData[];
}

export async function getSalesData(): Promise<SalesData[]> {
    try {
        const response = await fetch(SPREADSHEET_URL, { next: { revalidate: 60 } }); // Cache for 1 minute
        if (!response.ok) {
          console.error("Failed to fetch spreadsheet:", response.status, response.statusText);
          throw new Error(`Falha ao carregar a planilha (${response.status}).`);
        }
        const csvText = await response.text();
        const data = csvToSalesData(csvText);
        if (data.length === 0) {
          console.warn("CSV data is empty, using fallback data.");
          return fallbackData;
        }
        return data;
    } catch (error) {
        console.error("Error fetching or parsing spreadsheet data:", error);
        console.log("Using fallback data.");
        return fallbackData;
    }
}
