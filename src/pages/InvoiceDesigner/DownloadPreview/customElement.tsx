// customElement.tsx
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { DesignerElementType, PlacedComponent } from "../Designer/interfaces";
import type { Style } from "@react-pdf/types";

const pxToPt = (px: number) => px * (72 / 96);

export const renderComponent = (component: PlacedComponent,data?:any) => {
  const baseStyle: Style = {
    position: "absolute",
    left: component.x,
    top: component.y,
    transform: `rotate(${component.rotate || 0}deg)`,
    transformOrigin: "center",
  };

  switch (component.type) {
    case DesignerElementType.text:
      return (
        <Text
          key={component.id}
          style={{
            ...baseStyle,
            fontFamily: component.font || "Roboto",
            fontSize: component.fontSize || 12,
            fontStyle: component.fontStyle || "normal",
            textAlign: component.textAlign || "center",
            height: component.height || 50,
            width: component.width || 50,
          }}
        >
          {component.content}
        </Text>
      );

        // case DesignerElementType.field:
        //       return (
        //         <View key={component.id} style={baseStyle}>
        //           <Text
        //             style={{
        //               fontFamily: component.font || 'Roboto',
        //               fontSize: component.fontSize || 12,
        //               fontStyle: component.fontStyle || "normal",
        //               textAlign: component.textAlign || "center",
        //               minHeight: component.height || 50,
        //               height:"auto",
        //               width: component.width || 50,
        //             }}
        //           >
        //              {data[component.content] || "N/A"}
        //           </Text>
        //         </View>
        //       );

    default:
      console.warn(`Unsupported component type: ${component.type}`);
      return null;
  }
};
