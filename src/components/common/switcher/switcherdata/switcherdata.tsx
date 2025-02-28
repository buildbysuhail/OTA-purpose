import { useState } from 'react';
import { MENUITEMS } from '../../sidebar/sidemenu/sidemenu';

export function Dark(actionfunction: any, appState: any) {
    actionfunction({
        ...appState,
        "class": "dark",
        "mode": "dark",
        "dataHeaderStyles": "dark",
        "dataMenuStyles": "dark",
        "bodyBg": "",
        "darkBg": "",
        "inputBorder": "",
        "Light": "",
    });
    localStorage.setItem("ynexdarktheme", "dark");
    localStorage.removeItem("ynexlighttheme");
    localStorage.removeItem("ynexlighttheme");
    localStorage.removeItem('darkBgRGB');


}
export function Light(actionfunction: any, appState: any) {
    actionfunction({
        ...appState,
        "class": "light",
        "mode": "light",
        "dataHeaderStyles": "light",
        "darkBg": "",
        "bodyBg": "",
        "inputBorder": "",
        "Light": "",
        "dataMenuStyles": appState?.dataNavLayout == 'horizontal' ? 'light' : "dark"

    });
    localStorage.setItem("ynexlighttheme", "light");
    localStorage.removeItem("ynexdarktheme");
    localStorage.removeItem('Light');
    localStorage.removeItem('bodyBgRGB');
    localStorage.removeItem('darkBgRGB');
}
export function Ltr(actionfunction: any, appState: any) {
    actionfunction({ ...appState, dir: "ltr" });
    localStorage.setItem("ynexltr", "ltr");
    localStorage.removeItem("ynexrtl");
}
export function Rtl(actionfunction: any, appState: any) {
    
    actionfunction({ ...appState, dir: "rtl" });
    localStorage.setItem("ynexrtl", "rtl");
    localStorage.removeItem("ynexltr");
}

function closeMenuFn() {
    const closeMenuRecursively = (items: any) => {

        items?.forEach((item: any) => {
            item.active = false;
            closeMenuRecursively(item.children);
        });
    };
    closeMenuRecursively(MENUITEMS);
}
export const HorizontalClick = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "horizontal",
        "dataVerticalStyle": "",
        "dataNavStyle": localStorage.ynexnavstyles ? localStorage.ynexnavstyles : "menu-click"
    });
    localStorage.setItem("ynexlayout", "horizontal");
    localStorage.removeItem("ynexverticalstyles");
    closeMenuFn();
    const Sidebar:any =  document.querySelector(".main-menu");
    if(Sidebar){
    Sidebar.style.marginInline = "0px";
    }
};
export const Vertical = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataMenuStyles": "dark",
        "dataVerticalStyle": "overlay",
        "toggled": "",
        "dataNavStyle": ''
    });
    localStorage.setItem("ynexlayout", "vertical");
    localStorage.removeItem("ynexnavstyles");

};

export const Menuclick = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavStyle": "menu-click",
        "dataVerticalStyle": "",
        "toggled": "menu-click-closed",
    });
    localStorage.setItem("ynexnavstyles", "menu-click");
    localStorage.removeItem("ynexverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if(Sidebar){
    Sidebar.style.marginInline = "0px";
    }
};
export const MenuHover = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavStyle": "menu-hover",
        "dataVerticalStyle": "",
        "toggled": "menu-hover-closed",
        "horStyle": ""
    });
    localStorage.setItem("ynexnavstyles", "menu-hover");
    localStorage.removeItem("ynexverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if(Sidebar){
    Sidebar.style.marginInline = "0px";
    }
};
export const IconClick = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavStyle": "icon-click",
        "dataVerticalStyle": "",
        "toggled": "icon-click-closed",
    });
    localStorage.setItem("ynexnavstyles", "icon-click");
    localStorage.removeItem("ynexverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if(Sidebar){
         Sidebar.style.marginInline = "0px";
     }
};

