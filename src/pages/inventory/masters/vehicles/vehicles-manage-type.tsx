export interface VehiclesData {
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

export const initialvehiclesData = {
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
    isCommon: false,
    isRental: false,
    odometer: "",
    remarks: ""
  },
  validations: {
    vehicleName: "",
    vehicleNumber: ""
  },
};
