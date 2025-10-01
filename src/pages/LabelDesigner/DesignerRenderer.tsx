import React from "react";
import { ResizableBox } from "react-resizable";
import { DesignerElementType, PlacedComponent, TemplateState } from "../InvoiceDesigner/Designer/interfaces";
import { DeleteButton } from "./label_designer";
import { QRCodeComponent } from "./QRCodeComponent";


type DesignerRendererProps = {
  component: PlacedComponent;
  isChild?: boolean;
  selectedComponent: PlacedComponent | null;
  setSelectedComponent: React.Dispatch<React.SetStateAction<PlacedComponent | null>>;
  setTemplateData: React.Dispatch<React.SetStateAction<TemplateState<unknown>>>;
  templateData: TemplateState<unknown>;
  handleComponentClick: (e: React.MouseEvent, comp: PlacedComponent) => void;
  handleMouseDown: (e: React.MouseEvent, comp: PlacedComponent) => void;
  handleDelete: (id: string) => void;
  barcodeErrors?: any[];
  barcodeRefs?: React.MutableRefObject<Record<string, HTMLCanvasElement | null>>;
  qrCodeRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  handleDropIntoContainer?: (e: React.DragEvent<HTMLDivElement>, container: PlacedComponent) => void;
  childStyle?:React.CSSProperties
};

