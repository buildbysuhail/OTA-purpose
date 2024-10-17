export const initialPrivilegeCard: PrivilegeCardData = {
  privilegeCardID: 0,
  branchID: 0,
  cardNumber: "",
  cardHolderName: "",
  address1: "",
  address2: "",
  phone: "",
  mobile: "",
  email: "",
  dob: null,
  changeID: 0,
  cardType: "",
  priceCategoryID: 0,
  expiryDate: null,
  activateDate: null,
  createdUserID: 0,
  opBalance: 0
};

export interface PrivilegeCardData {
  privilegeCardID: number;
  branchID: number;
  cardNumber: string;
  cardHolderName: string;
  address1: string;
  address2: string;
  phone: string;
  mobile: string;
  email: string;
  dob: string | null;
  changeID: number;
  cardType: string;
  priceCategoryID: number;
  expiryDate: string | null;
  activateDate: string | null;
  createdUserID: number;
  opBalance: number;
}