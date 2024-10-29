import { t } from "i18next";

export const employees = [
  { id: 1, headId: 0, fullName: t('accounts'), formCode: "CP", treeNode: 0 },
  { id: 1000, headId: 1, fullName: t('masters'), formCode: "CR", treeNode: 1 },
  { id: 2000, headId: 1000, fullName: t('account_group'), formCode: "BP", treeNode: 2 },
  { id: 2001, headId: 1000, fullName: t('account_ledger'), formCode: "BR", treeNode: 3 },
  { id: 2002, headId: 1000, fullName: t('branch_ledger'), formCode: "JV", treeNode: 4 },
  { id: 2003, headId: 1000, fullName: t('currencies'), formCode: "DN", treeNode: 5 },
  { id: 2004, headId: 1000, fullName: t('exchange_rate'), formCode: "CN", treeNode: 6 },
  { id: 2005, headId: 1000, fullName: t('party_category'), formCode: "PI", treeNode: 7 },
  { id: 2006, headId: 1000, fullName: t('customers'), formCode: "CQP", treeNode: 8 },
  { id: 2007, headId: 1000, fullName: t('suppliers'), formCode: "CQR", treeNode: 9 },
  { id: 2008, headId: 1000, fullName: t('cost_centre'), formCode: "BRC", treeNode: 10 },
  { id: 2009, headId: 1000, fullName: t('privillege_cards'), formCode: "OB", treeNode: 11 },
  { id: 2010, headId: 1000, fullName: t('project_sites'), formCode: "SP", treeNode: 12 },
  { id: 2011, headId: 1000, fullName: t('account_privilages'), formCode: "CB", treeNode: 13 },

  { id: 3000, headId: 2000, fullName: t('add'), prefix: t('mr.'), formCode: "PR", treeNode: 14 },
  { id: 3001, headId: 2000, fullName: t('edit'), formCode: "PE", treeNode: 15 },
  { id: 3002, headId: 2000, fullName: t('delete'), formCode: "PO", treeNode: 16 },
  { id: 3003, headId: 2000, fullName: t('print'), formCode: "PQ", treeNode: 17 },

  { id: 3004, headId: 2001, fullName: t('add'), prefix: t('mr.'), formCode: "SR", treeNode: 18 },
  { id: 3005, headId: 2001, fullName: t('edit'), formCode: "SE", treeNode: 19 },
  { id: 3006, headId: 2001, fullName: t('delete'), formCode: "SO", treeNode: 20 },
  { id: 3007, headId: 2001, fullName: t('print'), formCode: "SQ", treeNode: 21 },

  { id: 3008, headId: 2002, fullName: t('add'), prefix: t('mr.'), formCode: "ST", treeNode: 22 },
  { id: 3009, headId: 2002, fullName: t('edit'), formCode: "DMG", treeNode: 23 },
  { id: 3010, headId: 2002, fullName: t('delete'), formCode: "EX", treeNode: 24 },
  { id: 3011, headId: 2002, fullName: t('print'), formCode: "SH", treeNode: 25 },

  { id: 3012, headId: 2003, fullName: t('add'), prefix: t('mr.'), formCode: "IBT", treeNode: 26 },
  { id: 3013, headId: 2003, fullName: t('edit'), formCode: "MR", treeNode: 27 },
  { id: 3014, headId: 2003, fullName: t('delete'), formCode: "DC", treeNode: 28 },
  { id: 3015, headId: 2003, fullName: t('print'), formCode: "LE", treeNode: 29 },

  { id: 3016, headId: 2004, fullName: t('add'), prefix: t('mr.'), formCode: "SI", treeNode: 30 },
  { id: 3017, headId: 2004, fullName: t('edit'), formCode: "MFR", treeNode: 31 },
  { id: 3018, headId: 2004, fullName: t('delete'), formCode: "BTI", treeNode: 32 },
  { id: 3019, headId: 2004, fullName: t('print'), formCode: "BTO", treeNode: 33 },

  { id: 3020, headId: 2005, fullName: t('add'), prefix: t('mr.'), formCode: "SUB", treeNode: 34 },
  { id: 3021, headId: 2005, fullName: t('edit'), formCode: "GRN", treeNode: 35 },
  { id: 3022, headId: 2005, fullName: t('delete'), formCode: "GD", treeNode: 36 },
  { id: 3023, headId: 2005, fullName: t('print'), formCode: "DR", treeNode: 37 },

  { id: 3024, headId: 2006, fullName: t('add'), prefix: t('mr.'), formCode: "SRV", treeNode: 38 },
  { id: 3025, headId: 2006, fullName: t('edit'), formCode: "MJV", treeNode: 39 },
  { id: 3026, headId: 2006, fullName: t('delete'), formCode: "DEP", treeNode: 40 },
  { id: 3027, headId: 2006, fullName: t('print'), formCode: "TXP", treeNode: 41 },

  { id: 3028, headId: 2007, fullName: t('add'), prefix: t('mr.'), formCode: "GRR", treeNode: 42 },
  { id: 3029, headId: 2007, fullName: t('edit'), formCode: "CPE", treeNode: 43 },
  { id: 3030, headId: 2007, fullName: t('delete'), formCode: "CRE", treeNode: 44 },
  { id: 3031, headId: 2007, fullName: t('print'), formCode: "PRE", treeNode: 45 },

  { id: 3032, headId: 2008, fullName: t('add'), prefix: t('mr.'), formCode: "SRE", treeNode: 46 },
  { id: 3033, headId: 2008, fullName: t('edit'), formCode: "EX-SP", treeNode: 47 },
  { id: 3034, headId: 2008, fullName: t('delete'), formCode: "SH-SP", treeNode: 48 },
  { id: 3035, headId: 2008, fullName: t('print'), formCode: "GR", treeNode: 49 },
];

export const selectionModeLabel = { 'ariaLabel': 'Selection Mode' };
