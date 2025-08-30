import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { ApplicationSettingsType } from '../pages/settings/system/application-settings-types/application-settings-types';
import { RootState } from '../redux/store';


// Currency Data Interface
export interface CurrencyData {
  readonly currencyName: string;
  readonly subUnit: string;
}

// Currency Database Interface
export interface CurrencyDatabase {
  readonly [key: string]: CurrencyData;
}

// ==================== CURRENCY ENUMS AND TYPES ====================

export enum Currencies {
  SAUDI_ARABIA = 'SAR',
  BULGARIA = 'BGN',
  SPAIN = 'EUR',
  TAIWAN = 'TWD',
  CZECH_REPUBLIC = 'CZK',
  DENMARK = 'DKK',
  GERMANY = 'EUR',
  GREECE = 'EUR',
  UNITED_STATES = 'USD',
  FINLAND = 'EUR',
  FRANCE = 'EUR',
  ISRAEL = 'ILS',
  HUNGARY = 'HUF',
  ICELAND = 'ISK',
  ITALY = 'EUR',
  JAPAN = 'JPY',
  KOREA = 'KRW',
  NETHERLANDS = 'EUR',
  NORWAY = 'NOK',
  POLAND = 'PLN',
  BRAZIL = 'BRL',
  SWITZERLAND = 'CHF',
  ROMANIA = 'RON',
  RUSSIA = 'RUB',
  CROATIA = 'EUR',
  SLOVAKIA = 'EUR',
  ALBANIA = 'ALL',
  SWEDEN = 'SEK',
  THAILAND = 'THB',
  TURKEY = 'TRY',
  PAKISTAN = 'PKR',
  INDONESIA = 'IDR',
  UKRAINE = 'UAH',
  BELARUS = 'BYN',
  SLOVENIA = 'EUR',
  ESTONIA = 'EUR',
  LATVIA = 'EUR',
  LITHUANIA = 'EUR',
  TAJIKISTAN = 'TJS',
  IRAN = 'IRR',
  VIETNAM = 'VND',
  ARMENIA = 'AMD',
  AZERBAIJAN = 'AZN',
  MACEDONIA = 'MKD',
  SOUTH_AFRICA = 'ZAR',
  GEORGIA = 'GEL',
  FAROE_ISLANDS = 'DKK',
  INDIA = 'INR',
  MALTA = 'EUR',
  MALAYSIA = 'MYR',
  KAZAKHSTAN = 'KZT',
  KYRGYZSTAN = 'KGS',
  KENYA = 'KES',
  TURKMENISTAN = 'TMT',
  UZBEKISTAN = 'UZS',
  MONGOLIA = 'MNT',
  CHINA = 'CNY',
  UNITED_KINGDOM = 'GBP',
  CAMBODIA = 'KHR',
  LAOS = 'LAK',
  SYRIA = 'SYP',
  SRI_LANKA = 'LKR',
  CANADA = 'CAD',
  ETHIOPIA = 'ETB',
  NEPAL = 'NPR',
  AFGHANISTAN = 'AFN',
  PHILIPPINES = 'PHP',
  MALDIVES = 'MVR',
  NIGERIA = 'NGN',
  BOLIVIA = 'BOB',
  LUXEMBOURG = 'EUR',
  GREENLAND = 'DKK',
  CHILE = 'CLP',
  NEW_ZEALAND = 'NZD',
  GUATEMALA = 'GTQ',
  RWANDA = 'RWF',
  SENEGAL = 'XOF',
  IRAQ = 'IQD',
  MEXICO = 'MXN',
  BELGIUM = 'EUR',
  PORTUGAL = 'EUR',
  SERBIA_MONTENEGRO = 'RSD', // Note: Serbia and Montenegro split, using Serbian Dinar
  IRELAND = 'EUR',
  BRUNEI = 'BND',
  BANGLADESH = 'BDT',
  ALGERIA = 'DZD',
  ECUADOR = 'USD',
  EGYPT = 'EGP',
  HONG_KONG = 'HKD',
  AUSTRIA = 'EUR',
  AUSTRALIA = 'AUD',
  PERU = 'PEN',
  LIBYA = 'LYD',
  SINGAPORE = 'SGD',
  BOSNIA_HERZEGOVINA = 'BAM',
  MACAO = 'MOP',
  LIECHTENSTEIN = 'CHF',
  COSTA_RICA = 'CRC',
  MOROCCO = 'MAD',
  PANAMA = 'PAB',
  MONACO = 'EUR',
  TUNISIA = 'TND',
  DOMINICAN_REPUBLIC = 'DOP',
  OMAN = 'OMR',
  JAMAICA = 'JMD',
  VENEZUELA = 'VES',
  YEMEN = 'YER',
  CARIBBEAN = 'XCD', // Eastern Caribbean Dollar (commonly used)
  COLOMBIA = 'COP',
  SERBIA = 'RSD',
  BELIZE = 'BZD',
  JORDAN = 'JOD',
  TRINIDAD_TOBAGO = 'TTD',
  ARGENTINA = 'ARS',
  MONTENEGRO = 'EUR',
  LEBANON = 'LBP',
  ZIMBABWE = 'ZWL',
  KUWAIT = 'KWD',
  UAE = 'AED',
  URUGUAY = 'UYU',
  BAHRAIN = 'BHD',
  PARAGUAY = 'PYG',
  QATAR = 'QAR',
  EL_SALVADOR = 'USD',
  HONDURAS = 'HNL',
  NICARAGUA = 'NIO',
  PUERTO_RICO = 'USD',
  GOLD = 'XAU',
  OTHER = ''
}

