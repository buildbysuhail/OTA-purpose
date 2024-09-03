import dayjs from "dayjs";
import React, { useEffect } from "react";
import utc from "dayjs/plugin/utc";
import ERPInput from "./erp-input";
import { dateTrimmer } from "../../utilities/Utils";
import ERPElementValidationMessage from "./erp-element-validation-message";

dayjs.extend(utc);

const ERPDateInput = ({ field, label, disabled, handleChange, defaultData, data,
  validation }: any) => {
  // let currentDate = dayjs().format("YYYY-MM-DD");

  let value: any = dayjs(defaultData?.[field?.id]).format("YYYY-MM-DD");
  if (defaultData?.[field?.id] === undefined && data?.[field?.id] === undefined) {
    value = undefined;
  }
  if (data !== undefined && data?.[field?.id] !== undefined) {
    value = dayjs(data?.[field?.id]).format("YYYY-MM-DD");
  }
  return (
    <>
    <ERPInput
      id={field?.id}
      label={label}
      placeholder={field?.placeholder}
      disabled={disabled}
      // variant={variant}
      type={field.type}
      onChange={({ target }) => {
        if (target.value === "") {
          handleChange(target?.id, null);
        } else {
          handleChange(target?.id, dayjs(target.value).utc(true)?.format());
        }
      }}
      required={field?.required}
      min={
        field?.minDate
          ? dateTrimmer(field?.minDate)
          : field?.minDateKey
          ? dayjs(data?.[field?.minDateKey] ?? defaultData?.[field?.minDateKey]).format("YYYY-MM-DD")
          : ""
      }
      max={field?.maxDate && dateTrimmer(field?.maxDate)}
      // defaultValue={dayjs(defaultData?.[field?.id]).format("YYYY-MM-DD")}
      // value={dayjs(data?.[field?.id]).format("YYYY-MM-DD") || dayjs(defaultData?.[field?.id]).format("YYYY-MM-DD") || undefined}

      defaultValue={value == undefined ? "" : value}
      value={value == undefined ? "" : value}
    />
    <ERPElementValidationMessage validation={validation}></ERPElementValidationMessage>
    </>
  );
};

export default ERPDateInput;