export const IconHover = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavStyle": "icon-hover",
        "dataVerticalStyle": "",
        "toggled": "icon-hover-closed"
    });
    localStorage.setItem("ynexnavstyles", "icon-hover");
    localStorage.removeItem("ynexverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if(Sidebar){
    Sidebar.style.marginInline = "0px";
    }
    closeMenuFn();
};
export const Fullwidth = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataWidth": "fullwidth",
    });
    localStorage.setItem("ynexfullwidth", "Fullwidth");
    localStorage.removeItem("ynexboxed");

};
export const Boxed = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataWidth": "boxed",
    });
    localStorage.setItem("ynexboxed", "Boxed");
    localStorage.removeItem("ynexfullwidth");
};
export const FixedMenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuPosition": "fixed",
    });
    localStorage.setItem("ynexmenufixed", "MenuFixed");
    localStorage.removeItem("ynexmenuscrollable");
};
export const scrollMenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuPosition": "scrollable",
    });
    localStorage.setItem("ynexmenuscrollable", "Menuscrolled");
    localStorage.removeItem("ynexmenufixed");
};
export const Headerpostionfixed = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderPosition": "fixed",
    });
    localStorage.setItem("ynexheaderfixed", 'FixedHeader');
    localStorage.removeItem("ynexheaderscrollable");
};
export const Headerpostionscroll = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderPosition": "scrollable",
    });
    localStorage.setItem("ynexheaderscrollable", "ScrollableHeader");
    localStorage.removeItem("ynexheaderfixed");
};
export const Regular = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataPageStyle": "regular"
    });
    localStorage.setItem("ynexregular", "Regular");
    localStorage.removeItem("ynexclassic");
    localStorage.removeItem("ynexmodern");
};
export const Classic = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataPageStyle": "classic",
    });
    localStorage.setItem("ynexclassic", "Classic");
    localStorage.removeItem("ynexregular");
    localStorage.removeItem("ynexmodern");
};
export const Modern = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataPageStyle": "modern",
    });
    localStorage.setItem("ynexmodern", "Modern");
    localStorage.removeItem("ynexregular");
    localStorage.removeItem("ynexclassic");
};
export const Thick = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataScrollbarWidth": "lg",
    });
    localStorage.setItem("ynexmodern", "Thick");
    localStorage.removeItem("ynexregular");
    localStorage.removeItem("ynexclassic");
};
export const Medium = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataScrollbarWidth": "md",
    });
    localStorage.setItem("ynexmodern", "Medium");
    localStorage.removeItem("ynexregular");
    localStorage.removeItem("ynexclassic");
};
export const Thin = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataScrollbarWidth": "sm",
    });
    localStorage.setItem("ynexmodern", "Thin");
    localStorage.removeItem("ynexregular");
    localStorage.removeItem("ynexclassic");
};

export const Defaultmenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataVerticalStyle": "overlay",
        "dataNavLayout": "vertical",
        'toggled': '',
        "dataNavStyle": "",
    });
    localStorage.removeItem("ynexnavstyles");
    localStorage.setItem("ynexverticalstyles", "default");
    var icon =document.getElementById("switcher-default-menu") as HTMLInputElement;
    if(icon){
        icon.checked=true
    }

};
export const Closedmenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "closed",
        "toggled": "close-menu-close",
        "dataNavStyle": "",
    });
    localStorage.setItem("ynexverticalstyles", "closed");
    localStorage.removeItem("ynexnavstyles");

};

export function icontextOpenFn() {
    let html = document.documentElement;
    if (html.getAttribute('data-toggled') === 'icon-text-close') {
        html.setAttribute('icon-text', 'open');
    }
}
export function icontextCloseFn() {
    let html = document.documentElement;
    if (html.getAttribute('data-toggled') === 'icon-text-close') {
        html.removeAttribute('icon-text');
    }
}
export const iconTextfn = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "icontext",
        "toggled": "icon-text-close",
        "dataNavStyle": "",
    });
    localStorage.setItem("ynexverticalstyles", "icontext");
    localStorage.removeItem("ynexnavstyles");

    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        icontextOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        icontextCloseFn();
    });
};
export const iconOverayFn = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "overlay",
        "toggled": "icon-overlay-close",
        "dataNavStyle": "",
    });
    localStorage.setItem("ynexverticalstyles", "overlay");
    localStorage.removeItem("ynexnavstyles");
    var icon =document.getElementById("switcher-icon-overlay") as HTMLInputElement;
    if(icon){
        icon.checked=true
    }
    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');
    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn()
    });
    MainContent?.addEventListener("click", () => {
        DetachedCloseFn()
    });
};

