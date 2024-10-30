import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import ERPInput from "./erp-input";
import { LockClosedIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { capitalizeAndAddSpace, moveArrayElement } from "../../utilities/Utils";
import ERPSubmitButton from "./erp-submit-button";
import ERPModal from "./erp-modal";
import { ColumnPreference, DevGridColumn, GridPreference, initialGridPreference } from "../types/dev-grid-column";
import { getInitialPreference } from "../../utilities/dx-grid-preference-updater";
interface GridGlobalFilterProps {
  gridId: string;
  content: any;
}

const GridGlobalFilter: FC<GridGlobalFilterProps> = ({
  gridId,
  content,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
  }, []);

  useEffect(() => {
  }, []);

  const handleApply = () => {}

  return (
    <Fragment>
      <button onClick={() => setIsOpen(true)} className='ti-btn rounded-[2px] '>
        <i className="ri-apps-line"></i>
      </button>
      <ERPModal
        isForm
        isFullHeight={true}
        isOpen={isOpen}
        hasSubmit={false}
        closeTitle="Close"
        title={"Filter"}
        width="!w-[80rem] !max-w-[60rem]"
        closeModal={() => setIsOpen(false)}
        content={(
        {content}
        )}
        footer={(
          <div className="flex gap-10 justify-between py-3 border-t mt-5">
          <ERPSubmitButton type="button" 
          variant="primary"
          onClick={handleApply}>
            Apply
          </ERPSubmitButton>
          <ERPSubmitButton type="reset" onClick={() => setIsOpen(false)} className=" w-28 bg-[#e5e7eb] text-[#404040]" >
            Cancel
          </ERPSubmitButton>
        </div>
        )}
      />


    </Fragment>
  );
};

export default React.memo(GridGlobalFilter);