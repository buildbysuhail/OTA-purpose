export interface CurrencyData {
    currencyId: number;
    currencyCode: string;
    currencyName: string;
    currencySymbol: string;
    subUnit: string;
    subUnitSymbol: string;
    countryId: number;
    countryName: string;
  }
  export const initialCurrency = {
    data: {
      currencyId: 0,
      currencyCode: '',
      currencyName: '',
      currencySymbol: '',
      subUnit: '',
      subUnitSymbol: '',
      countryId: 0,
      countryName: '',
    },
    validations: {
      currencyId: '',
      currencyCode: '',
      currencyName: '',
      currencySymbol: '',
      subUnit: '',
      subUnitSymbol: '',
      countryId: '',
      countryName: '',
    },
  };
    