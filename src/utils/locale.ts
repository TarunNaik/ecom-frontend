export const getBrowserCurrency = () => {
  try {
    const locale = navigator.language;
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
    const parts = formatter.resolvedOptions();
    return parts.currency;
  } catch (error) {
    console.error("Could not determine currency from locale, defaulting to USD.", error);
    return 'USD'; // Default currency in case of error
  }
};