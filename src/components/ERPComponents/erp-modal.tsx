import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import ERPButton from "../../components/ERPComponents/erp-button";
import ERPSubmitButton from "../../components/ERPComponents/erp-submit-button";

type ERPModalProps = {
  title: string;
  isOpen: boolean;
  closeModal: (reload: boolean) => void;
  content?: any;
  submitTitle?: string;
  onSubmit?: any;
  onSubmitModel?: () => void;
  hasSubmit?: boolean;
  isForm?: boolean;
  closeTitle?: string;
  className?: string;
  isFullHeight?: boolean;
  isRemoveSomething?: boolean;
  width?: string;
  closeOnSubmit?: boolean;
  closeButton?: "Button" | "LeftArrow" | "None";
  disableOutsideClickClose?: boolean;
};

const ERPModal = ({
  isOpen,
  closeModal,
  content,
  title,
  submitTitle,
  onSubmit,
  isForm = false,
  onSubmitModel,
  hasSubmit = true,
  closeButton = "LeftArrow",
  closeTitle = "Cancel",
  className,
  isFullHeight = false,
  isRemoveSomething = false,
  width = "w-full",
  closeOnSubmit = true,
  disableOutsideClickClose = true,
}: ERPModalProps) => {
  const handleClose = () => closeModal(false);
  const handleSubmit = () => {
    debugger;
    if (onSubmitModel) {
      onSubmitModel();
    }
    if (closeOnSubmit) {
      closeModal(true);
    }
  };

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`relative z-50`}
          onClose={disableOutsideClickClose ? () => {} : handleClose}
        >
          {/* ... (Transition.Child for background remains unchanged) */}

          <Transition
            as={Fragment}
            show={isOpen}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#71717a] bg-opacity-50" />
          </Transition>

          <div
            className={`fixed inset-0 ${
              isFullHeight ? "overflow-y-inherit" : "overflow-y-auto"
            }`}
          >
            <div
              className={`flex min-h-full items-center justify-center text-center${
                isFullHeight ? "" : "p-4 relative"
              }`}
            >
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className={`transform bg-white  py-3 text-left align-middle shadow-xl transition-all ${width} ${
                    isFullHeight ? "min-h-full h-screen" : "rounded-md"
                  } ${
                    isRemoveSomething ? "px-0" : "px-5"
                  }`}
                >
                  <DialogTitle
                    as="h3"
                    className="flex justify-start text-lg border-b py-3 font-medium leading-6 text-gray-900"
                  >
                    {closeButton !== undefined &&
                      closeButton === "LeftArrow" && (
                        <i
                          onClick={handleClose}
                          className="ri-arrow-left-line mr-2 rtl:mr-0 rtl:ml-2 rtl:ri-arrow-right-line"
                          style={{ fontSize: "23px" }}
                        ></i>
                      )}
                    {title}{" "}
                    {closeButton && closeButton === "Button" && (
                      <div className="max-w-[200px] inline-block">
                        <ERPButton
                          className="w-full"
                          type="button"
                          title={closeTitle}
                          onClick={handleClose}
                          tabIndex={-1}
                        />
                      </div>
                    )}
                  </DialogTitle>
                  {content}
                  {/* Footer */}
                  {!isForm && (
                    <div className="border-t py-2 flex gap-2 justify-end">
                      <div className="max-w-[200px]">
                        <ERPButton
                          className="w-full"
                          type="button"
                          title={closeTitle}
                          onClick={handleClose}
                          tabIndex={-1}
                        />
                      </div>

                      {hasSubmit && (
                        <ERPSubmitButton
                          onClick={handleSubmit}
                          className="uppercase"
                        >
                          {submitTitle || "Submit"}
                        </ERPSubmitButton>
                      )}
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ERPModal;