export function DetachedOpenFn() {
    if (window.innerWidth > 992) {
   
        let html = document.documentElement;
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.setAttribute('icon-overlay', 'open');
        }
    }
}
export function DetachedCloseFn() {
    if (window.innerWidth > 992) {
    
        let html = document.documentElement;
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.removeAttribute('icon-overlay');
        }
    }
}

export const DetachedFn = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "detached",
        "toggled": "detached-open",
        "dataNavStyle": "",
    });
    localStorage.setItem("ynexverticalstyles", "detached");
    localStorage.removeItem("ynexnavstyles");

    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn()
    });
    MainContent?.addEventListener("click", () => {
        DetachedCloseFn()
    });
};


export const DoubletFn = (actionfunction: any, appState: any) => {

    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "doublemenu",
        "toggled": "double-menu-open",
        "dataNavStyle": "",
    });
    localStorage.setItem("ynexverticalstyles", "doublemenu");
    localStorage.removeItem("ynexnavstyles");

};
export const bgImage1 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg1"
    });
    localStorage.setItem("bgimage1", "bgimg1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage4");
    localStorage.removeItem("bgimage5");
};
export const bgImage2 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg2"
    });
    localStorage.setItem("bgimage2", "bgimg2");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage4");
    localStorage.removeItem("bgimage5");
};
export const bgImage3 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg3"
    });
    localStorage.setItem("bgimage3", "bgimg3");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage4");
    localStorage.removeItem("bgimage5");
};
export const bgImage4 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg4"
    });
    localStorage.setItem("bgimage4", "bgimg4");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage5");
};
export const bgImage5 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg5"
    });
    localStorage.setItem("bgimage5", "bgimg5");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage4");
};

export const colorMenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "color",
    });
    localStorage.setItem("ynexMenu", "color");
    localStorage.removeItem("gradient");
};

export const lightMenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "light",
    });
    localStorage.setItem("ynexMenu", "light");
    localStorage.removeItem("light");
};

export const darkMenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "dark",
    });
    localStorage.setItem("ynexMenu", "dark");
    localStorage.removeItem("light");
};

export const gradientMenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "gradient",
    });
    localStorage.setItem("ynexMenu", "gradient");
    localStorage.removeItem("color");
};
export const transparentMenu = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "transparent",
    });
    localStorage.setItem("ynexMenu", "transparent");
    localStorage.removeItem("gradient");
};

export const lightHeader = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "light",
    });
    localStorage.setItem("ynexHeader", "light");
    localStorage.removeItem("dark");
};
export const darkHeader = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "dark",
    });
    localStorage.setItem("ynexHeader", "dark");
    localStorage.removeItem("light");
};
export const colorHeader = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "color",
    });
    localStorage.setItem("ynexHeader", "color");
    localStorage.removeItem("dark");
};
export const gradientHeader = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "gradient",

    });
    localStorage.setItem("ynexHeader", "gradient");
    localStorage.removeItem("transparent");
};
export const transparentHeader = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "transparent",
    });
    localStorage.removeItem("gradient");
    localStorage.setItem("ynexHeader", "transparent");
};

export const primaryColorCustom = (actionfunction: any, appState: any, rgb: string) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": rgb,
        "colorPrimary": rgb
    });
    localStorage.setItem("primaryRGB", rgb);
    localStorage.setItem("primaryRGB1", rgb);
};
export const primaryColor1 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "58, 88, 146",
        "colorPrimary": "58 88 146"

    });
    localStorage.setItem("primaryRGB", "58, 88, 146");
    localStorage.setItem("primaryRGB1", "58 88 146");

};
export const primaryColor2 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "92, 144 ,163",
        "colorPrimary": "92 144 163"
    });
    localStorage.setItem("primaryRGB", "92, 144, 163");
    localStorage.setItem("primaryRGB1", "92 144 163");
};
export const primaryColor3 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "161, 90 ,223",
        "colorPrimary": "161 90 223"
    });
    localStorage.setItem("primaryRGB", "161, 90, 223");
    localStorage.setItem("primaryRGB1", "161 90 223");
};
export const primaryColor4 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "78, 172, 76",
        "colorPrimary": "78 172 76"
    });
    localStorage.setItem("primaryRGB", "78, 172, 76");
    localStorage.setItem("primaryRGB1", "78 172 76");
};
export const primaryColor5 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "223, 90, 90",
        "colorPrimary": "223 90 90"
    });
    localStorage.setItem("primaryRGB", "223, 90, 90");
    localStorage.setItem("primaryRGB1", "223 90 90");
};

