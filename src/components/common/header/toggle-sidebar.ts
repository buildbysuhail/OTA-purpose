// src/utils/toggleSidebar.ts

export const toggleSidebar = (
  appState: any,
  updateAppState: (state: any) => void,
) => {
  debugger;
  const theme = appState;
  let sidemenuType = theme.dataNavLayout;

  if (window.innerWidth >= 992) {
    if (sidemenuType === "vertical") {
      let verticalStyle = theme.dataVerticalStyle;
      const navStyle = theme.dataNavStyle;

      switch (verticalStyle) {
        case "closed":
          updateAppState({ ...theme, dataNavStyle: "" });
          if (theme.toggled === "close-menu-close") {
            updateAppState({ ...theme, toggled: "" });
          } else {
            updateAppState({ ...theme, toggled: "close-menu-close" });
          }
          break;

        case "overlay":
          updateAppState({ ...theme, dataNavStyle: "" });
          if (theme.toggled === "icon-overlay-close") {
            updateAppState({ ...theme, toggled: "" });
          } else {
            if (window.innerWidth >= 992) {
              updateAppState({ ...theme, toggled: "icon-overlay-close" });
            }
          }
          break;

        case "icontext":
          updateAppState({ ...theme, dataNavStyle: "" });
          if (theme.toggled === "icon-text-close") {
            updateAppState({ ...theme, toggled: "" });
          } else {
            updateAppState({ ...theme, toggled: "icon-text-close" });
          }
          break;

        case "doublemenu":
          updateAppState({ ...theme, dataNavStyle: "" });
          if (theme.toggled === "double-menu-open") {
            updateAppState({ ...theme, toggled: "double-menu-close" });
          } else {
            let sidemenu = document.querySelector(".side-menu__item.active");
            if (sidemenu) {
              updateAppState({ ...theme, toggled: "double-menu-open" });
              if (sidemenu.nextElementSibling) {
                sidemenu.nextElementSibling.classList.add("double-menu-active");
              } else {
                updateAppState({ ...theme, toggled: "" });
              }
            }
          }
          break;

        case "detached":
          if (theme.toggled === "detached-close") {
            updateAppState({ ...theme, toggled: "" });
          } else {
            updateAppState({ ...theme, toggled: "detached-close" });
          }
          break;

        case "default":
          updateAppState({ ...theme, toggled: "" });
      }

      switch (navStyle) {
        case "menu-click":
          if (theme.toggled === "menu-click-closed") {
            updateAppState({ ...theme, toggled: "" });
          } else {
            updateAppState({ ...theme, toggled: "menu-click-closed" });
          }
          break;

        case "menu-hover":
          if (theme.toggled === "menu-hover-closed") {
            updateAppState({ ...theme, toggled: "" });
          } else {
            updateAppState({ ...theme, toggled: "menu-hover-closed" });
          }
          break;

        case "icon-click":
          if (theme.toggled === "icon-click-closed") {
            updateAppState({ ...theme, toggled: "" });
          } else {
            updateAppState({ ...theme, toggled: "icon-click-closed" });
          }
          break;

        case "icon-hover":
          if (theme.toggled === "icon-hover-closed") {
            updateAppState({ ...theme, toggled: "" });
          } else {
            updateAppState({ ...theme, toggled: "icon-hover-closed" });
          }
          break;
      }
    }
  } else {
    if (theme.toggled === "close") {
      updateAppState({ ...theme, toggled: "open" });

      setTimeout(() => {
        const overlay = document.querySelector("#responsive-overlay");
        if (overlay) {
          overlay.classList.add("active");
          overlay.addEventListener("click", () => {
            const overlay = document.querySelector("#responsive-overlay");
            if (overlay) {
              overlay.classList.remove("active");
              menuClose(appState, updateAppState);
            }
          });
        }

        window.addEventListener("resize", () => {
          if (window.screen.width >= 992) {
            const overlay = document.querySelector("#responsive-overlay");
            if (overlay) {
              overlay.classList.remove("active");
            }
          }
        });
      }, 100);
    } else {
      updateAppState({ ...theme, toggled: "close" });
    }
  }
};
export function menuClose(appState: any, updateAppState: (state: any) => void) {
  const theme = appState;
  if (window.innerWidth <= 992) {
    updateAppState({ ...theme, toggled: "close" });
  }
  if (window.innerWidth >= 992) {
    updateAppState({
      ...theme,
      toggled: appState?.toggled ? appState.toggled : "",
    });
  }
}

