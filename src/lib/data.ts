import type { SalesData } from './types';

const baseSample: Omit<SalesData, 'id' | 'data_purchase_approved_date' | 'data_purchase_price_value' | 'data_product_name' | 'data_purchase_payment_type' | 'data_buyer_address_state' | 'data_buyer_address_city' | 'data_purchase_transaction' | 'data_buyer_name' | 'data_buyer_email'> = {
  timestamp_incoming_webhook: '12/08/2025 09:01:14',
  data_product_support_email: '',
  data_product_has_co_production: '',
  data_product_warranty_date: '2025-08-11T00:00:00Z',
  data_product_is_physical_product: '',
  data_product_id: '5468098',
  data_product_ucode: 'a0d09750-5ce5-46f0-938d-71369f88e782',
  data_product_content_has_physical_products: '',
  data_product_content_products_0_name: '',
  data_product_content_products_0_is_physical_product: '',
  data_product_content_products_0_id: '',
  data_product_content_products_0_ucode: '',
  data_product_content_products_1_name: '',
  data_product_content_products_1_is_physical_product: '',
  data_product_content_products_1_id: '',
  data_product_content_products_1_ucode: '',
  data_commissions_0_currency_value: 'BRL',
  data_commissions_0_source: 'MARKETPLACE',
  data_commissions_0_value: '30,4',
  data_commissions_1_currency_value: 'BRL',
  data_commissions_1_source: 'PRODUCER',
  data_commissions_1_value: '264,11',
  data_purchase_original_offer_price_currency_value: 'BRL',
  data_purchase_original_offer_price_value: '297',
  data_purchase_checkout_country_iso: 'BR',
  data_purchase_checkout_country_name: 'Brasil',
  data_purchase_sckPaymentLink: '',
  data_purchase_order_bump_parent_purchase_transaction: '',
  data_purchase_order_bump_is_order_bump: '',
  data_purchase_offer_code: 'bhzxyq3a',
  data_purchase_offer_coupon_code: '',
  data_purchase_is_funnel: '',
  data_purchase_event_tickets_amount: '',
  data_purchase_order_date: '1754346702000',
  data_purchase_price_currency_value: 'BRL',
  data_purchase_payment_installments_number: '1',
  data_purchase_full_price_currency_value: 'BRL',
  data_purchase_full_price_value: '297',
  data_purchase_business_model: 'I',
  data_purchase_status: 'COMPLETED',
  data_affiliates_0_affiliate_code: '',
  data_affiliates_0_name: '',
  data_producer_legal_nature: 'Pessoa Jurídica',
  data_producer_document: '55378532000159',
  data_producer_name: 'CAMILA FARO COMUNICACOES LTDA',
  data_subscription_subscriber_code: '',
  data_subscription_plan_name: '',
  data_subscription_plan_id: '',
  data_subscription_status: '',
  data_buyer_checkout_phone_code: '27',
  data_buyer_address_zipcode: '29101022',
  data_buyer_address_country: 'Brasil',
  data_buyer_address_number: '2124',
  data_buyer_address_address: 'Avenida Antônio Gil Veloso',
  data_buyer_address_neighborhood: 'Praia da Costa',
  data_buyer_address_complement: 'Apto. 202',
  data_buyer_address_country_iso: 'BR',
  data_buyer_document: '13975467789',
  data_buyer_last_name: 'Carvalho',
  data_buyer_checkout_phone: '27992686615',
  data_buyer_first_name: 'Amanda',
  data_buyer_document_type: 'CPF',
  creation_date: '1755000069279',
  event: 'PURCHASE_APPROVED',
  version: '2.0.0',
};

const products = [
  'ELA - Guia para a sua versão feminina.',
];

const paymentTypes: SalesData['data_purchase_payment_type'][] = ['PIX', 'CREDIT_CARD', 'BILLET', 'PAYPAL'];

const states = [
  { state: 'SP', city: 'São Paulo' },
  { state: 'RJ', city: 'Rio de Janeiro' },
  { state: 'MG', city: 'Belo Horizonte' },
  { state: 'ES', city: 'Vila Velha' },
  { state: 'BA', city: 'Salvador' },
  { state: 'PR', city: 'Curitiba' },
  { state: 'RS', city: 'Porto Alegre' },
  { state: 'SC', city: 'Florianópolis' },
  { state: 'PE', city: 'Recife' },
  { state: 'CE', city: 'Fortaleza' },
];

const names = [
  { first: 'Mariana', last: 'Silva' },
  { first: 'Lucas', last: 'Santos' },
  { first: 'Beatriz', last: 'Oliveira' },
  { first: 'Rafael', last: 'Souza' },
  { first: 'Juliana', last: 'Costa' },
  { first: 'Felipe', last: 'Pereira' },
  { first: 'Larissa', last: 'Rodrigues' },
  { first: 'Gustavo', last: 'Almeida' },
  { first: 'Camila', last: 'Nunes' },
  { first: 'Bruno', last: 'Lima' },
];

const generateRandomData = (count: number): SalesData[] => {
  const data: SalesData[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const purchaseDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const price = (Math.random() * 500 + 50).toFixed(2);
    const product = products[0]; // Always use the first product
    const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
    const location = states[Math.floor(Math.random() * states.length)];
    const buyerInfo = names[Math.floor(Math.random() * names.length)];

    data.push({
      ...baseSample,
      id: `e895cf03-e11d-42cf-9024-d777b15c${1000 + i}`,
      data_purchase_approved_date: String(purchaseDate.getTime()),
      data_purchase_price_value: price,
      data_purchase_full_price_value: price,
      data_purchase_original_offer_price_value: price,
      data_product_name: product,
      data_purchase_payment_type: paymentType,
      data_buyer_address_state: location.state,
      data_buyer_address_city: location.city,
      data_purchase_transaction: `HP374201${6800 + i}`,
      data_buyer_name: `${buyerInfo.first} ${buyerInfo.last}`,
      data_buyer_first_name: buyerInfo.first,
      data_buyer_last_name: buyerInfo.last,
      data_buyer_email: `${buyerInfo.first.toLowerCase()}.${buyerInfo.last.toLowerCase()}@example.com`,
    });
  }
  return data;
};

export const salesData: SalesData[] = generateRandomData(50);
