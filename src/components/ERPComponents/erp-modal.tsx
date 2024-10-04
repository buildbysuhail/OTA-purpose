import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import ERPButton from "../../components/ERPComponents/erp-button";
import ERPSubmitButton from "../../components/ERPComponents/erp-submit-button";

type ERPModalProps = {
  title: string;
  isOpen: boolean;
  closeModal: () => void;
  content?: any;
  submitTitle?: string;
  onSubmit?: any;
  onSubmitModel?: () => void;
  hasSubmit?: boolean;
  isForm?: boolean;
  closeTitle?: string;
  className?: string;
  isFullHeight?: boolean;
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
  closeButton = "None",
  closeTitle = "Cancel",
  className,
  isFullHeight = false,
  width = "w-full",
  closeOnSubmit = true,
  disableOutsideClickClose = true, // Default to true
}: ERPModalProps) => {
  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className={`relative z-50 `} onClose={disableOutsideClickClose ? () => {} : closeModal} // Disable outside click close
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className={`fixed inset-0 ${isFullHeight ? 'overflow-y-inherit ' : ' overflow-y-auto'}`}>
          <div className={`flex min-h-full items-center justify-center text-center${isFullHeight ? '' : 'p-4 relative'}`}>
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
                  className={`transform bg-white px-5 py-3 text-left align-middle shadow-xl transition-all ${width} ${isFullHeight ? 'min-h-full h-screen' : 'rounded-md'}`}
                >
                  <DialogTitle as="h3" className="flex justify-start text-lg border-b py-3 font-medium leading-6 text-gray-900 ">
                  {/* flex justify-between  */}
                  { closeButton && closeButton == "LeftArrow" && <i onClick={closeModal} className="ri-arrow-left-line mr-2" style={{ fontSize: '23px' }}></i>} {title}{" "}
                    {closeButton && closeButton == "Button" && (
                      <div className=" max-w-[200px] inline-block">
                        <ERPButton className="w-full" type="button" title={closeTitle} onClick={closeModal} tabIndex={-1} />
                      </div>
                    )}
                  </DialogTitle>
                  {content}
                  {/* Footer */}
                  {isForm ? (
                    <></>
                  ) : (
                    <div className=" border-t py-2 flex gap-2 justify-end">
                      <div className=" max-w-[200px]">
                        <ERPButton className="w-full" type="button" title={closeTitle} onClick={closeModal} tabIndex={-1} />
                      </div>

                      {hasSubmit && (
                        <ERPSubmitButton
                          // loading={loading}
                          onClick={() => {
                            closeOnSubmit && closeModal && closeModal();
                            onSubmitModel && onSubmitModel();
                          }}
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
