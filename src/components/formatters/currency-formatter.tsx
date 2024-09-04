
import React from 'react';
import jwtHelper from '../../helpers/jwt_helper';

interface CurrencyFormatterProps {
    amount?: number;
    currency?: string;
    locale?: string;
}

const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({ amount = 0, currency = '', locale = '' }) => {
    let style = 'currency';
    amount = amount??0;
    currency = currency == null || currency === '' ? jwtHelper.getCurrency() : currency;
    locale = locale == null || locale === '' ? jwtHelper.getLocale() : locale;
    const formattedCurrency = new Intl.NumberFormat(locale, { currency }).format(amount);
    
    return (
        <span>{formattedCurrency}</span>
    );
}

export default CurrencyFormatter;
