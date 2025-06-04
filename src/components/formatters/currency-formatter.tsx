
import React from 'react';
import jwtHelper from '../../helpers/jwt_helper';

interface CurrencyFormatterProps {
    amount?: number;
    currency?: string;
    locale?: string;
}

const CurrencyFormatter = ({ amount = 0, currency = '', locale = '', useLocale = false }) => {
    debugger;
    let style = 'currency';
    amount = amount??0;
    currency = currency == null || currency === '' ? jwtHelper.getCurrency() : currency;
    locale = locale == null || locale === '' ? useLocale ?jwtHelper.getLocale(): "en-US" : locale;
const formattedCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount ?? 0);

  return <>{formattedCurrency}</>;
};

export default CurrencyFormatter;