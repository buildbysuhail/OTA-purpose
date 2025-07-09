import React from "react";

const Header = ({ data, template, currentBranch }: any) => {
  const headerState = template?.headerState;
  const logoWidth = headerState?.logoSize ? (80 * headerState.logoSize) / 100 : 40;

  return (
    <div
      className="w-full border-b border-gray-600 relative"
      style={{ backgroundColor: template?.headerState?.bgColor || "#fff", height: headerState?.headerHeight ? `${headerState.headerHeight}px` : "auto" }}
    >
      {template?.background_image_header && (
        <img
          src={template.background_image_header}
          alt="Header Background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
          style={{ objectPosition: headerState?.bg_image_header_position || "center" }}
        />
      )}
      <div className="flex flex-wrap w-full my-2 z-10">
        <div className="flex flex-col flex-[33.33%] justify-start items-start pl-2">
          {headerState?.showLogo && currentBranch?.logo && (
            <img src={currentBranch.logo} alt="Logo" style={{ width: logoWidth }} />
          )}
          {headerState?.showOrgName && (
            <p className="capitalize font-semibold" style={{ color: headerState?.OrganizationFontColor || "#000", fontSize: headerState?.OrganizationFontSize || 12 }}>
              {currentBranch?.name}
            </p>
          )}
        </div>
        <div className="flex flex-[33.33%] justify-center items-center">
          {headerState?.showDocTitle && (
            <p
              className="text-base"
              style={{
                color: headerState?.docTitleFontColor,
                fontSize: headerState?.docTitleFontSize,
                textDecoration: headerState?.docTitleUnderline ? "underline" : "none",
              }}
            >
              {headerState?.docTitle || "Account Transaction"}
            </p>
          )}
        </div>
        <div className="flex flex-col flex-[33.33%] items-end pr-2">
          {headerState?.showOrgAddress &&
            currentBranch.address?.map((line: string, idx: number) => (
              <p key={idx} style={{ fontSize: template?.propertiesState?.font_size || 12 }}>{line}</p>
            ))}

          {headerState?.hasPhoneField && (
            <div className="flex gap-1">
              <span>{headerState?.phoneLabel || "Phone No"}:</span>
              <span>{currentBranch?.phone}</span>
            </div>
          )}
          {headerState?.hasfaxField && (
            <div className="flex gap-1">
              <span>{headerState?.faxLabel || "Fax No"}:</span>
              <span>{currentBranch?.fax}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
