export interface PrivilegeCardData {
  privilegeCardID: number,
  cardNumber: string,
  cardHolderName: string,
  address1: string,
  address2: string,
  phone: string,
  mobile: string,
  email: string,
  dob: Date,
  changeID: number,
  cardType: string,
  priceCategoryID: number,
  expiryDate: Date,
  activatedDate: Date,
  oBalance: number
}

export const initialPrivilegeCard = {
  data: {
    privilegeCardID: 0,
    cardNumber: "",
    cardHolderName: "",
    address1: "",
    address2: "",
    phone: "",
    mobile: "",
    email: "",
    dob: null,
    changeID: 0,
    cardType: "Privilege",
    priceCategoryID: 1,
    expiryDate: new Date(),
    activatedDate: new Date(),
    oBalance: 0
  },
  validations: {
    cardNumber: "",
    cardHolderName: "",
    address1: "",
    address2: "",
    phone: "",
    mobile: "",
    email: "",
    cardType: "",
    priceCategoryID: "",
  },
};
