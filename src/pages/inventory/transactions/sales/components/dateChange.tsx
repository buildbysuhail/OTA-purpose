import { useState, useRef } from "react";
import ERPModal from "../../../../../components/ERPComponents/erp-modal";
import ERPButton from "../../../../../components/ERPComponents/erp-button";
import ERPInput from "../../../../../components/ERPComponents/erp-input";
import ERPAlert from "../../../../../components/ERPComponents/erp-sweet-alert";
import { useTranslation } from "react-i18next";

let openDateChangeModal:
  | (() => Promise<string | null>)
  | null = null;

export const SalesDateChange = (): Promise<string | null> => {
  return openDateChangeModal
    ? openDateChangeModal()
    : Promise.resolve(null);
};

const DateChangeModal = () => {
  const { t } = useTranslation("transaction");

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const resolverRef = useRef<((value: string | null) => void) | null>(null);

  openDateChangeModal = () => {
    setOpen(true);

    return new Promise<string | null>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const close = (result: string | null) => {
    setOpen(false);
    resolverRef.current?.(result);
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      ERPAlert.show({
        icon: "info",
        title: t("date_required"),
        confirmButtonText: t("ok"),
      });
      return;
    }

    close(selectedDate);
  };

  if (!open) return null;

  return (
    <ERPModal
      isOpen={open}
      closeModal={() => close(null)}
      title={t("change_date")}
      width={400}
      height={220}
      content={
        <div className="flex flex-col gap-4 p-4">

          {/* Date Picker */}
          <ERPInput
            id="date-change"
            type="date"
            autoFocus
            label={t("select_date")}
            value={selectedDate}
            onChange={(e: any) => setSelectedDate(e.target.value)}
          />

          {/* Buttons */}
          <div className="flex justify-center gap-2">
            <ERPButton
              title={t("cancel")}
              variant="secondary"
              className="w-24"
              onClick={() => close(null)}
            />

            <ERPButton
              title={t("apply")}
              variant="primary"
              className="w-24"
              onClick={handleSubmit}
            />
          </div>

        </div>
      }
    />
  );
};

export default DateChangeModal;
