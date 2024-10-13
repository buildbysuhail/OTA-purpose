import { useSearchParams } from "react-router-dom";
import { Dispatch, SetStateAction, useRef } from "react";

import { FooterState } from "./interfaces";
import { isFile } from "../../../utilities/Utils";
import { TemplateImagesTypes } from "../InvoiceDesigner";
import ERPCheckbox from "../../../components/ERPComponents/erp-checkbox";
import ERPInput from "../../../components/ERPComponents/erp-input";
import ERPStepInput from "../../../components/ERPComponents/erp-step-input";
import ERPToast from "../../../components/ERPComponents/erp-toast";

interface LabelDesignerProps {
  onChange: (state: FooterState) => void;
  footerState?: FooterState;
  tempImages: {
    setTemplateImages: Dispatch<SetStateAction<TemplateImagesTypes>>,
    templateImages: TemplateImagesTypes,
  }
}

const LabelDesigner = ({ onChange, footerState, tempImages }: LabelDesignerProps) => {
  const [searchParams] = useSearchParams();
  const inputSignatureFile = useRef<any>(null);
  const templateGroup = searchParams?.get("template_group");
  const { templateImages, setTemplateImages } = tempImages

  const signatureImage = templateImages?.signature_image;
  let signatureThumbnail = signatureImage && isFile(signatureImage) && signatureImage?.size < 1e6 ? URL.createObjectURL(signatureImage) : null

  return (
    <div className="flex h-full overflow-auto flex-col gap-5 p-4">
      safvan
    </div>
  );
};

export default LabelDesigner;
