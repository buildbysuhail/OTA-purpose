import ERPTooltip from "./erp-tooltip";

type ERPCheckboxProps = {
  checked?: boolean;
  id?: string;
  label?: string;
  onChange?: (e: any) => void;
  className?: string;
  disabled?: boolean;
};

const ERPCheckbox = ({ checked, id, label, onChange, disabled }: ERPCheckboxProps) => {
  return (
    <div className="flex gap-1">
      <input
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
        id={id}
        checked={checked}
        className=" rounded-sm overflow-hidden checked:bg-accent active:bg-accent w-4 h-4 border-2  border-gray-300 disabled:cursor-not-allowed"
      />
      {label && (
        <label htmlFor={id} className="text-xs capitalize block text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};

export default ERPCheckbox;
