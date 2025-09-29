import React from 'react';
import { TransactionFormState } from '../transaction-types';
import { useTranslation } from 'react-i18next';

interface ProductSummaryProps {
  formState: TransactionFormState;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({ formState }) => {
  const { t } = useTranslation('transaction');

  return (
    <div className="p-4">
      
    </div>
  );
};

export default ProductSummary;
