import { useState } from 'react';
import { MENUITEMS } from '../../sidebar/sidemenu/sidemenu';
import { clearStorage, getStorageString, removeStorageString, setStorageString } from '../../../../utilities/storage-utils';

export async function Dark(actionfunction: any, appState: any) {
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
    await setStorageString("ynexdarktheme", "dark");
    await removeStorageString("ynexlighttheme");
    await removeStorageString("ynexlighttheme");
    await removeStorageString('darkBgRGB');


}
export async function Light(actionfunction: any, appState: any) {
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
    await setStorageString("ynexlighttheme", "light");
    await removeStorageString("ynexdarktheme");
    await removeStorageString('Light');
    await removeStorageString('bodyBgRGB');
    await removeStorageString('darkBgRGB');
}
export async function Ltr(actionfunction: any, appState: any) {
    actionfunction({ ...appState, dir: "ltr" });
    await setStorageString("ynexltr", "ltr");
    await removeStorageString("ynexrtl");
}
export async function Rtl(actionfunction: any, appState: any) {
    
    actionfunction({ ...appState, dir: "rtl" });
    await setStorageString("ynexrtl", "rtl");
    await removeStorageString("ynexltr");
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

export  const HorizontalClick = async(actionfunction: any, appState: any) => {
   const isGetinLocal = await getStorageString("ynexnavstyles");
    actionfunction({
        ...appState,
        "dataNavLayout": "horizontal",
        "dataVerticalStyle": "",
        "dataNavStyle":isGetinLocal  ? isGetinLocal : "menu-click"
    });
    await setStorageString("ynexlayout", "horizontal");
    await removeStorageString("ynexverticalstyles");
    closeMenuFn();
    const Sidebar:any =  document.querySelector(".main-menu");
    if(Sidebar){
    Sidebar.style.marginInline = "0px";
    }
};
export  const Vertical = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataMenuStyles": "dark",
        "dataVerticalStyle": "overlay",
        "toggled": "",
        "dataNavStyle": ''
    });
    await setStorageString("ynexlayout", "vertical");
    await removeStorageString("ynexnavstyles");

};

export  const Menuclick = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavStyle": "menu-click",
        "dataVerticalStyle": "",
        "toggled": "menu-click-closed",
    });
    await setStorageString("ynexnavstyles", "menu-click");
    await removeStorageString("ynexverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if(Sidebar){
    Sidebar.style.marginInline = "0px";
    }
};
export const MenuHover = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavStyle": "menu-hover",
        "dataVerticalStyle": "",
        "toggled": "menu-hover-closed",
        "horStyle": ""
    });
    await setStorageString("ynexnavstyles", "menu-hover");
    await removeStorageString("ynexverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if(Sidebar){
    Sidebar.style.marginInline = "0px";
    }
};
export const IconClick = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavStyle": "icon-click",
        "dataVerticalStyle": "",
        "toggled": "icon-click-closed",
    });
    await setStorageString("ynexnavstyles", "icon-click");
    await removeStorageString("ynexverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if(Sidebar){
         Sidebar.style.marginInline = "0px";
     }
};

export const IconHover = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavStyle": "icon-hover",
        "dataVerticalStyle": "",
        "toggled": "icon-hover-closed"
    });
    await setStorageString("ynexnavstyles", "icon-hover");
    await removeStorageString("ynexverticalstyles");
    const Sidebar: any = document.querySelector(".main-menu");
    if(Sidebar){
    Sidebar.style.marginInline = "0px";
    }
    closeMenuFn();
};
export const Fullwidth = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataWidth": "fullwidth",
    });
    await setStorageString("ynexfullwidth", "Fullwidth");
    await removeStorageString("ynexboxed");

};
export const Boxed = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataWidth": "boxed",
    });
    await setStorageString("ynexboxed", "Boxed");
    await removeStorageString("ynexfullwidth");
};
export const FixedMenu = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuPosition": "fixed",
    });
    await setStorageString("ynexmenufixed", "MenuFixed");
    await removeStorageString("ynexmenuscrollable");
};
export const scrollMenu = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuPosition": "scrollable",
    });
    await setStorageString("ynexmenuscrollable", "Menuscrolled");
    await removeStorageString("ynexmenufixed");
};
export const Headerpostionfixed = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderPosition": "fixed",
    });
    await setStorageString("ynexheaderfixed", 'FixedHeader');
    await removeStorageString("ynexheaderscrollable");
};
export const Headerpostionscroll = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderPosition": "scrollable",
    });
    await setStorageString("ynexheaderscrollable", "ScrollableHeader");
    await removeStorageString("ynexheaderfixed");
};
export const Regular = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataPageStyle": "regular"
    });
    await setStorageString("ynexregular", "Regular");
    await removeStorageString("ynexclassic");
    await removeStorageString("ynexmodern");
};
export const Classic = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataPageStyle": "classic",
    });
    await setStorageString("ynexclassic", "Classic");
    await removeStorageString("ynexregular");
    await removeStorageString("ynexmodern");
};
export const Modern = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataPageStyle": "modern",
    });
    await setStorageString("ynexmodern", "Modern");
    await removeStorageString("ynexregular");
    await removeStorageString("ynexclassic");
};
export const Thick = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataScrollbarWidth": "lg",
    });
    await setStorageString("ynexmodern", "Thick");
    await removeStorageString("ynexregular");
    await removeStorageString("ynexclassic");
};
export const Medium = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataScrollbarWidth": "md",
    });
    await setStorageString("ynexmodern", "Medium");
    await removeStorageString("ynexregular");
    await removeStorageString("ynexclassic");
};
export const Thin = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataScrollbarWidth": "sm",
    });
    await setStorageString("ynexmodern", "Thin");
    await removeStorageString("ynexregular");
    await removeStorageString("ynexclassic");
};

