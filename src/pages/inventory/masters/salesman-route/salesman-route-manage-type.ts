export interface SalesManRouteData {
  salesManRouteID: number;
  salesManID: number;
  salesRouteID: number;
  salesDay?: number[];
  remarks: string;
}

export const initialSalesManRouteData: SalesManRouteData = {
  salesManRouteID: 0,
  salesManID: 0,
  salesRouteID: 0,
  salesDay: [],
  remarks: "",
};
