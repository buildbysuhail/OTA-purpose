import { Fragment, useEffect, useState } from "react";
import { Popover } from "@headlessui/react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { PrinterIcon } from "@heroicons/react/24/solid";

import RetailPreviewWrapper from "./DesignPreview/RetailPreview/PreviewWrapper";

import DownloadStandardPreview from "./DownloadPreview/StandardPreview/DownloadPreview";
import DownloadRetailPreview from "./DownloadPreview/RetailPreview/DownloadPreview";
import { reducerNameFromUrl } from "../../redux/actions/AppActions";
import { TemplateGroupTypes } from "./constants/TemplateCategories";
import StandardPreviewWrapper from "./DesignPreview/StandardPreview";
import DNPSTemplate from "./DownloadPreview/DeliveryNote_PackingSlip";
import { TemplateState } from "./Designer/interfaces";
import {
  getAmountInWords,
  getCurrentCurrencySymbol,
} from "../../utilities/Utils";
import { TemplateReducerState } from "../../redux/reducers/TemplateReducer";
import {
  isTaxApplicable,
  taxListFinder,
  taxListFinderInclusive,
} from "../../utilities/ERPUtils";
import ERPModal from "../../components/ERPComponents/erp-modal";
import ERPPopover from "../../components/ERPComponents/erp-popover";
import ERPSideView from "../../components/ERPComponents/erp-side-view";
import ERPChangeTemplateSidebar from "../../components/ERPComponents/erp-change-template-sidebar";
import {
  useAppDispatch,
  useAppSelector,
} from "../../utilities/hooks/useAppDispatch";
import { getAction } from "../../redux/slices/app-thunks";
import Urls from "../../redux/urls";
import { RootState } from "../../redux/store";
import { APIClient } from "../../helpers/api-client";
import { getTemplates } from "../../redux/slices/templates/thunk";
import useApplicationSetting from "../../utilities/hooks/use-application-settings";

interface InvoicePreviewProps {
  data?: any;
  docTitle?: string;
  docIDKey?: string;
  showOptions?: boolean;
  templateGroupId?: TemplateGroupTypes;
  endpointUrl?: string;
}

export type PDFVoucherTypes = "normal" | "deliveryNote" | "packingSlip";

const AssociatedCustomerPDFList = [
  "sales_order",
  "sales_return",
  "sales_invoice",
  "sales_estimate",
  "payment_receipts",
  "retainer_invoice",
  "retainer_invoice_receipts",
];

const AssociatedVendorPDFList = ["purchase_invoice", "purchase_order"];
const api = new APIClient();

