
export interface DeviceState {
  platform: "ios" | "android" | "web" | "electron";
  isWeb: boolean,
  isMobile: boolean,
  isTablet: boolean,
  isDesktop: boolean
}