export const Defaultmenu = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataVerticalStyle": "overlay",
        "dataNavLayout": "vertical",
        'toggled': '',
        "dataNavStyle": "",
    });
    await removeStorageString("ynexnavstyles");
    await setStorageString("ynexverticalstyles", "default");
    var icon =document.getElementById("switcher-default-menu") as HTMLInputElement;
    if(icon){
        icon.checked=true
    }

};
export const Closedmenu = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "closed",
        "toggled": "close-menu-close",
        "dataNavStyle": "",
    });
    await setStorageString("ynexverticalstyles", "closed");
    await removeStorageString("ynexnavstyles");

};

export  function icontextOpenFn() {
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
export const iconTextfn = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "icontext",
        "toggled": "icon-text-close",
        "dataNavStyle": "",
    });
    await setStorageString("ynexverticalstyles", "icontext");
    await removeStorageString("ynexnavstyles");

    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        icontextOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        icontextCloseFn();
    });
};
export const iconOverayFn = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "overlay",
        "toggled": "icon-overlay-close",
        "dataNavStyle": "",
    });
    await setStorageString("ynexverticalstyles", "overlay");
    await removeStorageString("ynexnavstyles");
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

export const DetachedFn = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "detached",
        "toggled": "detached-open",
        "dataNavStyle": "",
    });
    await setStorageString("ynexverticalstyles", "detached");
    await removeStorageString("ynexnavstyles");

    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn()
    });
    MainContent?.addEventListener("click", () => {
        DetachedCloseFn()
    });
};


export const DoubletFn = async(actionfunction: any, appState: any) => {

    actionfunction({
        ...appState,
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "doublemenu",
        "toggled": "double-menu-open",
        "dataNavStyle": "",
    });
    await setStorageString("ynexverticalstyles", "doublemenu");
    await removeStorageString("ynexnavstyles");

};
export const bgImage1 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg1"
    });
    await setStorageString("bgimage1", "bgimg1");
    await removeStorageString("bgimage2");
    await removeStorageString("bgimage3");
    await removeStorageString("bgimage4");
    await removeStorageString("bgimage5");
};
export const bgImage2 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg2"
    });
    await setStorageString("bgimage2", "bgimg2");
    await removeStorageString("bgimage1");
    await removeStorageString("bgimage3");
    await removeStorageString("bgimage4");
    await removeStorageString("bgimage5");
};
export const bgImage3 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg3"
    });
    await setStorageString("bgimage3", "bgimg3");
    await removeStorageString("bgimage1");
    await removeStorageString("bgimage2");
    await removeStorageString("bgimage4");
    await removeStorageString("bgimage5");
};
export const bgImage4 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg4"
    });
    await setStorageString("bgimage4", "bgimg4");
    await removeStorageString("bgimage1");
    await removeStorageString("bgimage2");
    await removeStorageString("bgimage3");
    await removeStorageString("bgimage5");
};
export const bgImage5 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "bgImg": "bgimg5"
    });
    await setStorageString("bgimage5", "bgimg5");
    await removeStorageString("bgimage1");
    await removeStorageString("bgimage2");
    await removeStorageString("bgimage3");
    await removeStorageString("bgimage4");
};

export const colorMenu = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "color",
    });
    await setStorageString("ynexMenu", "color");
    await removeStorageString("gradient");
};

export const lightMenu = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "light",
    });
    await setStorageString("ynexMenu", "light");
    await removeStorageString("light");
};

export const darkMenu = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "dark",
    });
    await setStorageString("ynexMenu", "dark");
    await removeStorageString("light");
};

export const gradientMenu =async (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "gradient",
    });
    await setStorageString("ynexMenu", "gradient");
    await removeStorageString("color");
};
export const transparentMenu =async (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataMenuStyles": "transparent",
    });
    await setStorageString("ynexMenu", "transparent");
    await removeStorageString("gradient");
};

export const lightHeader =async (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "light",
    });
    await setStorageString("ynexHeader", "light");
    await removeStorageString("dark");
};
export const darkHeader = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "dark",
    });
    await setStorageString("ynexHeader", "dark");
    await removeStorageString("light");
};
export const colorHeader =async (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "color",
    });
    await setStorageString("ynexHeader", "color");
    await removeStorageString("dark");
};
export const gradientHeader = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "gradient",

    });
    await setStorageString("ynexHeader", "gradient");
    await removeStorageString("transparent");
};
export const transparentHeader = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "dataHeaderStyles": "transparent",
    });
    await removeStorageString("gradient");
    await setStorageString("ynexHeader", "transparent");
};

export const primaryColorCustom = async(actionfunction: any, appState: any, rgb: string) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": rgb,
        "colorPrimary": rgb
    });
    await setStorageString("primaryRGB", rgb);
    await setStorageString("primaryRGB1", rgb);
};
export const primaryColor1 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "58, 88, 146",
        "colorPrimary": "58 88 146"

    });
    await setStorageString("primaryRGB", "58, 88, 146");
    await setStorageString("primaryRGB1", "58 88 146");

};
export const primaryColor2 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "92, 144 ,163",
        "colorPrimary": "92 144 163"
    });
    await setStorageString("primaryRGB", "92, 144, 163");
    await setStorageString("primaryRGB1", "92 144 163");
};
export const primaryColor3 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "161, 90 ,223",
        "colorPrimary": "161 90 223"
    });
    await setStorageString("primaryRGB", "161, 90, 223");
    await setStorageString("primaryRGB1", "161 90 223");
};
export const primaryColor4 = async(actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "78, 172, 76",
        "colorPrimary": "78 172 76"
    });
    await setStorageString("primaryRGB", "78, 172, 76");
    await setStorageString("primaryRGB1", "78 172 76");
};
export const primaryColor5 =async (actionfunction: any, appState: any) => {
    actionfunction({
        ...appState,
        "colorPrimaryRgb": "223, 90, 90",
        "colorPrimary": "223 90 90"
    });
    await setStorageString("primaryRGB", "223, 90, 90");
    await setStorageString("primaryRGB1", "223 90 90");
};

