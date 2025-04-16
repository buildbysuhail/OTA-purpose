import React, { useCallback, useState } from 'react';
import CustomInput from '../../../../components/ERPComponents/erp-searchbox';
import { APIClient } from '../../../../helpers/api-client';
import Urls from '../../../../redux/urls';

const TestSearch: React.FC = () => {
 
  return (
    <div className="p-4">
      {/* <CustomInput
        type="text"
        id='test'
        keyId='testserch'
        placeholder="Search Here"
        apiUrl={Urls.load_product_details} */}
      {/* /> */}
    </div>
  );
};

export default React.memo(TestSearch);