const InvoicePreview = ({
  data,
  docIDKey,
  docTitle,
  templateGroupId = "sales_invoice",
  showOptions = true,
  endpointUrl,
}: InvoicePreviewProps) => {
  
  const appDispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currencySymbol = getCurrentCurrencySymbol();

  const branchSettings = useApplicationSetting("branch");

  const userProfile = useAppSelector((state: RootState) => state?.UserSession);
  const hasPermissionToUpdateProfile = true;
  const hasPermissionForTemplates = true;

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showChangeTemplate, setShowChangeTemplate] = useState(false);
  const [associatedTempInfo, setAssociatedTempInfo] = useState<any>([]);
  const [templatesInfo, setTemplatesInfo] = useState<any>({ loading: true });
  const [voucherType, setVoucherType] = useState<PDFVoucherTypes>("normal");

  const templateWrap = useSelector(
    (state: any) => state?.Template
  ) as TemplateReducerState;

  const gstTreatmentReducerName = reducerNameFromUrl(Urls.tax_treatment, "GET");
  const gstTreatmentList = useSelector(
    (state: any) => state?.[gstTreatmentReducerName]
  )?.data?.results;


  const totalAmountInwords = getAmountInWords(
    isNaN(+data?.total_price) ? 0 : +data?.total_price,
    currencySymbol || ""
  );

  /* ########################################################################################### */
  const getTemplateInfo = (): { content?: TemplateState } => {
    // checking  :  if  voucher wise templpate Id available
    // pathname?.includes("/invoice_designer/") ? reduxTemplateData?.activeTemplate : getTemplateInfo().content
    if (data?.template?.id) {
      let result = templateWrap.templates?.find(
        (template: any) =>
          template?.voucher_type === templateGroupId &&
          template?.id === data?.template?.id
      );
      return {
        content: result,
      };
    }
    //
    // checking : if  customer/vendor associated templpate Id available
    else if (associatedTempInfo?.[templateGroupId]) {
      let result = templateWrap.templates?.find(
        (template: any) =>
          template?.voucher_type === templateGroupId &&
          template?.id === associatedTempInfo?.[templateGroupId]
      );
      return {
        content: result,
      };
    }
    //
    // Appplying default template of the templates group
    else {
      let result = templateWrap?.templates?.find(
        (template: any) =>
          template?.voucher_type === templateGroupId && template?.is_default
      );
      return {
        content: result,
      };
    }
  };
  /* ########################################################################################### */
  const [templateData, setTemplateData] = useState<TemplateState | undefined>();
  useEffect(() => {
    
    setTemplateData(pathname?.includes("/invoice_designer/")
      ? templateWrap?.activeTemplate
      : getTemplateInfo().content);
  },[templateWrap?.activeTemplate]);
  

  /* ########################################################################################### */

  let paperWidth;
  const backgroundColor = templateData?.propertiesState?.bg_color || "#fff";
  const paperSize = templateData?.propertiesState?.pageSize || "A4";

  switch (paperSize) {
    case "A5":
      paperWidth = "w-[450px]";
      break;
    case "A4":
      paperWidth = "w-[500px]";
      break;
    case "LETTER":
      paperWidth = "w-[600px]";
      break;
    case "3Inch":
      paperWidth = "w-[210px]";
      break;
    case "4Inch":
      paperWidth = "w-[260px]";
      break;
    default:
      paperWidth = "w-[500px]";
  }

  /* ####################################################################### */

  const tableSummary = useSelector((state: any) => state.ERPTableSummary);

  const hasTax = isTaxApplicable(
    pathname,
    data,
    gstTreatmentList,
    data?.items,
    data
  );

  const updatedTableData = data?.items?.map((item: any) => ({
    ...item,
    tax_split: item?.item_tax_category?.tax_split?.map((split: any) => ({
      ...split,
      name: item?.item_tax_category?.name,
    })),
  }));

  let taxInfo: any = {};
  if (data?.is_tax == "inclusive") {
    taxInfo = hasTax
      ? taxListFinderInclusive(
          updatedTableData,
          tableSummary,
          data?.discount_type
        )
      : [];
  } else {
    taxInfo = hasTax
      ? taxListFinder(updatedTableData, tableSummary, data?.discount_type)
      : [];
  }

  /* ####################################################################### */

  const MoreOptions = () => {
    return (
      <div className="bg-white absolute right-0 top-0 text-xs w-[170px] flex flex-col border rounded-md shadow-lg">
        {hasPermissionForTemplates && (
          <Popover.Button
            className=" p-2 w-full rounded-t hover:bg-accent hover:text-white text-left"
            onClick={() =>
              navigate(`/templates?template_group=${templateGroupId}`)
            }
          >
            Edit Template
          </Popover.Button>
        )}
        {hasPermissionToUpdateProfile && (
          <Popover.Button
            className={`p-2 border-t  ${
              templateGroupId !== "sales_invoice" && "rounded-b"
            } hover:bg-accent hover:text-white text-left`}
            onClick={() => navigate("/settings/organization")}
          >
            Update Logo & Address
          </Popover.Button>
        )}
        {/* <Popover.Button className={`p-2 cursor-pointer rounded hover:bg-accent hover:text-white text-left`}>
          <a onClick={warning}>Manage Custom Fields</a>
        </Popover.Button> */}
        {/* <Popover.Button className={`p-2 cursor-pointer rounded hover:bg-accent hover:text-white text-left`}>
          <a onClick={warning}>Terms and Conditions</a>
        </Popover.Button> */}

        {templateGroupId === "sales_invoice" && (
          <>
            <Popover.Button
              className={`p-2 cursor-pointer border-t hover:bg-accent hover:text-white text-left`}
              onClick={() => {
                setVoucherType("deliveryNote");
                setShowPrintModal(true);
              }}
            >
              <div>Print Delivery Note</div>
            </Popover.Button>

            <Popover.Button
              className={`p-2 cursor-pointer border-t rounded-b hover:bg-accent hover:text-white text-left`}
              onClick={() => {
                setVoucherType("packingSlip");
                setShowPrintModal(true);
              }}
            >
              <div>Print Packing Slip</div>
            </Popover.Button>
          </>
        )}
      </div>
    );
  };

  const DownloadPreviewTemplate = () => {
    if (paperSize === "3Inch" || paperSize === "4Inch") {
      return (
        <DownloadRetailPreview
          template={templateData}
          data={data}
          docIDKey={docIDKey}
          docTitle={docTitle}
          currencySymbol={currencySymbol || ""}
          totalAmountInwords={totalAmountInwords}
        />
      );
    } else
      return (
        <DownloadStandardPreview
          data={data}
          taxInfo={taxInfo}
          docIDKey={docIDKey}
          docTitle={docTitle}
          template={templateData}
          currencySymbol={currencySymbol || ""}
          totalAmountInwords={totalAmountInwords}
          templateGroupId={templateGroupId}
        />
      );
  };

  /* ####################################################################### */

  const printModal = (PDFType: PDFVoucherTypes = "normal") => {
    return (
      <div>
        <PDFViewer width={700} height={700} showToolbar={true}>
          {PDFType === "normal" ? (
            <DownloadPreviewTemplate />
          ) : (
            <DNPSTemplate // delivery note & payment slip
              data={data}
              template={templateData}
            />
          )}
        </PDFViewer>
      </div>
    );
  };

  /* ####################################################################### */
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data) {
      // if (AssociatedCustomerPDFList?.includes(templateGroupId) && !pathname?.includes("/invoice_designer/")) {
      //   (appDispatch(getAction(Urls.customer_templates, `customer=${data?.customer?.id}`)) as any).then((res: any) => {
      //     setAssociatedTempInfo(res?.payload?.data[0]);
      //   });
      // }
      // if (AssociatedVendorPDFList?.includes(templateGroupId) && !pathname?.includes("/invoice_designer/")) {
      //   (appDispatch(getAction(Urls.vendor_templates, `vendor=${data?.vendor?.id}`)) as any).then((res: any) => {
      //     setAssociatedTempInfo(res?.payload?.data[0]);
      //   });
      // }
      appDispatch(
        getAction({
          apiUrl: Urls.templates,
          params: `template_group=${templateGroupId}`,
        })
      );
    }
  }, [data]);
  const [generalBackGroundStyle, setGeneralBackGroundStyle] = useState<any>({
    backgroundRepeat: "no-repeat",
    backgroundColor: templateData?.propertiesState?.bg_color || "#fff",
    backgroundPosition:
      templateData?.propertiesState?.bg_image_position ?? "top left",
  });

  // Used setTimeout for adding Loader which wait for completing re-render  of the preview
  useEffect(() => {
    dispatch(getTemplates("template_group='sales_invoice'"));
    setTimeout(() => {
      setTemplatesInfo((prevData: any) => ({ ...prevData, loading: false }));
      if (searchParams?.get("print_voucher")) {
        setShowPrintModal(true);
      }
    }, 2000);
  }, []);
  useEffect(() => {
    
    setGeneralBackGroundStyle((previous: any) => ({
      ...previous,
      backgroundImage: templateData?.background_image
        ? `url(${templateData?.background_image})`
        : "",
      backgroundRepeat: "no-repeat",
      backgroundColor: templateData?.propertiesState?.bg_color,
      backgroundPosition:
        templateData?.propertiesState?.bg_image_position ?? "top left",
    }));
  }, [templateData, templateData?.propertiesState?.bg_image_position]);

  /* ####################################################################### */

  /* ####################################################################### */

  const MiniLoader = () => {
    return (
      <div className="h-1 w-1 bg-blue-700 rounded-full animate-ping">
        <div className=""></div>
      </div>
    );
  };

  return (
    <Fragment>
      {!templatesInfo?.loading ? (
        <div className=" relative flex flex-col items-center bg-[#f9f9fb] overflow-auto p-7 print:p-0 h-full w-full">
          <div
            id="invoicePreview"
            style={generalBackGroundStyle}
            className={`flex  flex-col gap-4 relative ${paperWidth} shadow-md print:m-0 print:w-full print:shadow-none`}
          >
            {
            paperSize === "3Inch" || paperSize === "4Inch" ? (
              <RetailPreviewWrapper
                data={data}
                docIDKey={docIDKey}
                docTitle={docTitle}
                template={templateData}
                currency={currencySymbol || undefined}
                templateGroupId={templateGroupId}
              />
            ) : (
              <StandardPreviewWrapper
                data={data}
                docIDKey={docIDKey}
                docTitle={docTitle}
                template={templateData}
                currency={currencySymbol || undefined}
                templateGroupId={templateGroupId}
              />
            )
            }
          </div>
          {showOptions && (
            <div className="absolute flex flex-col top-3 right-3 ">
              {/*  Print Option */}

              <div
                title="Print Invoice"
                onClick={() => {
                  setVoucherType("normal");
                  setShowPrintModal(true);
                }}
                className=" text-gray-700 hover:text-accent print:hidden cursor-pointer  rounded-t-lg border border-b-0 p-2 bg-white"
              >
                <PrinterIcon className=" w-4 h-4 " />
              </div>

              {/* ############################ Download Option ############################ */}

              <PDFDownloadLink
                document={<DownloadPreviewTemplate />}
                fileName={`${
                  data?.[docIDKey || "sales_invoice_no"] || "voucher"
                }.pdf`}
              >
                {/* {({ blob, url, loading, error }) => (
                  <div
                    title="Download Invoice"
                    className={` text-gray-700 hover:text-accent  print:hidden cursor-pointer ${
                      !pathname?.includes("/invoice_designer/") ? "border-b-0" : "rounded-b-lg"
                    } border   p-2 bg-white `}
                  >
                    {!loading && <ArrowDownTrayIcon className=" w-4 h-4" />}
                  </div>
                )} */}
              </PDFDownloadLink>

              {/* ######################################################################### */}

              {/* ######################## Change Template Option  ######################## */}

              {!pathname?.includes("/invoice_designer/") && (
                <button
                  title="Change Template"
                  onClick={() => setShowChangeTemplate(true)}
                  className=" text-gray-700 hover:text-accent  print:hidden cursor-pointer border p-2 bg-white "
                >
                  <Cog6ToothIcon className=" w-4 h-4" />
                </button>
              )}

              {/* ######################################################################### */}

              {!pathname?.includes("/invoice_designer/") && (
                <ERPPopover popoverList={MoreOptions()} className="relative">
                  <button
                    title="More"
                    className=" text-gray-700 hover:text-accent  print:hidden cursor-pointer  rounded-b-lg border border-t-0 p-2 -mt-2 bg-white"
                  >
                    <EllipsisHorizontalIcon className=" w-4 h-4" />
                  </button>
                </ERPPopover>
              )}

              <ERPSideView
                title="Model"
                show={showChangeTemplate}
                onClose={() => setShowChangeTemplate(false)}
              >
                <ERPChangeTemplateSidebar
                  data={data}
                  templateId={templateGroupId}
                  onClose={() => setShowChangeTemplate(false)}
                  endpointUrl={endpointUrl}
                  associatedTempInfo={associatedTempInfo}
                />
              </ERPSideView>

              <ERPModal
                isForm={true}
                title={`Print`}
                content={printModal(voucherType)}
                className="!min-w-max"
                isOpen={showPrintModal}
                closeButton="Button"
                closeModal={() => {
                  setShowPrintModal(false);
                  // setSearchParams({});
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex gap-2 justify-center items-center bg-[#f9f9fb] overflow-auto p-7 print:p-0 h-full w-full">
          <MiniLoader />
          <MiniLoader />
          <MiniLoader />
        </div>
      )}
    </Fragment>
  );
};

export default InvoicePreview;