export interface CurrencyConfig {
  readonly currencyId: number;
  readonly currencyCode: string;
  readonly isCurrencyNameFeminine: boolean;
  readonly englishCurrencyName: string;
  readonly englishPluralCurrencyName: string;
  readonly englishCurrencyPartName: string;
  readonly englishPluralCurrencyPartName: string;
  readonly arabic1CurrencyName: string;
  readonly arabic2CurrencyName: string;
  readonly arabic310CurrencyName: string;
  readonly arabic1199CurrencyName: string;
  readonly arabic1CurrencyPartName: string;
  readonly arabic2CurrencyPartName: string;
  readonly arabic310CurrencyPartName: string;
  readonly arabic1199CurrencyPartName: string;
  readonly partPrecision: number;
  readonly isCurrencyPartNameFeminine: boolean;
}

// ==================== CONVERSION RESULT TYPES ====================

export interface ConversionResult {
  readonly english: string;
  readonly arabic: string;
  readonly simple: string;
}

export interface ConversionOptions {
  readonly amount: number;
  readonly currency?: Currencies;
  readonly englishPrefix?: string;
  readonly englishSuffix?: string;
  readonly arabicPrefix?: string;
  readonly arabicSuffix?: string;
}

// ==================== CURRENCY INFO CLASS ====================

export class CurrencyInfo {
  private readonly config: CurrencyConfig;

  constructor(currency: Currencies) {
    this.config = this.initializeCurrency(currency)??{};
  }

  public get currencyId(): number { return this.config.currencyId; }
  public get currencyCode(): string { return this.config.currencyCode; }
  public get isCurrencyNameFeminine(): boolean { return this.config.isCurrencyNameFeminine; }
  public get englishCurrencyName(): string { return this.config.englishCurrencyName; }
  public get englishPluralCurrencyName(): string { return this.config.englishPluralCurrencyName; }
  public get englishCurrencyPartName(): string { return this.config.englishCurrencyPartName; }
  public get englishPluralCurrencyPartName(): string { return this.config.englishPluralCurrencyPartName; }
  public get arabic1CurrencyName(): string { return this.config.arabic1CurrencyName; }
  public get arabic2CurrencyName(): string { return this.config.arabic2CurrencyName; }
  public get arabic310CurrencyName(): string { return this.config.arabic310CurrencyName; }
  public get arabic1199CurrencyName(): string { return this.config.arabic1199CurrencyName; }
  public get arabic1CurrencyPartName(): string { return this.config.arabic1CurrencyPartName; }
  public get arabic2CurrencyPartName(): string { return this.config.arabic2CurrencyPartName; }
  public get arabic310CurrencyPartName(): string { return this.config.arabic310CurrencyPartName; }
  public get arabic1199CurrencyPartName(): string { return this.config.arabic1199CurrencyPartName; }
  public get partPrecision(): number { return this.config.partPrecision; }
  public get isCurrencyPartNameFeminine(): boolean { return this.config.isCurrencyPartNameFeminine; }

