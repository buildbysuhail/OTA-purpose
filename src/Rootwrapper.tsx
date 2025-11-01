import { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useDocumentAttributes, useBodyClass, useCSSVariables } from "./useDocumentAttributes";
import { RootState } from "./redux/store";

// Create a memoized selector
// const selectRelevantState = createSelector(
//   (state) => state,
//   (state: any) => ({
//     dir: state.dir,
//     class: state.class,
//     dataHeaderStyles: state.dataHeaderStyles,
//     dataVerticalStyle: state.dataVerticalStyle,
//     dataNavLayout: state.dataNavLayout,
//     dataMenuStyles: state.dataMenuStyles,
//     dataToggled: state.dataToggled,
//     dataNavStyle: state.dataNavStyle,
//     horStyle: state.horStyle,
//     dataPageStyle: state.dataPageStyle,
//     dataWidth: state.dataWidth,
//     dataMenuPosition: state.dataMenuPosition,
//     dataHeaderPosition: state.dataHeaderPosition,
//     iconOverlay: state.iconOverlay,
//     bgImg: state.bgImg,
//     iconText: state.iconText,
//     colorPrimaryRgb: state.colorPrimaryRgb,
//     colorPrimary: state.colorPrimary,
//     darkBg: state.darkBg,
//     bodyBg: state.bodyBg,
//     inputBorder: state.inputBorder,
//     Light: state.Light,
//     body: state.body.class,
//   })
// );

interface RootWrapperProps {
  children: React.ReactNode;
}

function RootWrapper({ children }: RootWrapperProps) {
  // const local_variable = useSelector(selectRelevantState);
  const appState = useSelector((state: RootState) => state.AppState.appState);

  // Memoize HTML attributes to prevent unnecessary re-renders
  // const htmlAttributes = useMemo(() => {
  //   const attrs: Record<string, any> = {};
    
  //   if (local_variable.dir) attrs['dir'] = local_variable.dir;
  //   if (local_variable.class) attrs['class'] = local_variable.class;
  //   if (local_variable.dataHeaderStyles) attrs['data-header-styles'] = local_variable.dataHeaderStyles;
  //   if (local_variable.dataVerticalStyle) attrs['data-vertical-style'] = local_variable.dataVerticalStyle;
  //   if (local_variable.dataNavLayout) attrs['data-nav-layout'] = local_variable.dataNavLayout;
  //   if (local_variable.dataMenuStyles) attrs['data-menu-styles'] = local_variable.dataMenuStyles;
  //   if (local_variable.dataToggled) attrs['data-toggled'] = local_variable.dataToggled;
  //   if (local_variable.dataNavStyle) attrs['data-nav-style'] = local_variable.dataNavStyle;
  //   if (local_variable.horStyle) attrs['hor-style'] = local_variable.horStyle;
  //   if (local_variable.dataPageStyle) attrs['data-page-style'] = local_variable.dataPageStyle;
  //   if (local_variable.dataWidth) attrs['data-width'] = local_variable.dataWidth;
  //   if (local_variable.dataMenuPosition) attrs['data-menu-position'] = local_variable.dataMenuPosition;
  //   if (local_variable.dataHeaderPosition) attrs['data-header-position'] = local_variable.dataHeaderPosition;
  //   if (local_variable.iconOverlay) attrs['data-icon-overlay'] = local_variable.iconOverlay;
  //   if (local_variable.bgImg) attrs['bg-img'] = local_variable.bgImg;
  //   if (local_variable.iconText) attrs['icon-text'] = local_variable.iconText;
    
  //   return attrs;
  // }, [
  //   local_variable.dir,
  //   local_variable.class,
  //   local_variable.dataHeaderStyles,
  //   local_variable.dataVerticalStyle,
  //   local_variable.dataNavLayout,
  //   local_variable.dataMenuStyles,
  //   local_variable.dataToggled,
  //   local_variable.dataNavStyle,
  //   local_variable.horStyle,
  //   local_variable.dataPageStyle,
  //   local_variable.dataWidth,
  //   local_variable.dataMenuPosition,
  //   local_variable.dataHeaderPosition,
  //   local_variable.iconOverlay,
  //   local_variable.bgImg,
  //   local_variable.iconText,
  // ]);

  // Memoize CSS variables
  const cssVariables = useMemo(() => ({
    '--primary-rgb': appState.colorPrimaryRgb,
    '--primary': appState.colorPrimary,
    '--dark-bg': appState.darkBg,
    '--body-bg': appState.bodyBg,
    '--input-border': appState.inputBorder,
    '--light': appState.Light,
  }), [
    appState.colorPrimaryRgb,
    appState.colorPrimary,
    appState.darkBg,
    appState.bodyBg,
    appState.inputBorder,
    appState.Light,
  ]);

  // Apply document attributes
  // useDocumentAttributes(htmlAttributes);

  // Apply body class
  // useBodyClass(local_variable.body);

  // Apply CSS variables
  useCSSVariables(cssVariables);

  return <Fragment>{children}</Fragment>;
}

export default RootWrapper;