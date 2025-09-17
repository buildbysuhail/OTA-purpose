
import React, { useEffect, useState } from 'react';
import jwtHelper from '../../helpers/jwt_helper';

interface CurrencyFormatterProps {
    amount?: number;
    currency?: string;
    locale?: string;
}

const CurrencyFormatter = ({ amount = 0, currency = "", locale = '', useLocale = false }) => {
      const [resolvedCurrency, setResolvedCurrency] = useState(currency || "USD");
  const [resolvedLocale, setResolvedLocale] = useState(locale || "en-US");
  
    useEffect(() => {
    const resolveSettings = async () => {
      // resolve currency
      if (!currency) {
        const storedCurrency = await jwtHelper.getCurrency();
        setResolvedCurrency(storedCurrency || "USD");
      } 

      // resolve locale
      if (!locale) {
        if (useLocale) {
          const storedLocale = await jwtHelper.getLocale();
          setResolvedLocale(storedLocale || "en-US");
        } else {
          setResolvedLocale("en-US");
        }
      } 
    };

    resolveSettings();
  }, [currency, locale, useLocale]);
  
    let style = 'currency';
    amount = amount??0;

const formattedCurrency = new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency:resolvedCurrency,
  }).format(amount ?? 0);

  return <>{formattedCurrency}</>;
};

export default CurrencyFormatter;