  private initializeCurrency(currency: Currencies): CurrencyConfig {
    const currencyConfigs: Partial<Record<Currencies, CurrencyConfig>> = {
      [Currencies.SYRIA]: {
        currencyId: 0,
        currencyCode: "SYP",
        isCurrencyNameFeminine: true,
        englishCurrencyName: "Syrian Pound",
        englishPluralCurrencyName: "Syrian Pounds",
        englishCurrencyPartName: "Piaster",
        englishPluralCurrencyPartName: "Piasteres",
        arabic1CurrencyName: "ليرة سورية",
        arabic2CurrencyName: "ليرتان سوريتان",
        arabic310CurrencyName: "ليرات سورية",
        arabic1199CurrencyName: "ليرة سورية",
        arabic1CurrencyPartName: "قرش",
        arabic2CurrencyPartName: "قرشان",
        arabic310CurrencyPartName: "قروش",
        arabic1199CurrencyPartName: "قرشاً",
        partPrecision: 2,
        isCurrencyPartNameFeminine: false
      },
      [Currencies.UAE]: {
        currencyId: 1,
        currencyCode: "AED",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "UAE Dirham",
        englishPluralCurrencyName: "UAE Dirhams",
        englishCurrencyPartName: "Fils",
        englishPluralCurrencyPartName: "Fils",
        arabic1CurrencyName: "درهم إماراتي",
        arabic2CurrencyName: "درهمان إماراتيان",
        arabic310CurrencyName: "دراهم إماراتية",
        arabic1199CurrencyName: "درهماً إماراتياً",
        arabic1CurrencyPartName: "فلس",
        arabic2CurrencyPartName: "فلسان",
        arabic310CurrencyPartName: "فلوس",
        arabic1199CurrencyPartName: "فلساً",
        partPrecision: 2,
        isCurrencyPartNameFeminine: false
      },
      [Currencies.SAUDI_ARABIA]: {
        currencyId: 2,
        currencyCode: "SAR",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "Saudi Riyal",
        englishPluralCurrencyName: "Saudi Riyals",
        englishCurrencyPartName: "Halala",
        englishPluralCurrencyPartName: "Halalas",
        arabic1CurrencyName: "ريال سعودي",
        arabic2CurrencyName: "ريالان سعوديان",
        arabic310CurrencyName: "ريالات سعودية",
        arabic1199CurrencyName: "ريالاً سعودياً",
        arabic1CurrencyPartName: "هللة",
        arabic2CurrencyPartName: "هللتان",
        arabic310CurrencyPartName: "هللات",
        arabic1199CurrencyPartName: "هللة",
        partPrecision: 2,
        isCurrencyPartNameFeminine: true
      },
      [Currencies.QATAR]: {
        currencyId: 3,
        currencyCode: "QAR",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "Qatar Riyal",
        englishPluralCurrencyName: "Qatar Riyals",
        englishCurrencyPartName: "Dirham",
        englishPluralCurrencyPartName: "Dirhams",
        arabic1CurrencyName: "ريال قطري",
        arabic2CurrencyName: "ريالان قطريان",
        arabic310CurrencyName: "ريالات قطرية",
        arabic1199CurrencyName: "ريالاً قطرياً",
        arabic1CurrencyPartName: "درهم",
        arabic2CurrencyPartName: "درهمان",
        arabic310CurrencyPartName: "دراهم",
        arabic1199CurrencyPartName: "درهماً",
        partPrecision: 2,
        isCurrencyPartNameFeminine: false
      },
      [Currencies.BAHRAIN]: {
        currencyId: 4,
        currencyCode: "BHD",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "Bahraini Dinar",
        englishPluralCurrencyName: "Bahraini Dinars",
        englishCurrencyPartName: "Fils",
        englishPluralCurrencyPartName: "Fils",
        arabic1CurrencyName: "دينار بحريني",
        arabic2CurrencyName: "ديناران بحرينيان",
        arabic310CurrencyName: "دنانير بحرينية",
        arabic1199CurrencyName: "ديناراً بحرينياً",
        arabic1CurrencyPartName: "فلس",
        arabic2CurrencyPartName: "فلسان",
        arabic310CurrencyPartName: "فلوس",
        arabic1199CurrencyPartName: "فلساً",
        partPrecision: 3,
        isCurrencyPartNameFeminine: false
      },
      [Currencies.OMAN]: {
        currencyId: 5,
        currencyCode: "OMR",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "Omani Rial",
        englishPluralCurrencyName: "Omani Rials",
        englishCurrencyPartName: "Baisa",
        englishPluralCurrencyPartName: "Baisa",
        arabic1CurrencyName: "ريال عماني",
        arabic2CurrencyName: "ريالان عمانيان",
        arabic310CurrencyName: "ريالات عمانية",
        arabic1199CurrencyName: "ريالاً عمانياً",
        arabic1CurrencyPartName: "بيسة",
        arabic2CurrencyPartName: "بيستان",
        arabic310CurrencyPartName: "بيسات",
        arabic1199CurrencyPartName: "بيسة",
        partPrecision: 3,
        isCurrencyPartNameFeminine: true
      },
      [Currencies.KUWAIT]: {
        currencyId: 6,
        currencyCode: "KWD",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "Kuwaiti Dinar",
        englishPluralCurrencyName: "Kuwaiti Dinars",
        englishCurrencyPartName: "Fils",
        englishPluralCurrencyPartName: "Fils",
        arabic1CurrencyName: "دينار كويتي",
        arabic2CurrencyName: "ديناران كويتيان",
        arabic310CurrencyName: "دنانير كويتية",
        arabic1199CurrencyName: "ديناراً كويتياً",
        arabic1CurrencyPartName: "فلس",
        arabic2CurrencyPartName: "فلسان",
        arabic310CurrencyPartName: "فلوس",
        arabic1199CurrencyPartName: "فلساً",
        partPrecision: 3,
        isCurrencyPartNameFeminine: false
      },
      [Currencies.TUNISIA]: {
        currencyId: 7,
        currencyCode: "TND",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "Tunisian Dinar",
        englishPluralCurrencyName: "Tunisian Dinars",
        englishCurrencyPartName: "Millime",
        englishPluralCurrencyPartName: "Millimes",
        arabic1CurrencyName: "دينار تونسي",
        arabic2CurrencyName: "ديناران تونسيان",
        arabic310CurrencyName: "دنانير تونسية",
        arabic1199CurrencyName: "ديناراً تونسياً",
        arabic1CurrencyPartName: "مليم",
        arabic2CurrencyPartName: "مليمان",
        arabic310CurrencyPartName: "ملاليم",
        arabic1199CurrencyPartName: "مليماً",
        partPrecision: 3,
        isCurrencyPartNameFeminine: false
      },
      [Currencies.GOLD]: {
        currencyId: 8,
        currencyCode: "XAU",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "Gram",
        englishPluralCurrencyName: "Grams",
        englishCurrencyPartName: "Milligram",
        englishPluralCurrencyPartName: "Milligrams",
        arabic1CurrencyName: "جرام",
        arabic2CurrencyName: "جرامان",
        arabic310CurrencyName: "جرامات",
        arabic1199CurrencyName: "جراماً",
        arabic1CurrencyPartName: "مليجرام",
        arabic2CurrencyPartName: "مليجرامان",
        arabic310CurrencyPartName: "مليجرامات",
        arabic1199CurrencyPartName: "مليجراماً",
        partPrecision: 2,
        isCurrencyPartNameFeminine: false
      },
      [Currencies.OTHER]: {
        currencyId: 9,
        currencyCode: "XXX",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "Unit",
        englishPluralCurrencyName: "Units",
        englishCurrencyPartName: "Subunit",
        englishPluralCurrencyPartName: "Subunits",
        arabic1CurrencyName: "وحدة",
        arabic2CurrencyName: "وحدتان",
        arabic310CurrencyName: "وحدات",
        arabic1199CurrencyName: "وحدة",
        arabic1CurrencyPartName: "جزء",
        arabic2CurrencyPartName: "جزءان",
        arabic310CurrencyPartName: "أجزاء",
        arabic1199CurrencyPartName: "جزءاً",
        partPrecision: 2,
        isCurrencyPartNameFeminine: false
      }
    };
const defaultConfig: CurrencyConfig= { currencyId: 9,
        currencyCode: "",
        isCurrencyNameFeminine: false,
        englishCurrencyName: "",
        englishPluralCurrencyName: "",
        englishCurrencyPartName: "",
        englishPluralCurrencyPartName: "",
        arabic1CurrencyName: "",
        arabic2CurrencyName: "",
        arabic310CurrencyName: "",
        arabic1199CurrencyName: "",
        arabic1CurrencyPartName: "",
        arabic2CurrencyPartName: "",
        arabic310CurrencyPartName: "",
        arabic1199CurrencyPartName: "",
        partPrecision: 2,
        isCurrencyPartNameFeminine: false}
    return currencyConfigs[currency]??defaultConfig;
  }
}

