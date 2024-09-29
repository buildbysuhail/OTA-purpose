import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type PSModelProps = {
  isOpen: boolean;
  closeModal?: () => void;
  content?: any;
  submitTitle?: string;
  onSubmit?: any;
  onSubmitModel?: () => void;
  children?: React.ReactNode;
  overflow?: "overflow-hidden" | "overflow-visible";
  endpointUrl?: string;
};

const PSModel = ({ isOpen, closeModal, content, submitTitle, onSubmit, onSubmitModel, children, overflow, endpointUrl }: PSModelProps) => {
  const modalWidth = endpointUrl == "/peoples/vendors/" || endpointUrl == "/peoples/customers/" ? "max-w-5xl" : "max-w-fit";
  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal && closeModal()}>
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
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full ${modalWidth} transform ${overflow} rounded-md bg-white text-left align-middle shadow-xl transition-all`}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default PSModel;
