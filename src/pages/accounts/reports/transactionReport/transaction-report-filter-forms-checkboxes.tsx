import React, { useEffect, useState } from "react";
import ERPCheckbox from "../../../../components/ERPComponents/erp-checkbox";
import { useTranslation } from "react-i18next";

interface TransactionReportCheckbox {
  id: string;
  name: string;
  checked: boolean;
}

interface TransactionReportCheckboxProps {
  allTransactions: TransactionReportCheckbox[];
  setAllTransactions: React.Dispatch<
    React.SetStateAction<TransactionReportCheckbox[]>
  >;
  onDataChange: (formState: {
    vTypes: string;
    drCr: string;
    allChecked: boolean;
    isDr: boolean;
    isCr: boolean;
  }) => void;
  filter: any;
}

const TransactionReportfilterCheckboxes: React.FC<
  TransactionReportCheckboxProps
> = ({ allTransactions, setAllTransactions, onDataChange, filter }) => {
  // Calculate the number of full columns (7 items each) and any remaining items
  const { t } = useTranslation();
  const fullColumns = Math.floor(allTransactions?.length / 7);
  const remainingItems = allTransactions?.length % 7;
  const [formState, setFormState] = useState<{
    vTypes: string;
    drCr: string;
    allChecked: boolean;
    isDr: boolean;
    isCr: boolean;
  }>({ allChecked: false, drCr: "DrCr", isCr: false, isDr: false, vTypes: "" });
  useEffect(() => {
    //
    onDataChange(formState);
  }, [formState]);
  useEffect(() => {
    const updates: { [key: string]: any } = {
      isDr: filter?.drCr == "drCr" || filter?.drCr == "dr",
      isCr: filter?.drCr == "drCr" || filter?.drCr == "cr",
    };

    if (filter?.vTypes === "All") {
      updates["allChecked"] = true;

      // Set all items in `allTransactions` to checked
      setAllTransactions((prev: any[]) =>
        prev.map((transaction: any) => ({
          ...transaction,
          checked: true,
        }))
      );
    } else if (filter?.vTypes !== "") {
      const ids = filter?.vTypes?.split(",");

      // Update `checked` to true for items with IDs in `ids`
      setAllTransactions((prev: any[]) =>
        prev.map((transaction: any) => ({
          ...transaction,
          checked: ids?.includes(transaction.id), // Check if the id exists in the array
        }))
      );
    }

    // Apply all updates to formState in one call
    setFormState((prev: any) => ({
      ...prev,
      ...updates,
    }));
  }, []);
  useEffect(() => {
    let st = formState;
    setFormState((prev: any) => {
      const sds = allTransactions
        ?.filter((xx: any) => xx.checked === true)
        ?.map((tr: any) => tr.id)
        ?.join(",");
      st = {
        ...prev,
        allChecked:
          allTransactions.find((x) => x.checked == false) == undefined,
        vTypes: sds || "",
      };
      onDataChange(st);
      return st;
    });
  }, [allTransactions]);
  return (
    <>
      <ERPCheckbox
        id="allChecked"
        checked={formState.allChecked}
        data={formState}
        label={t("all")}
        onChangeData={(data) => {
          setFormState((prev: any) => ({
            ...prev,
            allChecked: data.allChecked,
          }));
          const sds = allTransactions?.map((tr: any) => ({
            ...tr, // Spread existing properties
            checked: data.allChecked, // Add new `checked` property
          }));
          setAllTransactions(sds);
          if (data.allChecked == true) {
            setFormState((prev: any) => ({
              ...prev,
              vTypes: "All",
            }));
          } else {
            const sds = allTransactions
              ?.filter((x) => x.checked === true)
              ?.map((tr: any) => tr.name)
              ?.join(",");
          }
        }}
      />
      <ERPCheckbox
        id="isDr"
        checked={formState.isDr}
        data={formState}
        label={t("debitTransaction")}
        onChangeData={(data) =>
          setFormState((prev: any) => ({
            ...prev,
            isDr: data.isDr,
          }))
        }
      />
      <ERPCheckbox
        id="isCr"
        checked={formState.isCr}
        data={formState}
        label={t("creditTransaction")}
        onChangeData={(data) =>
          setFormState((prev: any) => ({
            ...prev,
            isCr: data.isCr,
          }))
        }
      />
      <div className="max-w-3xl">
        <div className="flex space-x-4">
          {[...Array(fullColumns + (remainingItems > 0 ? 1 : 0))].map(
            (_, colIndex) => (
              <div key={colIndex} className="flex flex-col space-y-2">
                {allTransactions
                  .slice(colIndex * 7, (colIndex + 1) * 7)
                  .map((transaction) => (
                    <ERPCheckbox
                      key={transaction.id}
                      id={transaction.id}
                      label={transaction.name}
                      data={transaction}
                      checked={transaction.checked}
                      onChangeData={() => {
                        setAllTransactions((prev) =>
                          prev.map((tr) =>
                            tr.id === transaction.id
                              ? { ...tr, checked: !tr.checked }
                              : tr
                          )
                        );
                      }}
                    />
                  ))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionReportfilterCheckboxes;
