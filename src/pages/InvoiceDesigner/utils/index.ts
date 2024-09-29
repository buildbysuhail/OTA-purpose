export const parseTemplateLiterals = (template_format: string | undefined, placeholders: any): string[] => {
  /* 
    converts template litelrals into strings 
  
    eg: 
    
    const placeholders: any = {
    company_name: company?.name,
    address_1: company?.address_1,
    address_2: company?.address_2, 
    state: company?.state?.name,
    country: company?.country?.name,
    
    }
  
    template_format = ${address_1}\n${address_2}\n${state}\n${country}
  
    returns "${company?.address_1}\n${company?.address_2}\n${company?.state?.name}\n${company?.country?.name}"
  
    */
  if (!template_format) {
    return [];
  }

  const parsedString = template_format.replace(/\$\{([^}]+)\}/g, (match, p1) => {
    return placeholders[p1] || "";
  });

  return parsedString.split("\n");
};

export const parseAddressTemplate = (template_format: string, address: any) => {
  const placeholders: any = {
    company_name: address?.name,
    address_1: address?.address_1,
    address_2: address?.address_2,
    city: address?.city,
    state: address?.state?.name,
    district: address?.district,
    country: address?.country?.name,
    zip_code: address?.zip_code,
    email: address?.email,
    phone: address?.phone,
    fax: address?.fax,
    trn_label: address?.trn_label,
    trn_number: address?.trn,
    website: address?.website,
    registered_on: address?.vat?.registered_on,
  };

  let orgAddressTemplate: any[] = [];
  try {
    orgAddressTemplate = parseTemplateLiterals(template_format, placeholders);
  } catch (error) {
    orgAddressTemplate = ["Error rendering Address"];
  }

  return orgAddressTemplate;
};