export const backgroundColor1 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bodyBg": "34 44 110",
        "darkBg": "20 30 96",
        "inputBorder": "25 35 102",
        "Light": "25 35 102",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB', "20 30 96");
    localStorage.setItem('bodyBgRGB', "34 44 110");
    localStorage.setItem('Light', "25 35 102");

};
export const backgroundColor2 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bodyBg": "22 92 129",
        "Light": "13 83 120",
        "darkBg": "8 78 115",
        "inputBorder": "13 83 120",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB', "8 78 115");
    localStorage.setItem('bodyBgRGB', "22 92 129");
    localStorage.setItem('Light', "13 83 120",);
};
export const backgroundColor3 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bodyBg": "104 51 149",
        "Light": "95 42 140",
        "darkBg": "90 37 135",
        "inputBorder": "95 42 140",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB', "90 37 135");
    localStorage.setItem('bodyBgRGB', "104 51 149");
    localStorage.setItem('Light', "95 42 140");
};
export const backgroundColor4 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "Light": "29 106 56",
        "bodyBg": "38 115 64",
        "darkBg": "24 101 51",
        "inputBorder": "29 106 56;",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB', "24 101 51");
    localStorage.setItem('bodyBgRGB', "38 115 64");
    localStorage.setItem('Light', "29 106 56");
};
export const backgroundColor5 = (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bodyBg": " 134 80 34",
        "Light": "125 71 25",
        "darkBg": "120 66 20",
        "inputBorder": "125 71 25",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    });
    localStorage.setItem('darkBgRGB', "120 66 20");
    localStorage.setItem('bodyBgRGB', "134 80 34");
    localStorage.setItem('Light', "125 71 25");
};

export const ColorPicker = (props: any) => {
    return (
        <div className="color-picker-input">
            <input  type="color" {...props} />
        </div>
    );
};

