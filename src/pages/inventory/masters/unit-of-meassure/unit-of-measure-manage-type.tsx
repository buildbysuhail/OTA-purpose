export interface MeasureData {
  unitID: number,
  unitCode: string,
  unitName: string,
  unitType: string,
  multipleFactor: number,
  secondUnitID: number,
  decimalPoints: number,
  totalUnitinBaseUnit: number,
  remarks: string
}

export const initialMeasureData = {
  data: {
    unitID: 0,
    unitCode: "",
    unitName: "",
    unitType: -2,
    multipleFactor: 0,
    secondUnitID: 0,
    decimalPoints: 0,
    totalUnitinBaseUnit: 0,
    remarks: ""
  },
  validations: {
    unitCode: "",
    unitName: "",
    unitType: "",
    multipleFactor: "",
    secondUnitID: ""
  },
};
