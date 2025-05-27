import { UserAction } from "../../../helpers/user-right-helper";
import { ClientSessionModel } from "../../../redux/slices/client-session/reducer";

export const getFilteredReports = (st: any, clientSession: ClientSessionModel, hasRight: (formCode: string, action: UserAction) => boolean) => {
  debugger;
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
  
          
          
          ];
          st = st
            .filter((parent: any) => !excluded.includes(parent.title))
            .map((parent: any) => {
              const filteredChildren = parent.children?.filter(
                (child: any) => !excluded.includes(child.title)
              );
              return {
                ...parent,
                children: filteredChildren,
              };
            })
            .filter((parent: any) => parent.children?.length > 0);
        } else {
          const excluded = ["purchase_estimate_register_report",
            "purchase_return_estimate_register_report",
            "purchase_return_estimate_summary_report",
  
            "purchase_gst_daily_summary_report",
             "purchase_gst_taxwise_report",
            "purchase_gst_taxwise_with_hsn_report",
            "purchase_gst_monthly_summary_report",
            "purchase_gst_detailed_report",
            "purchase_gst_register_format_report",
            "purchase_gst_advance_register_format_report",
            
            "purchase_return_gst_daily_summary_report",
            "purchase_return_gst_sales_and_return_report",
            "purchase_return_gst_taxwise_report",
            "purchase_return_gst_taxwise_with_hsn_report",
            "purchase_return_gst_monthly_summary_report",
            "purchase_return_gst_detailed_report",
            "purchase_return_gst_register_format_report",
            "purchase_return_gst_adv_register_format_report",
            "itemwise_purchase_return_estimate_summary",
  
  
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