export const backgroundColor1 = async(actionfunction: any, appState: any) => {
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
    await setStorageString('darkBgRGB', "20 30 96");
    await setStorageString('bodyBgRGB', "34 44 110");
    await setStorageString('Light', "25 35 102");

};
export const backgroundColor2 = async(actionfunction: any, appState: any) => {
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
    await setStorageString('darkBgRGB', "8 78 115");
    await setStorageString('bodyBgRGB', "22 92 129");
    await setStorageString('Light', "13 83 120",);
};
export const backgroundColor3 = async(actionfunction: any, appState: any) => {
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
    await setStorageString('darkBgRGB', "90 37 135");
    await setStorageString('bodyBgRGB', "104 51 149");
    await setStorageString('Light', "95 42 140");
};
export const backgroundColor4 = async(actionfunction: any, appState: any) => {
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
    await setStorageString('darkBgRGB', "24 101 51");
    await setStorageString('bodyBgRGB', "38 115 64");
    await setStorageString('Light', "29 106 56");
};
export const backgroundColor5 = async(actionfunction: any, appState: any) => {
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
    await setStorageString('darkBgRGB', "120 66 20");
    await setStorageString('bodyBgRGB', "134 80 34");
    await setStorageString('Light', "125 71 25");
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

    const handleInput = async(e: any) => {
        const rgb = hexToRgb(e.target?.value);

        if (rgb !== null) {
            const { r, g, b } = rgb;
            updateState(e.target?.value);
            actionfunction({
                ...appState,
                "colorPrimaryRgb": `${r},  ${g},  ${b}`,
                "colorPrimary": `${r} ${g} ${b}`
            });
            await setStorageString("dynamiccolor", `${r}, ${g} ,${b}`);
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
    const handleInput = async(e: any) => {
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
        await setStorageString("darkBgRGB", `${r - 14} ${g - 14} ${b - 14}`);
        await setStorageString("Light", `${r - 9} ${g - 9} ${b - 9}`);
        await setStorageString("bodyBgRGB", `${r} ${g} ${b}`);
        await removeStorageString("ynexMenu");
        await removeStorageString("ynexHeader");

    };
    return (
        <div className="Themebackgroundcolor">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export const Reset = async(actionfunction: any, appState: any) => {
    
    
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
    await clearStorage();;
    var icon =document.getElementById("switcher-default-menu") as HTMLInputElement;
    if(icon){
        icon.checked=true
    }
};
export  const Reset1 =async (actionfunction: any, appState: any) => {
    
    
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
    await clearStorage();
    var icon =document.getElementById("switcher-default-menu") as HTMLInputElement;
    if(icon){
        icon.checked=true
    }
};
export const LocalStorageBackup = async(actionfunction: any, appState: any) => {

  // Layout direction
  if (await getStorageString("ynexltr")) await Ltr(actionfunction, appState);
  if (await getStorageString("ynexrtl")) await Rtl(actionfunction, appState);

  // Theme
  if (await getStorageString("ynexdarktheme")) await Dark(actionfunction, appState);
  if (await getStorageString("ynexlighttheme")) await Light(actionfunction, appState);

  // Styles
  if (await getStorageString("ynexregular")) await Regular(actionfunction, appState);
  if (await getStorageString("ynexclassic")) await Classic(actionfunction, appState);
  if (await getStorageString("ynexmodern")) await Modern(actionfunction, appState);

  // Width
  if (await getStorageString("ynexfullwidth")) await Fullwidth(actionfunction, appState);
  if (await getStorageString("ynexboxed")) await Boxed(actionfunction, appState);

  // Menu position
  if (await getStorageString("ynexmenufixed")) await FixedMenu(actionfunction, appState);
  if (await getStorageString("ynexmenuscrollable")) await scrollMenu(actionfunction, appState);

  // Header position
  if (await getStorageString("ynexheaderfixed")) await Headerpostionfixed(actionfunction, appState);
  if (await getStorageString("ynexheaderscrollable")) await Headerpostionscroll(actionfunction, appState);

  // Nav styles (need value check)
  const navStyle = await getStorageString("ynexnavstyles");
  if (navStyle === "menu-click") await Menuclick(actionfunction, appState);
  if (navStyle === "menu-hover") await MenuHover(actionfunction, appState);
  if (navStyle === "icon-click") await IconClick(actionfunction, appState);
  if (navStyle === "icon-hover") await IconHover(actionfunction, appState);

  // Background images
  if (await getStorageString("bgimage1")) await bgImage1(actionfunction, appState);
  if (await getStorageString("bgimage2")) await bgImage2(actionfunction, appState);
  if (await getStorageString("bgimage3")) await bgImage3(actionfunction, appState);
  if (await getStorageString("bgimage4")) await bgImage4(actionfunction, appState);
  if (await getStorageString("bgimage5")) await bgImage5(actionfunction, appState);

  // Layout mode
  const layout = await getStorageString("ynexlayout");
  if (layout === "horizontal") await HorizontalClick(actionfunction, appState);
  if (layout === "vertical") await Vertical(actionfunction, appState);
    //primitive 
    const _ltr = await getStorageString("ynexltr");
    const _rtl = await getStorageString("ynexrtl");
    if (
        _ltr == null || _ltr == "ltr"
    )
        if (_rtl == "rtl") {
            document.querySelector("body")?.classList.add("rtl");
            document.querySelector("html[lang=en]")?.setAttribute("dir", "rtl");
        }
    //

    // Theme Primary: Colors: Start
    const _primaryRGB = await getStorageString("primaryRGB");
    switch (_primaryRGB) {
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
 const _darkBgRGB = await getStorageString("darkBgRGB");
    switch (_darkBgRGB) {
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
    const _ynexverticalstyles = await getStorageString("ynexverticalstyles");
    if (_ynexverticalstyles) {

        switch (_ynexverticalstyles) {
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
    const _dynamiccolor = await getStorageString("dynamiccolor");
    if (_dynamiccolor) {
        
        actionfunction({
            ...appState,
            "colorPrimaryRgb": _dynamiccolor,
            "colorPrimary": _dynamiccolor
        });
    }
    //Theme BAckground:

    if (_darkBgRGB) {
        let bodyBg = await getStorageString("bodyBgRGB");
        let Light = await getStorageString("Light");
        let darkBgRGB = _darkBgRGB
        actionfunction({
            ...appState,
            "bodyBg": bodyBg,
            "Light": Light,
            "darkBg": darkBgRGB,
            "class": "dark",
            "dataHeaderStyles": "dark",
            "dataMenuStyles": "dark",
        });
        // Dark(actionfunction, appState);
    }
    // ThemeColor MenuColor Start
    const _ynexMenu = await getStorageString("ynexMenu");
    switch (_ynexMenu) {
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
    const _ynexHeader = await getStorageString("ynexHeader");
    switch (_ynexHeader) {
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
