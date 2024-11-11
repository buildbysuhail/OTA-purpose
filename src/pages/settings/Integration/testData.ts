// Define the interface for the TestData structure
export interface TestDataItem {
    SiNo: number;
    Select: boolean;
    VrType: string;
    BillNo: number;
    Date: string;
    Amount: number;
    AdjAmount: number;
    Balance: number;
    AmountToAssign: number;
    BalanceAfter: number;
    PartyName: string;
    RefDate: string;
    AccTransDetailID: string;
    RafNo: string;
    FormType: string;
    FinancilaYearID: string;
    VoucherPrefix: string;
  }
  
  // Unique data array based on the interface
  export const TestData: TestDataItem[] = [
    {
      SiNo: 1,
      Select: false,
      VrType: '702 SW 8th Street',
      BillNo: 20023,
      Date: '10/1/2024',
      Amount: 72716,
      AdjAmount: 0.00,
      Balance: 0.00,
      AmountToAssign: 0.00,
      BalanceAfter: 0.00,
      PartyName: 'Lulu Ltd.',
      RefDate: '30/04/2024',
      AccTransDetailID: '80A',
      RafNo: '445-69',
      FormType: 'normal',
      FinancilaYearID: '1',
      VoucherPrefix: '(800)',
    },
    {
      SiNo: 2,
      Select: false,
      VrType: '2455 Paces Ferry Road NW',
      BillNo: 20024,
      Date: '10/2/2024',
      Amount: 30339,
      AdjAmount: 0.00,
      Balance: 0.00,
      AmountToAssign: 0.00,
      BalanceAfter: 0.00,
      PartyName: 'Acme Corp',
      RefDate: '01/05/2024',
      AccTransDetailID: '80B',
      RafNo: '445-70',
      FormType: 'normal',
      FinancilaYearID: '1',
      VoucherPrefix: '(801)',
    },
    {
      SiNo: 3,
      Select: false,
      VrType: '1000 Nicllet Mall',
      BillNo: 20025,
      Date: '10/3/2024',
      Amount: 55403,
      AdjAmount: 0.00,
      Balance: 0.00,
      AmountToAssign: 0.00,
      BalanceAfter: 0.00,
      PartyName: 'Beta Enterprises',
      RefDate: '02/05/2024',
      AccTransDetailID: '80C',
      RafNo: '445-71',
      FormType: 'normal',
      FinancilaYearID: '2',
      VoucherPrefix: '(802)',
    },
    {
      SiNo: 4,
      Select: false,
      VrType: '999 Lake Drive',
      BillNo: 20026,
      Date: '10/4/2024',
      Amount: 98027,
      AdjAmount: 0.00,
      Balance: 0.00,
      AmountToAssign: 0.00,
      BalanceAfter: 0.00,
      PartyName: 'Delta Ltd.',
      RefDate: '03/05/2024',
      AccTransDetailID: '80D',
      RafNo: '445-72',
      FormType: 'premium',
      FinancilaYearID: '2',
      VoucherPrefix: '(803)',
    },
    {
      SiNo: 5,
      Select: false,
      VrType: '3333 Beverly Rd',
      BillNo: 20027,
      Date: '10/5/2024',
      Amount: 60179,
      AdjAmount: 0.00,
      Balance: 0.00,
      AmountToAssign: 0.00,
      BalanceAfter: 0.00,
      PartyName: 'Gamma Solutions',
      RefDate: '04/05/2024',
      AccTransDetailID: '80E',
      RafNo: '445-73',
      FormType: 'basic',
      FinancilaYearID: '3',
      VoucherPrefix: '(804)',
    },
   
  ];
  