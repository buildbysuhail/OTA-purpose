import Cookies from "js-cookie";
import * as jwt_decode from "jwt-decode";
import { IUserSession } from "../redux/slices/auth/login/reducer";
const jwtHelper = {
  getLoggedInUser: () => {
    

    const user = Cookies.get("token");
    if (!user) {
      return null;
    } else {
      const decodedToken = jwt_decode.jwtDecode(user);
      return decodedToken as any;
    }
  },
  getLoggedInUserToken: () => {
    

    const user = Cookies.get("token");
    if (!user) {
      return null;
    } else {
      return user;
    }
  },
  getLoggedInUserRole: () => {
    

    const user = Cookies.get("token");
    if (!user) {
      return null;
    } else {
      const decodedToken = jwt_decode.jwtDecode(user);
      return ((decodedToken as any)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) as string;
    }
  },
  isUserCustomer: () => {
    const user = Cookies.get("token");
    if (!user) {
      return false;
    } else {
      const decodedToken = jwt_decode.jwtDecode(user);
      console.log(decodedToken);
      
      return ((decodedToken as any)['CustomerId']) !== undefined && ((decodedToken as any)['CustomerId']) !== null && ((decodedToken as any)['CustomerId']) !== '0';
    }
  },
  getCurrency: () => {
    debugger;
    const user = Cookies.get("token");
    if (!user) {
      return 'USD';
    } else {
      const decodedToken = jwt_decode.jwtDecode(user);
      return ((decodedToken as any)['Currency']) !== undefined && ((decodedToken as any)['Currency']) !== null && ((decodedToken as any)['Currency']) !== '' ? ((decodedToken as any)['Currency']) : 'USD';
    }
  },
  getLocale: () => {
    const user = Cookies.get("token");
    if (!user) {
      return 'en-US';
    } else {
      const decodedToken = jwt_decode.jwtDecode(user);
      return ((decodedToken as any)['Locale']) !== undefined && ((decodedToken as any)['Locale']) !== null && ((decodedToken as any)['Locale']) !== '' ? ((decodedToken as any)['Locale']) : 'en-US';
    }
  },
  getUserDetailsFromToken(token: string, permissionToken: string): IUserSession {
    const decodedToken = jwt_decode.jwtDecode(token);
    const decodedPermissionToken = jwt_decode.jwtDecode(permissionToken);
  
    return {
      token: token,
      loading: false,
      userId: (decodedToken as any)['UserId'] || 0,
      displayName: (decodedToken as any)['DisplayName'] || '',
      email: (decodedToken as any)['Email'] || '',
      group: (decodedToken as any)['Group'] || '',
      currentClientId: (decodedToken as any)['CurrentClientId'] || 0,
      currentClientName: (decodedToken as any)['CurrentClientName'] || '',
      currentBranchId: (decodedToken as any)['CurrentBranchId'] || 0,
      currentBranchName: (decodedToken as any)['CurrentBranchName'] || '',
      permissions: (decodedToken as any)['Permissions'] || [],
      currency: (decodedToken as any)['Currency'] || null,
      currencyDecimalPoints: (decodedToken as any)['CurrencyDecimalPoints'] || null,
      currencySymbol: (decodedToken as any)['CurrencySymbol'] || null,
      taxDecimalPoint: (decodedToken as any)['TaxDecimalPoint'] || 0,
      unitPriceDecimalPoint: (decodedToken as any)['UnitPriceDecimalPoint'] || 0,
      language: (decodedToken as any)['Locale'] || 'en-US',
      companies: (decodedPermissionToken as any)['Companies'] || [],
      branches: (decodedPermissionToken as any)['Branches'] || [],
    };
  }
};

export default jwtHelper;