// ==================== CURRENCY DATABASE ====================

const DEFAULT_CURRENCY_DATABASE: CurrencyDatabase = {
  [Currencies.SYRIA]: { currencyName: "Syrian Pounds", subUnit: "Piasters" },
  [Currencies.UAE]: { currencyName: "UAE Dirhams", subUnit: "Fils" },
  [Currencies.SAUDI_ARABIA]: { currencyName: "Saudi Riyals", subUnit: "Halalas" },
  [Currencies.QATAR]: { currencyName: "Qatar Riyals", subUnit: "Dirhams" },
  [Currencies.BAHRAIN]: { currencyName: "Bahraini Dinars", subUnit: "Fils" },
  [Currencies.OMAN]: { currencyName: "Omani Rials", subUnit: "Baisa" },
  [Currencies.KUWAIT]: { currencyName: "Kuwaiti Dinars", subUnit: "Fils" },
  [Currencies.TUNISIA]: { currencyName: "Tunisian Dinars", subUnit: "Millimes" },
  [Currencies.GOLD]: { currencyName: "Grams", subUnit: "Milligrams" },
  [Currencies.OTHER]: { currencyName: "Units", subUnit: "Subunits" }
} as const;

// ==================== CONVERSION CLASSES ====================

class NumberConverter {
  private static readonly ZEROS = "000000";
  
  // English arrays
  private static readonly ENGLISH_ONES = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
    "Seventeen", "Eighteen", "Nineteen"
  ] as const;

  private static readonly ENGLISH_TENS = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ] as const;

  private static readonly ENGLISH_GROUPS = [
    "", "Thousand", "Million", "Billion", "Trillion"
  ] as const;

  // Arabic arrays
  private static readonly ARABIC_ONES = [
    "", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة",
    "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", 
    "سبعة عشر", "ثمانية عشر", "تسعة عشر"
  ] as const;

  private static readonly ARABIC_FEMININE_ONES = [
    "", "إحدى", "اثنتان", "ثلاث", "أربع", "خمس", "ست", "سبع", "ثمان", "تسع",
    "عشر", "إحدى عشرة", "اثنتا عشرة", "ثلاث عشرة", "أربع عشرة", "خمس عشرة", "ست عشرة", 
    "سبع عشرة", "ثماني عشرة", "تسع عشرة"
  ] as const;

  private static readonly ARABIC_TENS = [
    "", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"
  ] as const;

  private static readonly ARABIC_HUNDREDS = [
    "", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"
  ] as const;

  public static convertToEnglish(
    amount: number, 
    currency: CurrencyInfo, 
    settings: ApplicationSettingsType
  ): string {
    if (amount === 0) return "Zero";

    const { integerPart, decimalPart } = this.extractParts(amount, currency, settings);
    
    let result = "";
    
    if (integerPart > 0) {
      result += this.convertIntegerToEnglish(integerPart, settings);
      result += ` ${integerPart === 1 ? currency.englishCurrencyName : currency.englishPluralCurrencyName}`;
    }

    if (decimalPart > 0) {
      if (result) result += " and ";
      result += this.convertIntegerToEnglish(decimalPart, settings);
      result += ` ${decimalPart === 1 ? currency.englishCurrencyPartName : currency.englishPluralCurrencyPartName}`;
    }

    return result + " only.";
  }

  public static convertToArabic(
    amount: number, 
    currency: CurrencyInfo, 
    settings: ApplicationSettingsType
  ): string {
    if (amount === 0) return "صفر";

    const { integerPart, decimalPart } = this.extractParts(amount, currency, settings);
    
    let result = "";
    
    if (integerPart > 0) {
      result += this.convertIntegerToArabic(integerPart);
      result += ` ${this.getArabicCurrencyName(integerPart, currency, false)}`;
    }

    if (decimalPart > 0) {
      if (result) result += " و ";
      result += this.convertIntegerToArabic(decimalPart);
      result += ` ${this.getArabicCurrencyName(decimalPart, currency, true)}`;
    }

    return result + " فقط.";
  }

  private static extractParts(amount: number, currency: CurrencyInfo, settings: ApplicationSettingsType): {
    integerPart: number;
    decimalPart: number;
  } {
    const parts = amount.toString().split('.');
    const integerPart = parseInt(parts[0], 10);
    
    let decimalPart = 0;
    if (parts.length > 1) {
      let decimalString = parts[1];
      decimalString = decimalString.padEnd(settings.mainSettings.decimalPoints, '0');
      decimalString = decimalString.substring(0, settings.mainSettings.decimalPoints);
      decimalPart = parseInt(decimalString, 10);
    }

    return { integerPart, decimalPart };
  }

  private static convertIntegerToEnglish(num: number, settings: ApplicationSettingsType): string {
    if (num === 0) return "";
    
    if (settings.mainSettings.showNumberFormat === 'Lakhs') {
      return this.convertToLakhsFormat(num);
    } else {
      return this.convertToMillionsFormat(num);
    }
  }

  private static convertToMillionsFormat(num: number): string {
    if (num === 0) return "";
    
    const result: string[] = [];
    let groupIndex = 0;
    
    while (num > 0) {
      const group = num % 1000;
      if (group > 0) {
        const groupText = this.convertHundreds(group);
        if (groupIndex > 0) {
          result.unshift(`${groupText} ${this.ENGLISH_GROUPS[groupIndex]}`);
        } else {
          result.unshift(groupText);
        }
      }
      num = Math.floor(num / 1000);
      groupIndex++;
    }
    
    return result.join(' ').trim();
  }

  private static convertToLakhsFormat(num: number): string {
    if (num === 0) return "";
    
    const result: string[] = [];
    
    // Crores
    if (num >= 10000000) {
      const crores = Math.floor(num / 10000000);
      result.push(`${this.convertHundreds(crores)} Crore`);
      num %= 10000000;
    }
    
    // Lakhs
    if (num >= 100000) {
      const lakhs = Math.floor(num / 100000);
      result.push(`${this.convertHundreds(lakhs)} Lakh`);
      num %= 100000;
    }
    
    // Thousands
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      result.push(`${this.convertHundreds(thousands)} Thousand`);
      num %= 1000;
    }
    
    // Hundreds
    if (num > 0) {
      result.push(this.convertHundreds(num));
    }
    
    return result.join(' ').trim();
  }

  private static convertHundreds(num: number): string {
    if (num === 0) return "";
    
    let result = "";
    
    // Hundreds
    if (num >= 100) {
      result += `${this.ENGLISH_ONES[Math.floor(num / 100)]} Hundred`;
      num %= 100;
      if (num > 0) result += " ";
    }
    
    // Tens and ones
    if (num >= 20) {
      result += this.ENGLISH_TENS[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) result += ` ${this.ENGLISH_ONES[num]}`;
    } else if (num > 0) {
      result += this.ENGLISH_ONES[num];
    }
    
    return result;
  }

  private static convertIntegerToArabic(num: number): string {
    if (num === 0) return "";
    
    const result: string[] = [];
    
    // Simplified Arabic conversion for demo
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      result.push(`${this.convertArabicHundreds(thousands)} ألف`);
      num %= 1000;
    }
    
    if (num > 0) {
      result.push(this.convertArabicHundreds(num));
    }
    
    return result.join(' و ').trim();
  }

  private static convertArabicHundreds(num: number): string {
    if (num === 0) return "";
    
    let result = "";
    
    // Hundreds
    if (num >= 100) {
      result += this.ARABIC_HUNDREDS[Math.floor(num / 100)];
      num %= 100;
      if (num > 0) result += " و ";
    }
    
    // Tens and ones
    if (num >= 20) {
      result += this.ARABIC_TENS[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) result += ` و ${this.ARABIC_ONES[num]}`;
    } else if (num > 0) {
      result += this.ARABIC_ONES[num];
    }
    
    return result;
  }

  private static getArabicCurrencyName(amount: number, currency: CurrencyInfo, isDecimal: boolean): string {
    const remaining100 = amount % 100;
    
    if (remaining100 === 0 || remaining100 === 1) {
      return isDecimal ? currency.arabic1CurrencyPartName : currency.arabic1CurrencyName;
    } else if (remaining100 === 2) {
      return isDecimal ? currency.arabic2CurrencyPartName : currency.arabic2CurrencyName;
    } else if (remaining100 >= 3 && remaining100 <= 10) {
      return isDecimal ? currency.arabic310CurrencyPartName : currency.arabic310CurrencyName;
    } else {
      return isDecimal ? currency.arabic1199CurrencyPartName : currency.arabic1199CurrencyName;
    }
  }
}

