export interface SalesRouteData {
  salesRouteID: number,
  routeName: string,
  shortName: string,
  parentRouteID: number,
  isActive: true,
  remarks: string,
  childCount: number,
  creditLimit: number,
  salesManID: number,
  warehouseID: number,
  driverID: number,
  vehicleID: number,
  salesTarget: number,
  incentivePerc: number
}

export const initialSalesRouteData = {
  data: {
    salesRouteID: 0,
    routeName: "",
    shortName: "",
    parentRouteID: 0,
    isActive: true,
    remarks: "",
    childCount: 0,
    creditLimit: 0,
    salesManID: 0,
    warehouseID: 0,
    driverID: 0,
    vehicleID: 0,
    salesTarget: 0,
    incentivePerc: 0
  },
  validations: {
    routeName: "",
    shortName: "",
    parentRouteID: "",
    childCount: "",
    salesManID: "",
    warehouseID: "",
    driverID: "",
    vehicleID: ""
  },
};
