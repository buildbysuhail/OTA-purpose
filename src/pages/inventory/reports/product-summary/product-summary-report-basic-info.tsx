import React, { Fragment } from "react";
import { ProductSummaryFilter } from "./product-summary-master";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ProductSummaryReport1 from "./product-summary-report-basic-info1";
import ProductSummaryReport2 from "./product-summary-report-basic-info2";
import { modelToBase64 } from "../../../../utilities/jsonConverter";

interface ProductSummaryReport {
  productID: string;
  productCode: string;
  productName: string;
  groupName: string;
  stockIn: number;
  stockOut: number;
  stock: number;
  productCategoryName: string;
  supplyMethod: string;
  hsnCode: string;
  commodityCode: string;
  remarks: string;
  taxCategoryName: string;
  unitName: string;
  marginPercentage: number;
  itemType: string;
}

interface ProductSummaryReport {
  productBatchID: number;
  autoBarcode: string;
  sPrice: number;
  stockIn: number;
  stockOut: number;
  stock: number;
  wStock: number;
  pPrice: number;
  brandName: string;
  batchNo: string;
}

const ProductSummaryReport: React.FC<{
  filter?: ProductSummaryFilter;
  onReloadChange: () => void;
  reloadBase: boolean;
  onReloadChange2: () => void;
  reloadBase2: boolean;
  onKeyChange: (id: any) => void;
}> = ({
  filter,
  onReloadChange,
  reloadBase,
  onReloadChange2,
  reloadBase2,
  onKeyChange,
}) => {

    const popupData = useSelector((state: RootState) => state.PopupData);

    const updateFilterWithBatchID = (
      loadedData?: ProductSummaryReport[],
      rowData?: ProductSummaryReport
    ) => {
      const productBatchID =
        rowData?.productBatchID || loadedData?.[0]?.productBatchID;

      if (
        productBatchID &&
        productBatchID !== popupData.productSummaryReport.key
      ) {
        
        // dispatch(updateProductSummaryData({...popupData.productSummaryReport, key: productBatchID} ));
        onKeyChange(productBatchID);
      }
    };

    return (
      <Fragment>
        <div className="grid grid-cols-12">
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="px-4 pt-0 pb-0">
              <div className="grid grid-cols-1 gap-3">
                <ProductSummaryReport1
                  onReloadChange={onReloadChange}
                  reloadBase={reloadBase}
                  filter={filter}
                />
              </div>
            </div>
          </div>
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="px-4 pt-0 pb-0">
              <div className="grid grid-cols-1 gap-3">
                <ProductSummaryReport2
                  onReloadChange2={onReloadChange2}
                  reloadBase2={reloadBase2}
                  filter={filter}
                  updateFilterWithBatchID={updateFilterWithBatchID}
                />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

export default React.memo(ProductSummaryReport, (prevProps, nextProps) => {
  
  const pf = modelToBase64(prevProps.filter)
  const nf = modelToBase64(nextProps.filter)
  return (
    pf === nf &&
    prevProps.reloadBase === nextProps.reloadBase &&
    prevProps.reloadBase2 === nextProps.reloadBase2
  );
});