// ==================== MAIN HOOK ====================

export const useNumberToWords = () => {
  const applicationSettings = useSelector((state: RootState) => state.ApplicationSettings);
  
  const currencyDatabase = useMemo<CurrencyDatabase>(() => {
    // You can extend this to fetch from an API or database
    return DEFAULT_CURRENCY_DATABASE;
  }, []);

  const getCurrentCurrency = useMemo(() => {
    const currencyData = currencyDatabase[applicationSettings.mainSettings.currency];
    return currencyData || DEFAULT_CURRENCY_DATABASE[Currencies.UAE];
  }, [applicationSettings.mainSettings.currency, currencyDatabase]);

  const convertToWords = useMemo(() => {
    return (options: ConversionOptions): ConversionResult => {
      const currency = options.currency !== undefined 
        ? options.currency 
        : applicationSettings.mainSettings.currency as Currencies;
      
      const currencyInfo = new CurrencyInfo(currency);
      
      const english = NumberConverter.convertToEnglish(
        options.amount, 
        currencyInfo, 
        applicationSettings
      );
      
      const arabic = NumberConverter.convertToArabic(
        options.amount, 
        currencyInfo, 
        applicationSettings
      );
      
      const simple = NumberConverter.convertToEnglish(
        options.amount, 
        new CurrencyInfo(Currencies.OTHER), 
        applicationSettings
      );

      return {
        english: `${options.englishPrefix || ""}${english}${options.englishSuffix || ""}`,
        arabic: `${options.arabicPrefix || ""}${arabic}${options.arabicSuffix || ""}`,
        simple: simple
      };
    };
  }, [applicationSettings.mainSettings]);

  const convertAmount = useMemo(() => {
    return (amount: number, currency?: Currencies): ConversionResult => {
      return convertToWords({ amount, currency });
    };
  }, [convertToWords]);

  const convertAmountToEnglish = useMemo(() => {
    return (amount: number, currency?: Currencies): string => {
      return convertToWords({ amount, currency }).english;
    };
  }, [convertToWords]);

  const convertAmountToArabic = useMemo(() => {
    return (amount: number, currency?: Currencies): string => {
      return convertToWords({ amount, currency }).arabic;
    };
  }, [convertToWords]);

  const getAvailableCurrencies = useMemo(() => {
    return (): Array<{ id: Currencies; name: string; code: string }> => {
      return Object.values(Currencies)
        .filter((value): value is Currencies => typeof value === 'number')
        .map(currency => {
          const info = new CurrencyInfo(currency);
          return {
            id: currency,
            name: info.englishCurrencyName,
            code: info.currencyCode
          };
        });
    };
  }, []);
  function toArabicNumber(input: number | string): string {
  const enToArMap: { [key: string]: string } = {
    "0": "۰",
    "1": "۱",
    "2": "۲",
    "3": "۳",
    "4": "۴",
    "5": "۵",
    "6": "۶",
    "7": "۷",
    "8": "۸",
    "9": "۹"
  };

  return input
    .toString()
    .split("")
    .map(char => (enToArMap[char] !== undefined ? enToArMap[char] : char))
    .join("");
}
function getArabicDateNumber(ardate: string): string {
  const arabicNum = "٠١٢٣٤٥٦٧٨٩";
  let arabicNumber = "";

  for (let i = 0; i < ardate.length; i++) {
    const char = ardate.charAt(i);

    if (/[0-9]/.test(char)) { // check if it's a digit
      const index = parseInt(char, 10);
      arabicNumber += arabicNum[index];
    } else {
      arabicNumber += char;
    }
  }

  return arabicNumber;
}
  return {
    // Main conversion functions
    convertToWords,
    convertAmount,
    convertAmountToEnglish,
    convertAmountToArabic,
    toArabicNumber,
    getArabicDateNumber,
    // Utility functions
    getAvailableCurrencies,
    getCurrentCurrency,
    
    // Settings
    settings: applicationSettings.mainSettings,
    
    // Currency info
    getCurrencyInfo: (currency: Currencies) => new CurrencyInfo(currency),
    
    // Types for external use
    Currencies,
    
    // Validation
    isValidAmount: (amount: number): boolean => {
      return typeof amount === 'number' && !isNaN(amount) && amount >= 0;
    }
  } as const;
};

// ==================== EXPORT TYPES ====================

export type UseNumberToWordsReturn = ReturnType<typeof useNumberToWords>;
export type ConvertToWordsFunction = UseNumberToWordsReturn['convertToWords'];
export type ConvertAmountFunction = UseNumberToWordsReturn['convertAmount'];

// ==================== UTILITY HOOK FOR FORM USAGE ====================

export const useAmountConverter = () => {
  const { convertAmount, isValidAmount, settings } = useNumberToWords();
  
  const userSession = useSelector((state: RootState) => state.UserSession);
  const defaultCurrency= userSession.currency.currencyCode
  const convertFormAmount = useMemo(() => {
    return (amount: string | number, currency?: Currencies): ConversionResult | null => {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      
      if (!isValidAmount(numAmount)) {
        return null;
      }
      
      return convertAmount(numAmount, currency || defaultCurrency as Currencies);
    };
  }, [convertAmount, isValidAmount, defaultCurrency]);

  return {
    convertFormAmount,
    isValidAmount,
    settings,
    defaultCurrency: defaultCurrency || (defaultCurrency as Currencies)
  } as const;
};