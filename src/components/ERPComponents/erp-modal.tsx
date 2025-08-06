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
import { Rnd } from "react-rnd";
import { useDynamicModalSize } from "../../utilities/hooks/useDynamicModalSize";

type ModalPosition = "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

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
  initialMaximize?: boolean;
  closeTitle?: string;
  className?: string;
  isFullHeight?: boolean;
  isRemoveSomething?: boolean;
  width?: number | "auto" | "fit-content";
  height?: number | "auto" | "fit-content";
  minHeight?: number;
  minWidth?: number;
  autoSize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  closeOnSubmit?: boolean;
  closeButton?: "Button" | "LeftArrow" | "None";
  disableOutsideClickClose?: boolean;
  disableParentInteraction?: boolean;
  customPosition?: boolean;
  customStyle?: React.CSSProperties;
  initialPosition?: ModalPosition; 
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
    initialMaximize = false,
    onSubmitModel,
    hasSubmit = true,
    closeButton = "LeftArrow",
    closeTitle = "Cancel",
    className,
    isFullHeight = false,
    isRemoveSomething = false,
    width = 600,
    height = 600,
    minHeight = 200,
    minWidth = 200,
    autoSize = false,
    maxWidth,
    maxHeight,
    closeOnSubmit = true,
    disableOutsideClickClose = true,
    disableParentInteraction = true,
    customPosition = false,
    customStyle = {},
    initialPosition = "center", 
  }: ERPModalProps) => {
    const [isMaximized, setIsMaximized] = useState(initialMaximize);
    const [modalHeight, setModalHeight] = useState(0);
    const [modalWidth, setModalWidth] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [initPosition, setInitPosition] = useState({ x: 0, y: 0 });
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    const calculateInitialPosition = (windowWidth: number, windowHeight: number, modalW: number, modalH: number) => {
      const padding = 20; // Padding from edges
      let x = 0, y = 0;

      switch (initialPosition) {
        case "center":
          x = (windowWidth - modalW) / 2;
          y = (windowHeight - modalH) / 2;
          break;
        case "left":
          x = padding;
          y = (windowHeight - modalH) / 2;
          break;
        case "right":
          x = windowWidth - modalW - padding;
          y = (windowHeight - modalH) / 2;
          break;
        case "top":
          x = (windowWidth - modalW) / 2;
          y = padding;
          break;
        case "bottom":
          x = (windowWidth - modalW) / 2;
          y = windowHeight - modalH - padding;
          break;
        case "top-left":
          x = padding;
          y = padding;
          break;
        case "top-right":
          x = windowWidth - modalW - padding;
          y = padding;
          break;
        case "bottom-left":
          x = padding;
          y = windowHeight - modalH - padding;
          break;
        case "bottom-right":
          x = windowWidth - modalW - padding;
          y = windowHeight - modalH - padding;
          break;
        default:
          x = (windowWidth - modalW) / 2;
          y = (windowHeight - modalH) / 2;
      }

      // Ensure the modal stays within bounds
      x = Math.max(0, Math.min(x, windowWidth - modalW));
      y = Math.max(0, Math.min(y, windowHeight - modalH));

      return { x, y };
    };

  const calculateDimensionsAndPosition = () => {
    if (!isOpen) return;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let newWidth, newHeight, newX, newY;

    if (isMaximized) {
      newWidth = windowWidth - 50;
      newHeight = windowHeight - 50;
      newX = (windowWidth - newWidth) / 2;
      newY = (windowHeight - newHeight) / 2;

      const originalWidth = typeof width === 'number' ? Math.min(windowWidth - 40, width) : windowWidth - 40;
      const originalHeight = typeof height === 'number' ? Math.min(windowHeight - 40, height) : windowHeight - 40;
      const originalPos = calculateInitialPosition(windowWidth, windowHeight, originalWidth, originalHeight);
      setInitPosition(originalPos);
    } else {
       newWidth = typeof width === 'number' ? Math.min(windowWidth - 40, width) : windowWidth - 40;
        newHeight = typeof height === 'number' ? Math.min(windowHeight - 40, height) : windowHeight - 40;
    
      const calculatedPos = calculateInitialPosition(windowWidth, windowHeight, newWidth, newHeight);
      newX = calculatedPos.x;
      newY = calculatedPos.y;
    }

    setModalWidth(newWidth);
    setModalHeight(newHeight);
    setPosition({ x: newX, y: newY });
    setIsPositionCalculated(true);
  };




const { contentRef, dimensions, measureContent } = useDynamicModalSize(width as number, height as number); // Reduced min height


 useEffect(() => {
    if (isOpen) {
      // Multiple measurements to catch dynamic content
      // setTimeout(measureContent, 100);
      // setTimeout(measureContent, 300);
      setTimeout(measureContent, 600);
    }
  }, [isOpen]);
    // Reset state when modal closes
    useEffect(() => {
      if (!isOpen) {
        setIsMaximized(initialMaximize);
        setPosition({ x: 0, y: 0 });
        setInitPosition({ x: 0, y: 0 });
        // setModalWidth(typeof width === 'number' ? width : 600);
        // setModalHeight(typeof height === 'number' ? height : 600);
        setIsPositionCalculated(false);
      }
    }, [isOpen]);

    useEffect(() => {
      if (isOpen) {
        calculateDimensionsAndPosition();
      }
    }, [isOpen, isMaximized, dimensions.width, dimensions.height, initialPosition]);

    const handleClose = () => {
      closeModal(false);
    };
    
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
      <div ref={contentRef} 
            className="modal-content-wrapper"
            style={{ 
              minHeight: 'fit-content',
              width: '100%',
              overflow: 'visible' 
            }}>
             
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            static={!disableParentInteraction}
            as="div"
            className={` erp-modal  fixed inset-0 ${
              !disableParentInteraction ? "pointer-events-none" : ""
            }`}
            onClose={disableOutsideClickClose ? () => {} : handleClose}
            style={customPosition ? customStyle : {}}
          >
            {disableParentInteraction && (
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30 " />
              </TransitionChild>
            )}

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
                      position={position}
                      size={{
                        width: modalWidth,
                        height: modalHeight,
                      }}
                      onDragStart={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.classList.contains('dx-scrollbar') || 
                            target.closest('.dx-scrollable-scrollbar')) {
                          return;
                        }
                        e.stopPropagation();
                      }}
                      onDrag={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.classList.contains('dx-scrollbar') || 
                            target.closest('.dx-scrollable-scrollbar')) {
                          return;
                        }
                        e.stopPropagation();
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                      }}
                      onResizeStart={(e) => {
                        e.stopPropagation();
                      }}
                      onDragStop={(_, d) => {
                        if (!isMaximized) {
                          setPosition({ x: d.x, y: d.y });
                        }
                      }}
                      onResizeStop={(_, __, ref, ___, pos) => {
                        setModalHeight(ref.offsetHeight);
                        setModalWidth(ref.offsetWidth);
                        setPosition(pos);
                      }}
                      onResize={(_, __, ref, ___, pos) => {
                        setPosition({ x: pos.x, y: pos.y });
                        setModalHeight(ref.offsetHeight);
                        setModalWidth(ref.offsetWidth);
                      }}
                      disableDragging={isMaximized}
                      enableResizing={!isMaximized}
                      bounds="parent"
                      minWidth={minWidth}
                      minHeight={minHeight}
                      dragGrid={[10, 10]}
                      resizeGrid={[10, 10]}
                      dragHandleClassName="drag-handle"
                      className="pointer-events-auto bg-white shadow-sm rounded-md border dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                    >
                      <DialogPanel
                        className={`erp-modal w-full h-full flex flex-col overflow-hidden`}
                      >
                        <DialogTitle
                          as="h3"
                          className={` ${
                            isMaximized ? "cursor-pointer" : "cursor-move"
                          }  place-items-center px-4 rounded-t-md bg-[#f6f6f6] h-[40px]  top-0 z-10 flex justify-between text-[16px] dark:border-dark-border border-b py-3 font-medium leading-6 dark:bg-dark-bg dark:text-dark-text text-gray-900`}
                          style={{ flex: "0 0 auto" }}
                        >
                          <div className=" drag-handle flex items-center dark:text-dark-text flex-1">
                            {title}  {modalHeight}wewewe
              {modalWidth}
                          </div>
                          {closeButton === "Button" && (
                            <div className="max-w-[200px] inline-block ">
                              <ERPButton
                                className="w-full"
                                type="button"
                                title={closeTitle}
                                onTouchEnd={(e) => {
                                  e.stopPropagation();
                                  handleClose();
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClose();
                                }}
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
                                    setPosition(initPosition);
                                  }
                                  setIsMaximized(!isMaximized);
                                }}
                                onTouchEnd={() => {
                                  if (isMaximized) {
                                    setPosition(initPosition);
                                  }
                                  setIsMaximized(!isMaximized);
                                }}
                                aria-label={
                                  isMaximized ? "Restore" : "Maximize"
                                }
                              >
                                {isMaximized ? (
                                  <Minimize2 size={15} />
                                ) : (
                                  <Maximize2 size={15} />
                                )}
                              </button>
                            )}
                            <button
                              className="p-2 dark:hover:!text-dark-hover-text hover:bg-[#ff7373] rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                              }}
                              onTouchEnd={(e) => {
                                e.stopPropagation();
                                handleClose();
                              }}
                              aria-label="Close"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </DialogTitle>

                        <div  className={`bg-inherit flex flex-col justify-between flex-grow  w-full`}>
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
                                        modalHeight: modalHeight,
                                        rowData: rowData,
                                        origin: origin,
                                        postData:
                                          mergeObjectsRemovingIdenticalKeys(
                                            content.postData,
                                            postData
                                          ),
                                      }
                                    : {
                                        contentProps: contentProps
                                          ? contentProps
                                          : {},
                                        isMaximized: isMaximized,
                                        modalHeight: modalHeight,
                                        rowData: rowData,
                                        origin: origin,
                                        postData:
                                          mergeObjectsRemovingIdenticalKeys(
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
                    </Rnd>
                  )}
                </div>
              </TransitionChild>
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
      prevProps.footer === nextProps.footer &&
      prevProps.initialPosition === nextProps.initialPosition
    );
  }
);

export default ERPModal;