const DesignerRenderer: React.FC<DesignerRendererProps> = ({
  component,
  isChild = false,
  selectedComponent,
  setSelectedComponent,
  setTemplateData,
  templateData,
  handleComponentClick,
  handleMouseDown,
  handleDelete,
  barcodeErrors,
  barcodeRefs,
  qrCodeRefs,
  handleDropIntoContainer,
  childStyle
}) => {
  const isSelected = selectedComponent?.id === component.id;

  // Common style
  const baseStyle: React.CSSProperties =childStyle ?childStyle : {
    position: "absolute",
    left: `${component.x}pt`,
    top: `${component.y}pt`,
    zIndex: isChild ? 10 : 1,
    transform: `rotate(${component.rotate || 0}deg)`,
    transformOrigin: "center",
    cursor: "move",
  };

  switch (component.type) {
    case DesignerElementType.barcode:
      return (
        <div
          key={component.id}
          id={`component-${component.id}`}
          style={{
            ...baseStyle,
            width: `${component.width}pt`,
            height: component.height,
            border: isSelected ? "2px solid #2196f3" : "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleComponentClick(e, component);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, component);
          }}
        >
          {barcodeErrors?.find((x) => x.id === component.id) ? (
            <>
              <div className="text-red-500 text-sm" style={{ pointerEvents: "none" }}>
                {barcodeErrors.find((x) => x.id === component.id)?.error}
              </div>
              <canvas
                ref={(el) => (barcodeRefs!.current[component.id] = el)}
                width={component.width}
                height={component.height}
                style={{ pointerEvents: "none" }}
              />
            </>
          ) : (
            <canvas
              ref={(el) => (barcodeRefs!.current[component.id] = el)}
              width={component.width}
              height={component.height}
              style={{ pointerEvents: "none" }}
            />
          )}
          <DeleteButton id={component.id} isSelected={isSelected} handleDelete={handleDelete} />
        </div>
      );

    case DesignerElementType.text:
    case DesignerElementType.field:
      return (
        <ResizableBox
          key={component.id}
          width={component.width}
          height={component.height}
          minConstraints={[20, 20]}
          maxConstraints={[800, 600]}
          resizeHandles={isSelected ? ["se", "sw", "ne", "nw", "n", "s", "e", "w"] : []}
 
         onResize={(e, { size }) => {
                const updatedComponents = templateData?.barcodeState?.placedComponents?.map((comp) => {
                    if (comp.id === component.id) {
                    return {
                        ...comp,
                        width: size.width,
                        height: size.height,
                    };
                    }
                    return comp;
                }) || [];
                setTemplateData((prev: TemplateState<unknown>) => ({
                    ...prev,
                    barcodeState: {
                    ...prev.barcodeState,
                    placedComponents: updatedComponents,
                    },
                }));
                if (selectedComponent?.id === component.id) {
                    setSelectedComponent((prev) => ({
                    ...prev!,
                    width: size.width,
                    height: size.height,
                    }));
                }
                }}
          style={baseStyle}
        >
          <div
              id={`component-${component.id}`}
              style={{
                width: "100%",
                height: "100%",
                border: isSelected ? "2px solid #2196f3" : "none",
                // padding: "2px",
                boxSizing: "border-box",
                fontSize: `${component.fontSize || 12}pt`,
                fontFamily: component.font || "Roboto",
                fontWeight:component.fontWeight ?? "400",
                fontStyle: component.fontStyle || "normal",
                textAlign: component.textAlign || "center",
                color:`rgb(${component.fontColor})`,
                display: "flex",
                alignItems: "center",
                justifyContent: component.textAlign || "center",
                overflow: "hidden",
                backgroundColor:isSelected ? "#ffffffff" : "inherit", 
                pointerEvents: 'auto',
                userSelect: 'none',
                cursor: "move",
                
              }}
            onClick={(e) => {
              e.stopPropagation();
              handleComponentClick(e, component);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, component);
            }}
          >

              <p style={{ pointerEvents: 'none', userSelect: 'none' ,whiteSpace: "pre-wrap", }}>{component.content}</p>
            
          </div>
          <DeleteButton id={component.id} isSelected={isSelected} handleDelete={handleDelete} />
        </ResizableBox>
      );

          case  DesignerElementType.image:
      return (
        <ResizableBox
          key={component.id}
          width={component.width}
          height={component.height}
          minConstraints={[20, 20]}
          maxConstraints={[800, 600]}
          resizeHandles={isSelected ? ["se", "sw", "ne", "nw", "n", "s", "e", "w"] : []}
 
         onResize={(e, { size }) => {
                const updatedComponents = templateData?.barcodeState?.placedComponents?.map((comp) => {
                    if (comp.id === component.id) {
                    return {
                        ...comp,
                        width: size.width,
                        height: size.height,
                    };
                    }
                    return comp;
                }) || [];
                setTemplateData((prev: TemplateState<unknown>) => ({
                    ...prev,
                    barcodeState: {
                    ...prev.barcodeState,
                    placedComponents: updatedComponents,
                    },
                }));
                if (selectedComponent?.id === component.id) {
                    setSelectedComponent((prev) => ({
                    ...prev!,
                    width: size.width,
                    height: size.height,
                    }));
                }
                }}
          style={baseStyle}
        >
          <div
              id={`component-${component.id}`}
              style={{
                width: "100%",
                height: "100%",
                border:
                  selectedComponent?.id === component.id
                    ? "2px solid #2196f3"
                    : "none",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            onClick={(e) => {
              e.stopPropagation();
              handleComponentClick(e, component);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, component);
            }}
          >
              <img
                src={component.content}
                alt="Component Image"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit:
                    (component.imgFit as React.CSSProperties["objectFit"]) || "cover",
                 objectPosition: (component.imgPosition as React.CSSProperties["objectPosition"])  || "center center",
                  pointerEvents: 'none',
                }}
              />
            
          </div>
          <DeleteButton id={component.id} isSelected={isSelected} handleDelete={handleDelete} />
        </ResizableBox>
      );


     case DesignerElementType.qrCode:
      return (
        <QRCodeComponent
          key={component.id}
          component={component}
          isSelected={isSelected}
          style={baseStyle}
          handleComponentClick={handleComponentClick}
          handleMouseDown={handleMouseDown}
          handleDelete={handleDelete}
          qrCodeRefs={qrCodeRefs!}
          templateData={templateData}
          setTemplateData={setTemplateData}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
        />
      );

    case DesignerElementType.line:
      return (
        <div
          key={component.id}
          style={{
            ...baseStyle,
            width: `${component.lineWidth}pt`,
            height: "auto",
            border: isSelected ? "2px solid #2196f3" : "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleComponentClick(e, component);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, component);
          }}
        >
          <div
            style={{
              borderTop: `${component.lineThickness || 1}px ${component.lineType || "solid"} ${
                component.lineColor || "black"
              }`,
              width: `${component.lineWidth}pt`,
            }}
          />
          <DeleteButton id={component.id} isSelected={isSelected} handleDelete={handleDelete} />
        </div>
      );

    case DesignerElementType.container: {
      const containerChildren = templateData?.barcodeState?.placedComponents?.filter(
        (c) => c.containerId === component.id 
      )|| [];
        const calculateContainerHeight = () => {
          if (!component.containerProps?.autoResize || containerChildren?.length === 0) {
            return component.height;
          }
          
          let maxBottom = 0;
          containerChildren?.forEach(child => {
            const childBottom = child.y + child.height;
            if (childBottom > maxBottom) {
              maxBottom = childBottom;
            }
          });
          
          const padding = component.containerProps.padding || 0;
          const calculatedHeight = maxBottom + padding;
          const minHeight = component.containerProps.minHeight || 50;
          const maxHeight = component.containerProps.maxHeight || 500;
          
          return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
        };
        
        const containerHeight = calculateContainerHeight();
      return (
        <ResizableBox
          key={component.id}
          width={component.width}
          height={containerHeight}
          minConstraints={[50, 50]}
          maxConstraints={[800, 600]}
          resizeHandles={isSelected ? ["se", "sw", "ne", "nw", "n", "s", "e", "w"] : []}
            onResize={(e, { size }) => {
              const updatedComponents = templateData?.barcodeState?.placedComponents?.map((comp) => {
                if (comp.id === component.id) {
                  return {
                    ...comp,
                    width: size.width,
                    height: size.height,
                  };
                }
                return comp;
              }) || [];
              setTemplateData((prev: TemplateState<unknown>) => ({
                ...prev,
                barcodeState: {
                  ...prev.barcodeState,
                  placedComponents: updatedComponents,
                },
              }));
              if (selectedComponent?.id === component.id) {
                setSelectedComponent((prev) => ({
                  ...prev!,
                  width: size.width,
                  height: size.height,
                }));
              }
            }}
            className="container-component"          
          style={baseStyle}
        >
          <div
            id={`component-${component.id}`}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: component.containerProps?.backgroundColor || "inherit",
                border: isSelected 
                  ? "2px solid #2196f3" 
                  : `${component.containerProps?.borderWidth || 1}pt ${component.containerProps?.borderStyle || "solid"} ${component.containerProps?.borderColor || "#cccccc"}`,
                padding: `${component.containerProps?.padding || 0}pt`,
                boxSizing: "border-box",
                position: "relative",
                overflow: component.containerProps?.autoResize ? "visible" : "hidden",
                cursor: "move",
                borderRadius: `${component.containerProps?.borderRound || 1}pt`
              }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
                handleComponentClick(e, component);
              }
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
                handleMouseDown(e, component);
              }
            }}
            onDrop={(e) => handleDropIntoContainer?.(e, component)}
            onDragOver={(e) => e.preventDefault()}
          >
              {/* Render children elements */}
              {containerChildren.length === 0 ? (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#999',
                  fontSize: '12px',
                  pointerEvents: 'none',
                  textAlign: 'center',
                }}>
                Drop elements here<br/>
                (including containers)
                </div>
              ) : null}
            {containerChildren?.map((child, index) => {
        // Use the actual child data from the state, not a copy
                const actualChild = templateData?.barcodeState?.placedComponents?.find(
                  comp => comp.id === child.id
                ) || child;
                // For child elements, positions should be relative to container
                const containerPadding = component.containerProps?.padding || 10;
                // Child positions are already stored relative to container, so use them directly
                const relativeX = actualChild.x;
                const relativeY = actualChild.y;

            const childStyle: React.CSSProperties = {
                position: "absolute",
                left: `${relativeX}pt`,
                top: `${relativeY}pt`,
                width: `${actualChild.width || 100}pt`,
                height: actualChild.type === DesignerElementType.barcode ? "auto" : `${actualChild.height || 50}pt`,
                zIndex: 10 + index,
                cursor: "move",
                transform: `rotate(${actualChild.rotate || 0}deg)`,
                transformOrigin: "center",
                pointerEvents: 'auto',
            };
              return(
              <DesignerRenderer
                key={actualChild.id}
                component={actualChild}
                isChild={true}
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                setTemplateData={setTemplateData}
                templateData={templateData}
                handleComponentClick={handleComponentClick}
                handleMouseDown={handleMouseDown}
                handleDelete={handleDelete}
                barcodeErrors={barcodeErrors}
                barcodeRefs={barcodeRefs}
                qrCodeRefs={qrCodeRefs}
                handleDropIntoContainer={handleDropIntoContainer}
                childStyle={childStyle}
              />
              )  
          })}
            <DeleteButton id={component.id} isSelected={isSelected} handleDelete={handleDelete} />
          </div>
        </ResizableBox>
      );
    }

    default:
      return null;
  }
};

export default DesignerRenderer;
