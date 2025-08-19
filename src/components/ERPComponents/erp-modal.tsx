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
  enableDynamicSize?: boolean;
  dynamicMinWidth?: number;
  dynamicMinHeight?: number;
  dynamicPadding?: number;
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
    height = 150,
    minHeight = 150,
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
    enableDynamicSize = true,
    dynamicMinWidth = 400,
    dynamicMinHeight = 150,
    dynamicPadding = 40,
  }: ERPModalProps) => {
    // Detect mobile device
    const isMobile = window.innerWidth <= 768;

    // Use content-fitted size on mobile, with a max width
    const effectiveDynamicMinWidth = isMobile ? 300 : dynamicMinWidth; // Minimum 300px, adjustable
    const effectiveDynamicMinHeight = isMobile ? 200 : dynamicMinHeight;
    const effectiveDynamicPadding = isMobile ? 10 : dynamicPadding;

    // Initialize with content-based dimensions, capped at a reasonable max
    const initialWidth = isMobile ? 500 : (enableDynamicSize && typeof width === 'number' ? width : effectiveDynamicMinWidth);
    const initialHeight = enableDynamicSize && typeof height === 'number' ? height : effectiveDynamicMinHeight;

    const { contentRef, dimensions, measureContent, resetDimensions } = useDynamicModalSize(
      effectiveDynamicMinWidth,
      effectiveDynamicMinHeight,
      effectiveDynamicPadding,
      initialWidth,
      initialHeight,
      isForm
    );

    const [isMaximized, setIsMaximized] = useState(initialMaximize);
    const [modalHeight, setModalHeight] = useState(0);
    const [modalWidth, setModalWidth] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [initPosition, setInitPosition] = useState({ x: 0, y: 0 });
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Dynamic sizing effects
    useEffect(() => {
      if (enableDynamicSize && isOpen) {
        setIsLoading(true);
        setTimeout(measureContent, 100);
        setTimeout(() => setIsLoading(false), 300);
      }
    }, [isOpen, measureContent, enableDynamicSize]);

    useEffect(() => {
      if (enableDynamicSize && isOpen) {
        setTimeout(measureContent, 100);
        setTimeout(() => setIsLoading(false), 300);
      }
    }, [contentProps, measureContent, enableDynamicSize]);

    const calculateInitialPosition = (windowWidth: number, windowHeight: number, modalW: number, modalH: number) => {
      const padding = isMobile ? 10 : 20;
      let x = (windowWidth - modalW) / 2;
      let y = (windowHeight - modalH) / 2;

      x = Math.max(padding, Math.min(x, windowWidth - modalW - padding));
      y = Math.max(padding, Math.min(y, windowHeight - modalH - padding));

      return { x, y };
    };

    const calculateDimensionsAndPosition = () => {
      if (!isOpen) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      let newWidth, newHeight, newX, newY;

      if (isMaximized) {
        newWidth = isMobile ? windowWidth * 0.9 : windowWidth - 50;
        newHeight = isMobile ? windowHeight * 0.9 : windowHeight - 50;
        newX = (windowWidth - newWidth) / 2;
        newY = (windowHeight - newHeight) / 2;

        let originalWidth, originalHeight;
        if (enableDynamicSize) {
          originalWidth = dimensions.width;
          originalHeight = dimensions.height;
        } else {
          originalWidth = typeof width === 'number' ? Math.min(windowWidth - 40, width) : windowWidth - 40;
          originalHeight = typeof height === 'number' ? Math.min(windowHeight - 40, height) : windowHeight - 40;
        }
        const originalPos = calculateInitialPosition(windowWidth, windowHeight, originalWidth, originalHeight);
        setInitPosition(originalPos);
      } else {
        if (enableDynamicSize) {
          newWidth = Math.min(dimensions.width, isMobile ? 500 : windowWidth - 40);
          newHeight = Math.min(dimensions.height, isMobile ? 600 : windowHeight - 40);
        } else if (autoSize || width === "auto" || height === "auto") {
          const contentEl = document.querySelector('.modal-content-wrapper');
          if (contentEl) {
            const contentRect = contentEl.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(contentEl);
            const marginTop = parseInt(computedStyle.marginTop) || 0;
            const marginBottom = parseInt(computedStyle.marginBottom) || 0;
            const marginLeft = parseInt(computedStyle.marginLeft) || 0;
            const marginRight = parseInt(computedStyle.marginRight) || 0;

            newWidth = Math.min(
              Math.max(contentRect.width + marginLeft + marginRight + 40, minWidth),
              maxWidth || (isMobile ? 500 : Math.min(windowWidth - 60, 1200)),
              windowWidth - 60
            );

            newHeight = Math.min(
              Math.max(contentRect.height + marginTop + marginBottom + 120, minHeight),
              maxHeight || (isMobile ? 600 : Math.min(windowHeight - 60, 800)),
              windowHeight - 60
            );
          } else {
            newWidth = Math.min(maxWidth || (isMobile ? 500 : 800), windowWidth - 60);
            newHeight = Math.min(maxHeight || (isMobile ? 600 : 600), windowHeight - 60);
          }
        } else {
          newWidth = typeof width === 'number' ? Math.min(windowWidth - 40, width) : windowWidth - 40;
          newHeight = typeof height === 'number' ? Math.min(windowHeight - 40, height) : windowHeight - 40;
        }

        const calculatedPos = calculateInitialPosition(windowWidth, windowHeight, newWidth, newHeight);
        newX = calculatedPos.x;
        newY = calculatedPos.y;
      }

      setModalWidth(newWidth);
      setModalHeight(newHeight);
      setPosition({ x: newX, y: newY });
      setIsPositionCalculated(true);
    };

    useEffect(() => {
      if (!isOpen) {
        setIsMaximized(initialMaximize);
        setPosition({ x: 0, y: 0 });
        setInitPosition({ x: 0, y: 0 });
        setIsPositionCalculated(false);
        const initW = isMobile ? 500 : (enableDynamicSize && typeof width === 'number' ? width : effectiveDynamicMinWidth);
        const initH = isMobile ? 200 : (enableDynamicSize && typeof height === 'number' ? height : effectiveDynamicMinHeight);
        setModalWidth(initW);
        setModalHeight(initH);
        if (enableDynamicSize) {
          resetDimensions();
        }
      }
    }, [isOpen, initialMaximize, enableDynamicSize, width, height, effectiveDynamicMinWidth, effectiveDynamicMinHeight, resetDimensions]);

    useEffect(() => {
      if (isOpen) {
        calculateDimensionsAndPosition();
      }
    }, [isOpen, isMaximized, width, height, initialPosition, dimensions, enableDynamicSize]);

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

    const effectiveMinWidth = enableDynamicSize ? effectiveDynamicMinWidth : minWidth;
    const effectiveMinHeight = enableDynamicSize ? effectiveDynamicMinHeight : minHeight;

    return (
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            static={!disableParentInteraction}
            as="div"
            className={`erp-modal fixed inset-0 ${!disableParentInteraction ? "pointer-events-none" : ""}`}
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
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </TransitionChild>
            )}

            {isPositionCalculated && (
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                  className="flex min-h-full items-center justify-center p-4"
                  style={{
                    visibility: !enableDynamicSize ? undefined : isLoading ? 'hidden' : 'visible',
                  }}
                >
                  <Rnd
                    size={{ width: modalWidth, height: modalHeight }}
                    position={position}
                    onMouseDown={(e) => {
                      const target = e.target as HTMLElement;
                      if (
                        target.classList.contains('dx-scrollbar') ||
                        target.closest('.dx-scrollable-scrollbar')
                      ) {
                        return;
                      }
                      e.stopPropagation();
                    }}
                    onDrag={(e) => {
                      const target = e.target as HTMLElement;
                      if (
                        target.classList.contains('dx-scrollbar') ||
                        target.closest('.dx-scrollable-scrollbar')
                      ) {
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
                      if (!isMaximized && !isMobile) {
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
                    disableDragging={isMaximized || isMobile}
                    enableResizing={!isMaximized && !isMobile}
                    bounds="parent"
                    minWidth={effectiveMinWidth}
                    minHeight={effectiveMinHeight}
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
                        className={`${
                          isMaximized || isMobile ? "cursor-pointer" : "cursor-move"
                        } place-items-center px-2 rounded-t-md bg-[#f6f6f6] h-[40px] top-0 z-10 flex justify-between text-[16px] dark:border-dark-border border-b py-3 font-medium leading-6 dark:bg-dark-bg dark:text-dark-text text-gray-900 border-gray-200 items-center drag-handle cursor-move`}
                        style={{ flex: "0 0 auto" }}
                      >
                        <div>{title}</div>
                        <div className="flex items-center space-x-2">
                          {closeButton === "Button" && (
                            <ERPButton
                              type="button"
                              title={closeTitle}
                              className="text-xs px-2 py-1"
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
                          )}
                          {isMaximize && (
                            <button
                              type="button"
                              className="dark:hover:!text-dark-hover-text hover:bg-[#e6e6e6] rounded-full p-1"
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
                              aria-label={isMaximized ? "Restore" : "Maximize"}
                            >
                              {isMaximized ? (
                                <Minimize2 className="h-4 w-4" />
                              ) : (
                                <Maximize2 className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            className="dark:hover:!text-dark-hover-text hover:bg-[#ff7373] rounded-full p-1"
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
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </DialogTitle>
                      <div className={`bg-inherit flex flex-col justify-between flex-grow w-full p-4`}>
                        <ERPScrollArea
                          className="overflow-y-auto overflow-x-hidden"
                          maxHeight={isMobile ? `calc(${window.innerHeight - 200}px)` : `${modalHeight - (footer ? 90 : 40)}px`}
                        >
                          <div
                            ref={enableDynamicSize ? contentRef : null}
                            className="modal-content-wrapper"
                          >
                            <div className={`px-2 pt-2`}>
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
                                        postData: mergeObjectsRemovingIdenticalKeys(
                                          content.postData,
                                          postData
                                        ),
                                      }
                                    : {
                                        contentProps: contentProps ? contentProps : {},
                                        isMaximized: isMaximized,
                                        modalHeight: modalHeight,
                                        rowData: rowData,
                                        origin: origin,
                                        postData: mergeObjectsRemovingIdenticalKeys(
                                          content.postData,
                                          postData
                                        ),
                                      }
                                )}
                            </div>
                          </div>
                        </ERPScrollArea>
                      </div>
                      {footer && (
                        <div className="border-t border-gray-300 dark:border-dark-border px-4 py-2">{footer}</div>
                      )}
                      {!isForm && isButton && (
                        <div
                          className="border-t py-2 flex gap-2 justify-end px-4"
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
                </div>
                {enableDynamicSize && isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            )}
          </Dialog>
        </Transition>
      </>
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
      prevProps.initialPosition === nextProps.initialPosition &&
      prevProps.enableDynamicSize === nextProps.enableDynamicSize &&
      prevProps.width === nextProps.width &&
      prevProps.height === nextProps.height
    );
  }
);

export default ERPModal;