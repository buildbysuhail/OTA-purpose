export interface SchemesData {
  vehicleID: number,
  vehicleName: string,
  vehicleNumber: string,
  noOfWheels: number,
  model: string,
  capacity: number,
  manufacture: string,
  ownerName: string,
  color: string,
  isCommon: true,
  isRental: true,
  odometer: string,
  remarks: string
}

export const initialSchemesData = {
  data: {
    vehicleID: 0,
    vehicleName: "",
    vehicleNumber: "",
    noOfWheels: 0,
    model: "",
    capacity: 0,
    manufacture: "",
    ownerName: "",
    color: "",
    isCommon: true,
    isRental: true,
    odometer: "",
    remarks: ""
  },
  validations: {
    vehicleName: "",
    vehicleNumber: ""
  },
};
