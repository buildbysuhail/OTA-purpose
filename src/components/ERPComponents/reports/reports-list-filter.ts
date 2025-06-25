import { UserAction } from "../../../helpers/user-right-helper";
import { ClientSessionModel } from "../../../redux/slices/client-session/reducer";

export const getFilteredReports = (st: any, clientSession: ClientSessionModel, hasRight: (formCode: string, action: UserAction) => boolean) => {
  
  if (clientSession.isAppGlobal) {
          const excluded = [
            "purchase_tax_report_detailed",
            "purchase_tax_report_summary",
            "sales_tax_report_summary",
            "sales_tax_report_detailed",
            "purchase_tax",
            "sales_tax",
            "vat_return_form",
            "vat_return_form_arabic",
            "ksa_e_invoice_summary",
            "ksa_e_invoice_detailed",

            "daily_summary_report",
            "billwise_profit_report",
            
            "void_report",
          
          
          ];
            
          st = st
            .filter((parent: any) => !excluded.includes(parent.title))
            .map((parent: any) => {
              const filteredChildren = parent.children?.filter(
                (child: any) => !excluded.includes(child.title)
              ).map((x:any)=>{
              return {
                ...x,
                title:x.title.includes("___")?x.title.replace("___",""):x.title 
              }
            });
              return {
                ...parent,
                children: filteredChildren,
              };
            })
            .filter((parent: any) => parent.children?.length > 0).map((x:any)=>{
              return {
                ...x,
                title:x.title.includes("___")?x.title.replace("___",""):x.title 
              }
            });
            return st;
        } else {
          const excluded = [
            "billwise_profit_report___",
            "daily_summary_report___",

            "sales_return_estimate_register",

            "purchase_estimate_register_report",
            "purchase_return_estimate_register_report",
            "purchase_return_estimate_summary_report",
            "sales_return_estimate_register",
            "sales_return_estimate_summary",
            "sales_estimate_register",
            "purchase_estimate_register_report",
            "purchase_return_estimate_register_report",
            "purchase_return_estimate_summary_report",

            "itemwise_sales_transfer_summary",
            "itemwise_sales_return_estimate_summary",
            "itemwise_purchase_return_estimate_summary",
            "excess_stock_sp",
            "shortage_stock_sp",

            "daily_summary",
            "sales_and_return",
             "taxwise",
            "taxwise_with_hsn",
            "monthly_summary",
            "detailed",
            "register_format",
            "adv_register_format",
  
            "gstr1_b2b",
            "gstr1_b2cLarge",
            "gstr1b2c_Small",
            "gstr1_cdnr",
            "gstr1_cdnur",
            "gstr1_summary_of_hsn",
            "gstr1_docs",
            "gstr3b",
  
            "sales_transfer_summary",
            "sales_transfer_register",
            "net_sales_transfer_report",
            "sales_transfer_partyWise_sales",
            "sales_transfer_monthWise_summary",
            "sales_transfer_partyWise_summary",
            
            "sales_price_category_greater_than_mrp___",
            "products_with_price_categories",
            "zero_mrp_product_list___"
          ];
          st = st
            .filter((parent: any) => !excluded.includes(parent.title))
            .map((parent: any) => {
              const filteredChildren = parent.children?.filter(
                (child: any) => !excluded.includes(child.title) && hasRight(child.formCode, child.action)
              );
              return {
                ...parent,
                children: filteredChildren,
              };
            })
            .filter((parent: any) => parent.children?.length > 0);
            
            return st;
        }
}