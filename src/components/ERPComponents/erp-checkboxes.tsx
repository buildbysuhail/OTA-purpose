import ERPTooltip from "./erp-tooltip";

type ERPCheckboxesProps = {
  label?: string;
  items?: any;
  field?: any;
  handleChange?: any;
  data?: any;
  defaultData?: any;
};

const ERPCheckboxes = ({ label, items, field, handleChange, data, defaultData }: ERPCheckboxesProps) => {
  const onCheck = () => {
    defaultData && field?.disableWhen ? null : handleChange(field?.id, data?.[field?.id] == `true` ? `false` : `true`);
  };

  let value = defaultData?.[field.id];
  if (data !== undefined && data?.[field.id] !== undefined) {
    value = data?.[field.id];
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs py-1">{label}</label>
      {items?.map((item: any, idx: number) => (
        <div className="flex gap-2 cursor-pointer w-fit" key={`CB_${item?.id}_${idx}`}>
          <div className="flex gap-2" onClick={onCheck}>
            <label className=" text-xs cursor-pointer ">{item}</label>
            <input type="checkbox" checked={value == true || value == `true` ? true : false} disabled={defaultData && field?.disableWhen} />
          </div>
          {field?.hasInfoMark && <ERPTooltip message={field?.message} />}
        </div>
      ))}
    </div>
  );
};

export default ERPCheckboxes;
