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
  getFormState: any;
}

const TransactionReportfilterCheckboxes: React.FC<
  TransactionReportCheckboxProps
> = ({ allTransactions, setAllTransactions, onDataChange, getFormState }) => {
  debugger;
  // Calculate the number of full columns (7 items each) and any remaining items
  const { t } = useTranslation();
  const fullColumns = Math.floor(allTransactions?.length / 7);
  const remainingItems = allTransactions?.length % 7;
  const [formState, setFormState] = useState<any>(getFormState()?.data);
  // useEffect(() => {
  //   //
  //   onDataChange(formState);
  // }, [formState]);
  useEffect(() => {
    debugger;
    const data = getFormState().data;
    const updates: { [key: string]: any } = {
      isDr: data?.drCr == "drCr" || data?.drCr == "dr",
      isCr: data?.drCr == "drCr" || data?.drCr == "cr",
    };

    if (data?.vTypes === "All") {
      updates["allChecked"] = true;

      // Set all items in `allTransactions` to checked
      setAllTransactions((prev: any[]) =>
        prev.map((transaction: any) => ({
          ...transaction,
          checked: true,
        }))
      );
    } else if (data?.vTypes !== "") {
      const ids = data?.vTypes?.split(",");

      // Update `checked` to true for items with IDs in `ids`
      setAllTransactions((prev: any[]) => {
        const dff = prev.map((transaction: any) => ({
          ...transaction,
          checked: ids?.includes(transaction.id), // Check if the id exists in the array
        }));
        return dff;
      });
    }

    // Apply all updates to formState in one call
    setFormState((prev: any) => ({
      ...prev,
      ...updates,
    }));
  }, []);
  // useEffect(() => {
  //   let st = formState;
  //   setFormState((prev: any) => {
  //     const sds = allTransactions
  //       ?.filter((xx: any) => xx.checked === true)
  //       ?.map((tr: any) => tr.id)
  //       ?.join(",");
  //     st = {
  //       ...prev,
  //       allChecked:
  //         allTransactions.find((x) => x.checked == false) == undefined,
  //       vTypes: sds || "",
  //     };
  //     onDataChange(st);
  //     return st;
  //   });
  // }, [allTransactions]);
  const onChangeData = (data: any) => {
    debugger;
    setFormState((prev: any) => {
      debugger;
      const sdsds = allTransactions?.map((tr: any) => {
        debugger;
        return {
          ...tr, // Spread existing properties
          checked: tr.id == data.id ? data[data.id] : tr.checked, // Add new `checked` property
        };
      });
      const sds = sdsds
        ?.filter((xx: any) => xx.checked === true)
        ?.map((tr: any) => tr.id)
        ?.join(",");
      let st = {
        ...prev,
        allChecked: sdsds.find((x) => x.checked == false) == undefined,
        vTypes: sds || "",
      };
      setAllTransactions(sdsds);
      onDataChange(st);
      return st;
    });
  };
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
              ?.map((tr: any) => tr.id)
              ?.join(",");
          }
        }}
      />
      <ERPCheckbox
        id="isDr"
        checked={formState.isDr}
        data={formState}
        label={t("debitTransaction")}
        onChangeData={(data) => {
          debugger;
          setFormState((prev: any) => {
            debugger;
            const st = {
              ...prev,
              isDr: data.isDr,
            };
            onDataChange(st);
            return st;
          });
        }}
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
                      onChangeData={onChangeData}
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
