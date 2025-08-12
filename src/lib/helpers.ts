export const formatCurrencyBRL = (value: number | string) => {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  if (isNaN(numericValue)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

export const formatShortDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'UTC', // Use UTC to avoid timezone shifts
    }).format(date);
}
