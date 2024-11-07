import React from 'react';
import ERPCheckbox from '../../../components/ERPComponents/erp-checkbox';

interface Transaction {
  voucherType: string;
  voucherName: string;
  checked: boolean;
}

interface TransactionFormsCheckboxesProps {
  allTransactions: Transaction[];
  setAllTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const TransactionFormsCheckboxes: React.FC<TransactionFormsCheckboxesProps> = ({
  allTransactions,
  setAllTransactions,
}) => {
  // Calculate the number of full columns (7 items each) and any remaining items
  
  const fullColumns = Math.floor(allTransactions?.length / 7);
  const remainingItems = allTransactions?.length % 7;

  return (
    <div className="max-w-3xl">
    
      <div className="flex space-x-4">
        {[...Array(fullColumns + (remainingItems > 0 ? 1 : 0))].map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col space-y-2">
            {allTransactions.slice(colIndex * 7, (colIndex + 1) * 7).map((transaction) => (
              <ERPCheckbox
                key={transaction.voucherType}
                id={transaction.voucherType}
                label={transaction.voucherName}
                data={transaction}
                checked={transaction.checked}
                onChangeData={() => {
                  setAllTransactions((prev) =>
                    prev.map((tr) =>
                      tr.voucherType === transaction.voucherType
                        ? { ...tr, checked: !tr.checked }
                        : tr
                    )
                  );
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionFormsCheckboxes;