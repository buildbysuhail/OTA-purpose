import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ErpDevGrid from "../../../../../components/ERPComponents/erp-dev-grid";
import Urls from "../../../../../redux/urls";
import { DevGridColumn } from "../../../../../components/types/dev-grid-column";
import { APIClient } from "../../../../../helpers/api-client";
import { FormField } from "../../../../../utilities/form-types";

const api = new APIClient()
const PromotionCommon: React.FC<{ getFieldProps: (fieldId: string, type?: string) => FormField;}> = React.memo(({getFieldProps}) => {
    const { t } = useTranslation("inventory");
    const [data, setData] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const productID = getFieldProps('product.productID').value;
          const productBatchID = getFieldProps('batch.productBatchID').value;
    
          if (!productID || !productBatchID) return; // skip if values are missing
    
          const params = {
            ProductID: productID,
            ProductBatchID: productBatchID,
          };
    
          const queryString = new URLSearchParams(params as any).toString();
          const res = await api.getAsync(`${Urls.product_scheme_details}?${queryString}`);
    
          // Handle response here (e.g., set state)
          setData(res);
        } catch (error) {
          console.error("Error fetching product scheme details", error);
        }
      };
    
      fetchData();
    }, [getFieldProps('product.productID').value, getFieldProps('batch.productBatchID').value]);
    const columns: DevGridColumn[] = useMemo(() =>
        [
          {
            dataField: "productId",
            caption: t("product_id"),
            dataType: "number",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 50,
          },
          {
            dataField: "product",
            caption: t("product"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100
          },
          {
            dataField: "unitName",
            caption: t("unit_name"),
            dataType: "string",
            allowSorting: true,
            allowSearch: true,
            allowFiltering: true,
            width: 100
          }
        
        ], []);

    return (
        <div className="border border-gray-200 rounded-md p-4">
          <ErpDevGrid
                           columns={columns}
                           gridHeader={t("products")}
                           remoteOperations={{paging: false,filtering: false,  sorting: false}}
                           data={data}
                           gridId="grd_product_scheme_details"
                           hideGridAddButton
                           gridAddButtonType="popup"
                           gridAddButtonIcon="ri-add-line"
                         />
        </div>
    );
});

export default PromotionCommon;