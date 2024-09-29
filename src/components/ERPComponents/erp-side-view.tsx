import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

/**
 * @see https://tailwindui.com/components/application-ui/overlays/modals
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {JSX.Element} props.children
 */
interface ERPSideViewProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  transparent?: boolean;
}

/**
 *
 * @param show show or hide the model default is false
 * @param onClose callback function to close the model
 * @param title title of the model
 * @param children children of the model
 * @param transparent if true the model will be transparent
 * @returns {JSX.Element} model
 */
export default function ERPSideView({ show, onClose, children, transparent = false }: ERPSideViewProps) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 ${!transparent && "bg-black bg-opacity-25"}`} />
        </Transition.Child>

        <div className="fixed inset-0 scrollbar-hide">
          <div className="flex min-h-full justify-end scrollbar-hide">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-90 translate-x-1/2"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-90 translate-x-1/2"
            >
              <Dialog.Panel>{children}</Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