export function hexToRgb(hex: any) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const Themeprimarycolor: React.FC<actionfunctionProps> = ({ actionfunction, appState }) => {
    
    const [state, updateState] = useState("#FFFFFF");

    const handleInput = (e: any) => {
        const rgb = hexToRgb(e.target?.value);

        if (rgb !== null) {
            const { r, g, b } = rgb;
            updateState(e.target?.value);
            actionfunction({
                ...appState,
                "colorPrimaryRgb": `${r},  ${g},  ${b}`,
                "colorPrimary": `${r} ${g} ${b}`
            });
            localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
        }
    };

    return (
        <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export default Themeprimarycolor;

interface actionfunctionProps {
    actionfunction: (newState: any) => void; 
    appState: any; 
  }
//themeBackground
export const Themebackgroundcolor : React.FC<actionfunctionProps> = ({ actionfunction, appState }) => {
    
    const [state, updateState] = useState("#FFFFFF");
    const handleInput = (e: any) => {
        const { r, g, b }: any = hexToRgb(e.target?.value);
        updateState(e.target?.value);
        actionfunction({
            ...appState,
            "bodyBg": `${r} ${g} ${b}`,
            "Light": `${r - 9} ${g - 9} ${b - 9}`,
            "darkBg": `${r - 14} ${g - 14} ${b - 14}`,
            "inputBorder": `${r - 27} ${g - 27} ${b - 27}`,
            "class": "dark",
            "dataHeaderStyles": "dark"
        });
        localStorage.setItem("darkBgRGB", `${r - 14} ${g - 14} ${b - 14}`);
        localStorage.setItem("Light", `${r - 9} ${g - 9} ${b - 9}`);
        localStorage.setItem("bodyBgRGB", `${r} ${g} ${b}`);
        localStorage.removeItem("ynexMenu");
        localStorage.removeItem("ynexHeader");

    };
    return (
        <div className="Themebackgroundcolor">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export const Reset = (actionfunction: any, appState: any) => {
    
    debugger;
    Vertical(actionfunction, appState);
    actionfunction({
        ...appState,
        lang: "en",
        dir: "ltr",
        class: "light",
        dataMenuStyles: "dark",
        dataNavLayout: "vertical",
        dataHeaderStyles: "light",
        dataVerticalStyle: "overlay",
        StylebodyBg: "107 64 64",
        StyleDarkBg: "93 50 50",
        toggled: "",
        dataNavStyle: "",
        horStyle: "",
        dataPageStyle: "regular",
        dataWidth: "fullwidth",
        dataMenuPosition: "fixed",
        dataHeaderPosition: "fixed",
        iconOverlay: "",
        colorPrimaryRgb: "",
        colorPrimary: "",
        bodyBg: "",
        Light: "",
        darkBg: "",
        inputBorder: "",
        bgImg: "",
        iconText: "",
        body: {
            class: ""
        }
    });
    localStorage.clear();
    var icon =document.getElementById("switcher-default-menu") as HTMLInputElement;
    if(icon){
        icon.checked=true
    }
};
export const Reset1 = (actionfunction: any, appState: any) => {
    
    debugger;
    Vertical(actionfunction, appState);
    actionfunction({
        ...appState,
        lang: "en",
        dir: "ltr",
        class: "light",
        dataMenuStyles: "dark",
        dataNavLayout: "horizontal",
        dataHeaderStyles: "",
        dataVerticalStyle: "overlay",
        StylebodyBg: "107 64 64",
        StyleDarkBg: "93 50 50",
        toggled: "",
        dataNavStyle: "menu-click",
        dataMenuPosition: "fixed",
        iconOverlay: "",
        colorPrimaryRgb: "",
        colorPrimary: "",
        bgImg: "",
        iconText: "",
        body: {
            class: ""
        }
    });
    localStorage.clear();
    var icon =document.getElementById("switcher-default-menu") as HTMLInputElement;
    if(icon){
        icon.checked=true
    }
};
export const LocalStorageBackup = (actionfunction: any, appState: any) => {

    (localStorage.ynexltr) ? Ltr(actionfunction, appState) : "";
    (localStorage.ynexrtl) ? Rtl(actionfunction, appState) : "";
    (localStorage.ynexdarktheme) ? Dark(actionfunction, appState) : "";
    (localStorage.ynexlighttheme) ? Light(actionfunction, appState) : "";
    (localStorage.ynexregular) ? Regular(actionfunction, appState) : "";
    (localStorage.ynexclassic) ? Classic(actionfunction, appState) : "";
    (localStorage.ynexmodern) ? Modern(actionfunction, appState) : "";
    (localStorage.ynexfullwidth) ? Fullwidth(actionfunction, appState) : "";
    (localStorage.ynexboxed) ? Boxed(actionfunction, appState) : "";
    (localStorage.ynexmenufixed) ? FixedMenu(actionfunction, appState) : "";
    (localStorage.ynexmenuscrollable) ? scrollMenu(actionfunction, appState) : "";
    (localStorage.ynexheaderfixed) ? Headerpostionfixed(actionfunction, appState) : "";
    (localStorage.ynexheaderscrollable) ? Headerpostionscroll(actionfunction, appState) : "";


    (localStorage.ynexnavstyles === "menu-click") ? Menuclick(actionfunction, appState) : '';
    (localStorage.ynexnavstyles === "menu-hover") ? MenuHover(actionfunction, appState) : '';
    (localStorage.ynexnavstyles === "icon-click") ? IconClick(actionfunction, appState) : '';
    (localStorage.ynexnavstyles === "icon-hover") ? IconHover(actionfunction, appState) : '';

    (localStorage.bgimage1) ? bgImage1(actionfunction, appState) : '';
    (localStorage.bgimage2) ? bgImage2(actionfunction, appState) : '';
    (localStorage.bgimage3) ? bgImage3(actionfunction, appState) : '';
    (localStorage.bgimage4) ? bgImage4(actionfunction, appState) : '';
    (localStorage.bgimage5) ? bgImage5(actionfunction, appState) : '';
    (localStorage.ynexlayout == 'horizontal') && HorizontalClick(actionfunction, appState);
    (localStorage.ynexlayout == 'vertical') && Vertical(actionfunction, appState);
    //primitive 
    if (
        localStorage.getItem("ynexltr") == null ||
        localStorage.getItem("ynexltr") == "ltr"
    )
        if (localStorage.getItem("ynexrtl") == "rtl") {
            document.querySelector("body")?.classList.add("rtl");
            document.querySelector("html[lang=en]")?.setAttribute("dir", "rtl");
        }
    //

    // Theme Primary: Colors: Start
    switch (localStorage.primaryRGB) {
        case '58, 88,146':
            primaryColor1(actionfunction, appState);

            break;
        case '92, 144, 163':
            primaryColor2(actionfunction, appState);

            break;
        case "161, 90, 223":
            primaryColor3(actionfunction, appState);

            break;
        case "78, 172, 76":
            primaryColor4(actionfunction, appState);

            break;
        case "223, 90, 90":
            primaryColor5(actionfunction, appState);

            break;
        default:
            break;
    }
    // Theme Primary: Colors: End

    switch (localStorage.darkBgRGB) {
        case '20 30 96':
            backgroundColor1(actionfunction, appState);

            break;
        case '8 78 115':
            backgroundColor2(actionfunction, appState);

            break;
        case '79 50 93':
            backgroundColor3(actionfunction, appState);

            break;
        case '24 101 51':
            backgroundColor4(actionfunction, appState);

            break;
        case '93 50 50':
            backgroundColor5(actionfunction, appState);

            break;
        default:
            break;
    }

    //layout
    if (localStorage.ynexverticalstyles) {
        const verticalStyles = localStorage.getItem("ynexverticalstyles");

        switch (verticalStyles) {
            case "default":
                Defaultmenu(actionfunction, appState);
                break;
            case "closed":
                Closedmenu(actionfunction, appState);
                break;
            case "icontext":
                iconTextfn(actionfunction, appState);
                break;
            case "overlay":
                iconOverayFn(actionfunction, appState);
                break;
            case "detached":
                DetachedFn(actionfunction, appState);
                break;
            case "doublemenu":
                DoubletFn(actionfunction, appState);
                break;
        }
    }

    //Theme Primary:
    if (localStorage.dynamiccolor) {
        
        actionfunction({
            ...appState,
            "colorPrimaryRgb": localStorage.dynamiccolor,
            "colorPrimary": localStorage.dynamiccolor
        });
    }
    //Theme BAckground:
    if (localStorage.darkBgRGB) {
        
        actionfunction({
            ...appState,
            "bodyBg": localStorage.bodyBgRGB,
            "Light": localStorage.Light,
            "darkBg": localStorage.darkBgRGB,
            "class": "dark",
            "dataHeaderStyles": "dark",
            "dataMenuStyles": "dark",
        });
        // Dark(actionfunction, appState);
    }
    // ThemeColor MenuColor Start
    switch (localStorage.ynexMenu) {
        case 'light':
            lightMenu(actionfunction, appState);
            break;
        case 'dark':
            darkMenu(actionfunction, appState);

            break;
        case 'color':
            colorMenu(actionfunction, appState);

            break;
        case 'gradient':
            gradientMenu(actionfunction, appState);

            break;
        case 'transparent':
            transparentMenu(actionfunction, appState);

            break;
        default:
            break;
    }
    // ThemeColor Header Colors: start
    switch (localStorage.ynexHeader) {
        case 'light':
            lightHeader(actionfunction, appState);

            break;
        case 'dark':
            darkHeader(actionfunction, appState);

            break;
        case 'color':
            colorHeader(actionfunction, appState);

            break;
        case 'gradient':
            gradientHeader(actionfunction, appState);

            break;
        case 'transparent':
            transparentHeader(actionfunction, appState);

            break;
        default:
            break;
    }
};
