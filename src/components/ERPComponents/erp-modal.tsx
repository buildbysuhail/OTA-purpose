import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { cloneElement, Fragment, useEffect, useRef, useState } from "react";
import ERPButton from "../../components/ERPComponents/erp-button";
import ERPSubmitButton from "../../components/ERPComponents/erp-submit-button";
import {
  ShortKeyEvents,
  addPopupToStack,
  removePopupFromStack,
} from "../../utilities/shortKeys";
import { ERPScrollArea } from "./erp-scrollbar";
import { Minimize2, Maximize2, X } from "lucide-react";
import { mergeObjectsRemovingIdenticalKeys } from "../../utilities/Utils";
import { Rnd } from "react-rnd";
import { Move, ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";
type ERPModalProps = {
  title: string;
  isOpen: boolean;
  closeModal: (reload: boolean) => void;
  content?: any;
  rowData?: any;
  isTransactionScreen?: boolean;
  postData?: any;
  contentProps?: any;
  origin?: string;
  footer?: any;
  submitTitle?: string;
  onSubmit?: any;
  onSubmitModel?: () => void;
  hasSubmit?: boolean;
  isForm?: boolean;
  isButton?: boolean;
  isMaximize?: boolean;
  initialMaximize?:boolean;
  closeTitle?: string;
  className?: string;
  isFullHeight?: boolean;
  isRemoveSomething?: boolean;
  width?: number;
  height?:number;
  minHeight?: number;
  minWidth?:number;
  closeOnSubmit?: boolean;
  closeButton?: "Button" | "LeftArrow" | "None";
  disableOutsideClickClose?: boolean;
  customPosition?: boolean;
  customStyle?: React.CSSProperties;
};

const ERPModal = React.memo(
  ({
    isOpen,
    closeModal,
    content,
    rowData,
    postData,
    isTransactionScreen,
    contentProps,
    footer,
    origin,
    title,
    submitTitle,
    onSubmit,
    isForm = false,
    isButton = false,
    isMaximize = true,
    initialMaximize=false,
    onSubmitModel,
    hasSubmit = true,
    closeButton = "LeftArrow",
    closeTitle = "Cancel",
    className,
    isFullHeight = false,
    isRemoveSomething = false,
    width = 600,
    height=600,
    minHeight = 300,
    minWidth=300,

    closeOnSubmit = true,
    disableOutsideClickClose = true,
    customPosition = false,
    customStyle = {},
  }: ERPModalProps) => {
    const [isMaximized, setIsMaximized] = useState(initialMaximize);
    const [modalHeight, setModalHeight] = useState(0);
    const [modalWidth, setModalWidth] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
    const [rndKey, setRndKey] = useState(0);
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    useEffect(() => {
      if (isOpen) {
        const handlePositionUpdate = () => {
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          if (isMaximized) {
            // Set position to top-left for maximized view
            const centeredX = (windowWidth - width) / 2;
            const centeredY = (windowHeight - height) / 2;
            setPreviousPosition({ x: centeredX, y: centeredY });
            setPosition({ x: 20, y: 20 });
          } else {
            if (width && height) {
              let newX = (windowWidth - width) / 2;
              let newY = (windowHeight - height) / 2;

              newY = Math.max(newY, 0);
              newX = Math.max(newX, 0);

              if (windowHeight < height) {
                newY = 10;
                newX = (windowWidth - width) / 2;
              }

              setPosition({ x: newX, y: newY });
            }
          }
          setIsPositionCalculated(true);
        };

        handlePositionUpdate();
        setRndKey((prev) => prev + 1);
      }
    }, [isOpen, width, height, isMaximized]);

    useEffect(() => {
      const updateModalDimensions = () => {
        const newHeight = isMaximized
          ? window.innerHeight - 50
          : Math.min(window.innerHeight - 25, height);
        const newWidth = isMaximized ? window.innerWidth - 40 : width;
        setModalHeight(newHeight);
        setModalWidth(newWidth);
        setRndKey((prev) => prev + 1);
      };
      updateModalDimensions();
      window.addEventListener("resize", updateModalDimensions);
      return () => window.removeEventListener("resize", updateModalDimensions);
    }, [isMaximized, height, width]);

    const handleClose = () => {
      closeModal(false);
      setIsMaximized(false)
    }
    const handleSubmit = () => {
      if (onSubmitModel) {
        onSubmitModel();
      }
      if (closeOnSubmit) {
        closeModal(true);
      }
    };

    const handlePopupClose = () => {
      if (isOpen) {
        handleClose();
      }
    };

    useEffect(() => {
      const closeOnePopupListener = () => {
        if (isOpen) {
          handleClose();
        }
      };
      if (isOpen) {
        document.addEventListener(
          ShortKeyEvents.POPUP_CLOSE_EVENT,
          handlePopupClose
        );
        document.addEventListener(
          ShortKeyEvents.CLOSE_ONE_POPUP,
          closeOnePopupListener
        );
        addPopupToStack(handleClose);
      }

      return () => {
        removePopupFromStack(handleClose);
        document.removeEventListener(
          ShortKeyEvents.POPUP_CLOSE_EVENT,
          handlePopupClose
        );
        document.removeEventListener(
          ShortKeyEvents.CLOSE_ONE_POPUP,
          closeOnePopupListener
        );
      };
    }, [isOpen]);

    return (
      
      <Transition appear show={isOpen} as={Fragment} >
       <Dialog
       
            as="div"
            className={` erp-modal  fixed inset-0`}
            onClose={disableOutsideClickClose ? () => {} : handleClose}
            style={customPosition ? customStyle : {}}
          >
          <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>   
        
            <div className={`fixed inset-0`}>
            <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
             <div className="h-full w-full">
             {isPositionCalculated && (
  <Rnd
  key={rndKey}
  default={{x: position.x, y: position.y , width: modalWidth, height: modalHeight}}

       onResize={(_, __, ref, ___, pos) => {
         setPosition({ x: pos.x, y: pos.y });
         setModalHeight(ref.offsetHeight);
         setModalWidth(ref.offsetWidth);
       }}
       
      bounds="parent"
      // bounds="window"
      minWidth={minWidth}
      minHeight={minHeight}
      dragGrid={[10, 10]}
      resizeGrid={[10, 10]}
  dragHandleClassName="drag-handle" // Specify the drag handle class name
       className="bg-white shadow-sm rounded-md border dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
    >
      <DialogPanel
        className={`erp-modal w-full h-full flex flex-col overflow-hidden pb-10`}
   
      >
        <DialogTitle
          as="h3"
          className="drag-handle cursor-move place-items-center px-4 rounded-t-md bg-[#f6f6f6] h-[40px]  top-0 z-10 flex justify-between text-[16px] dark:border-dark-border border-b py-3 font-medium leading-6 dark:bg-dark-bg dark:text-dark-text text-gray-900"
          style={{ flex: "0 0 auto" }}
        >
          <div className="flex items-center dark:text-dark-text">{title}</div>
          {closeButton === "Button" && (
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
          <div className="flex items-center space-x-2 ">
            {isMaximize && (
              <button
                className="p-2 dark:hover:!text-dark-hover-text hover:bg-[#e6e6e6] rounded-full"
                onClick={() => {
                  if (isMaximized) {
                    // Restore to previous position
                    setPosition(previousPosition);
                  } 
                  setIsMaximized(!isMaximized);
                }}
                aria-label={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            )}
            <button
              className="p-2 dark:hover:!text-dark-hover-text hover:bg-[#ff7373] rounded-full"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>
        </DialogTitle>

        <div className={`bg-inherit flex flex-col justify-between flex-grow  h-full w-full`}>
        
          <ERPScrollArea
            maxHeight={`${modalHeight - (footer ? 90 : 0)}px`}
            className="overflow-y-auto overflow-x-hidden"
          >
            <div className={`px-4 pt-4`}>
            {content &&
                          cloneElement(
                            content,
                            isTransactionScreen
                              ? {
                                  ...contentProps,
                                  isMaximized: isMaximized,
                                  modalHeight: modalHeight, // Pass isMaximized to the content
                                  rowData: rowData,
                                  origin: origin,
                                  postData: mergeObjectsRemovingIdenticalKeys(
                                    content.postData,
                                    postData
                                  ),
                                }
                              : {
                                  contentProps: contentProps
                                    ? contentProps
                                    : {},
                                  isMaximized: isMaximized,
                                  modalHeight: modalHeight, // Pass isMaximized to the content
                                  rowData: rowData,
                                  origin: origin,
                                  postData: mergeObjectsRemovingIdenticalKeys(
                                    content.postData,
                                    postData
                                  ),
                                }
                          )}
            </div>
       
          </ERPScrollArea>
         
          </div>
          
          {footer && <div>{footer}</div>}

        {!isForm && isButton && (
          <div className="border-t py-2 flex gap-2 justify-end" style={{ flex: "0 0 auto" }}>
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
              <ERPSubmitButton onClick={handleSubmit} className="uppercase">
                {submitTitle || "Submit"}
              </ERPSubmitButton>
            )}
          </div>
        )}
      </DialogPanel>
    </Rnd>
)}
             </div>

       </TransitionChild>           
              </div>
          
          </Dialog>
      
          </Transition>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.title === nextProps.title &&
      prevProps.content === nextProps.content &&
      prevProps.closeTitle === nextProps.closeTitle &&
      prevProps.hasSubmit === nextProps.hasSubmit &&
      prevProps.submitTitle === nextProps.submitTitle &&
      prevProps.contentProps === nextProps.contentProps &&
      prevProps.footer === nextProps.footer
    );
  }
);
export default ERPModal;
  
    