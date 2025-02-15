import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { cloneElement, Fragment, useEffect, useState } from "react";
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
  initailMaximize?: boolean;
  closeTitle?: string;
  className?: string;
  isFullHeight?: boolean;
  isRemoveSomething?: boolean;
  width?: string;
  minHeight?: number;
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
    initailMaximize = false,
    onSubmitModel,
    hasSubmit = true,
    closeButton = "LeftArrow",
    closeTitle = "Cancel",
    className,
    isFullHeight = false,
    isRemoveSomething = false,
    width = "w-full",
    minHeight = 300,
    closeOnSubmit = true,
    disableOutsideClickClose = true,
    customPosition = false,
    customStyle = {},
  }: ERPModalProps) => {
    const [isMaximized, setIsMaximized] = useState(initailMaximize);
    const [modalHeight, setModalHeight] = useState(0);
    // const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const [modalPosition, setModalPosition] = useState(() => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
    
      const modalWidth = 500; // Replace with the desired width of the modal
      const modalHeight = 300; // Replace with the desired height of the modal
    
      const centerX = (windowWidth - modalWidth) / 2;
      const centerY = (windowHeight - modalHeight) / 2;
    
      return { x: centerX, y: centerY };
    });

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      const initialX = e.clientX - modalPosition.x;
      const initialY = e.clientY - modalPosition.y;

      const mouseMoveHandler = (e: MouseEvent) => {
        setModalPosition({ x: e.clientX - initialX, y: e.clientY - initialY });
      };

      const mouseUpHandler = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    useEffect(() => {
      const updateModalHeight = () => {
        const headerHeight = 60;
        const footerHeight = !isForm && isButton ? 70 : 0;
        const padding = 40;

        const height = isMaximized
          ? window.innerHeight - 50
          : window.innerHeight < minHeight
          ? window.innerHeight
          : window.innerHeight - 200 < minHeight
          ? minHeight
          : window.innerHeight - 200;

        setModalHeight(height);
      };

      updateModalHeight();
      window.addEventListener("resize", updateModalHeight);

      return () => {
        window.removeEventListener("resize", updateModalHeight);
      };
    }, [isMaximized, isForm, isButton, minHeight]);

    const handleClose = () => closeModal(false);
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
      <div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className={`relative erp-modal ${
              customPosition ? "" : "fixed inset-0"
            }`}
            onClose={disableOutsideClickClose ? () => {} : handleClose}
            style={customPosition ? customStyle : {}}
          >
            {!customPosition && (
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
            )}

            <div className={`${customPosition ? "" : "fixed inset-0"}`}>
              <div
                className={`flex min-h-full items-center justify-center text-center ${
                  customPosition ? "" : "p-4"
                }`}
              >
                <TransitionChild
                  as="div"
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div
                    style={{
                      position: "absolute",
                      top: modalPosition.y,
                      left: modalPosition.x,
                      // cursor: isDragging ? "grabbing" : "grab",
                      width: isMaximized ? "97vw" : "auto", // Set width directly here
                    }}
                    // onMouseDown={handleMouseDown}
                  >
                    <DialogPanel
                      className={`erp-modal${
                        isOpen ? "-opened" : "closed"
                      } transform dark:bg-dark-bg bg-white text-left align-middle shadow-xl transition-all ${
                        isMaximized ? "w-full rounded-md" : `${width} rounded-md`
                      } ${isRemoveSomething ? "px-0" : "px-0"}`}
                      style={{
                        height: isMaximized ? `${modalHeight}px` : "auto",
                        maxHeight: `${modalHeight}px`,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <DialogTitle
                        as="h3"
                        className="place-items-center px-4 bg-[#f6f6f6] h-[40px] rounded-t-md sticky min-w-full top-0 z-10 flex justify-between text-[16px] dark:border-dark-border border-b py-3 font-medium leading-6 dark:bg-dark-bg dark:text-dark-text text-gray-900 "
                        style={{ flex: "0 0 auto", userSelect: "none", cursor: isDragging ? "grabbing" : "grab", }} // Prevent header from shrinking
                        onMouseDown={handleMouseDown}
                      >
                        <div className="flex  items-center dark:text-dark-text">
                          {title}
                        </div>
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
                        <div className="flex items-center space-x-2">
                          {isMaximize ? (
                            <button
                              className="p-2 dark:hover:!text-dark-hover-text hover:bg-[#e6e6e6] rounded-full"
                              onClick={() => setIsMaximized(!isMaximized)}
                              aria-label={isMaximized ? "Restore" : "Maximize"}
                            >
                              {isMaximized ? (
                                <Minimize2 size={15} />
                              ) : (
                                <Maximize2 size={15} />
                              )}
                            </button>
                          ) : null}
                          <button
                            className="p-2 dark:hover:!text-dark-hover-text hover:bg-[#ff7373] rounded-full"
                            onClick={handleClose}
                            aria-label="Close"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </DialogTitle>

                      <div className={`flex flex-col justify-between flex-grow ${isRemoveSomething ? "px-0" : "px-4"} `}>
                        <ERPScrollArea
                          maxHeight={`${modalHeight - (footer ? 130 : 80)}px`}
                          className="overflow-y-auto pr-2 overflow-x-hidden py-4 h-auto "
                        >
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
                        </ERPScrollArea>

                        {footer && <div className="">{footer}</div>}
                      </div>

                      {!isForm && isButton && (
                        <div
                          className="border-t py-2 flex gap-2 justify-end"
                          style={{ flex: "0 0 auto" }}
                        >
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
                  </div>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
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
