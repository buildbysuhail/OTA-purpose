import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams, useParams } from "react-router-dom";
import ERPDateInput from "./erp-date-input";
import ERPInput from "./erp-input";
import ERPMultipleDataList from "./erp-multiple-data-list";
import ERPSwitch from "./erp-switch";
import ERPTooltip from "./erp-tooltip";
import ERPDataCombobox from "./erp-data-combobox";
import ERPSelect from "./erp-select";
import ERPTextarea from "./erp-textarea";
import ERPCheckboxes from "./erp-checkboxes";

export interface fieldType {
  id: string;
  type:
    | "slider"
    | "switch"
    | "rating"
    | "image"
    | "select"
    | "list"
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "time"
    | "url"
    | "week"
    | "text"
    | "textarea"
    | "img-upload"
    | "file"
    | "uniqueId"
    | "ChartCode"
    | "dataList"
    | "multipleList"
    | "sales_person"
    | "payment_terms"
    | "peopleList"
    | "actionTextExpense"
    | "accountList"
    | "itemsList"
    | "barcode"
    | "tax_number"
    | "multiUnit"
    | "discountInput"
    | "accountsListWithCode"
    | "exchange_rate"
    | "accountsWithType"
    | "moreDetails"
    | "state"
    | "customFilter"
    | "ExpenseVendor"
    | "currency"
    | "customCombobox"
    | "assignOwnerDropDown";
  items?: any[];
  /**
   * @description title for field
   */
  title?: string;
  /**
   * @description label for field
   */
  label?: string;
  /**
   * @description The label to display when the switch is on.
   */
  onLabel?: string;
  /**
   * @description The label to display when the switch is off.
   */
  offLabel?: string;
  multiple?: boolean;
  row?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  defaultValue?: any;
  placeholder?: string;
  disabled?: boolean;
  style?: string;
  value?: any;
  readOnlyValue?: any;
  getter?: string;
  noLabel?: boolean;
  showWhen?: string;
  hideWhen?: string;
  disableWhen?: string;
  isBoolean?: boolean;
  peopleType?: string;
  accountCode?: number;
  hasDueDate?: boolean;
  includeOptions?: any[];
  initialValue?: any;
  showFirstItem?: boolean;
  hintAvailable?: boolean;
  hintMessage?: string;
  isPaginated?: boolean;
  should_track_inventory?: boolean;
  module?: "all" | "sales" | "purchase";
}

interface ERPTableProps {
  fieldClass: string;
  fields: Array<any>;
  loading?: boolean;
  data?: any;
  defaultData?: any;
  onChangeData?: (data: any) => void;
  path?: any;
  onChangeDefaultData?: any;
}

/**
 *
 * @param param0
 * @returns From based on field array.
 */
const ERPForm = ({ data, defaultData, onChangeData, onChangeDefaultData, ...props }: ERPTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  /**
   * Map changes to data object
   * @param id field key for maping data
   * @param value field value for maping data
   */
  const handleChange = (id: string, value: any) => {
    try {
      // Nested Object CODE
      if (id.includes(".")) {
        let fieldParent = id.split(".")?.[0];
        let fieldChild = id.split(".")?.[1];
        let fieldValue = { [fieldChild]: value };
        if (data?.[fieldParent]) {
          fieldValue = { ...data?.[fieldParent], [fieldChild]: value };
        }
        onChangeData && onChangeData({ ...data, [fieldParent]: fieldValue || "" });
      } else if (value === true || value === false) {
        onChangeData && onChangeData({ ...data, [id]: value });
      } else {
        onChangeData && onChangeData({ ...data, [id]: value || "" });
      }
      // NORMAL OBJECT CODE
      // onChangeData && onChangeData({ ...data, [id]: value || "" });
    } catch (error) {
      console.log(`ERPForm,  Error: `, error);
    }
  };

  const handleChangeBulkData = (datas: any) => {
    if (datas) {
      onChangeData && onChangeData({ ...data, ...datas });
    }
  };

  return (
    <div className={`capitalize  max-w-[1200px] ${props.fieldClass}`}>
      {props.fields.map((field: fieldType, index) => {
        const variant = "outlined";
        const label = (field.label || field.id)?.replaceAll("_", " ");
        const disabled = searchParams?.get("clone") ? false : props.loading || field.disabled || (defaultData && field?.disableWhen);

        // let value = defaultData?.[field.id];
        // if (data !== undefined && data?.[field.id] !== undefined) {
        // 	value = data?.[field.id];
        // }

        // Test Trail For Nested Data
        let value = defaultData?.[field?.id];
        if (field?.id?.includes(".")) {
          let fieldParent = field?.id?.split(".")?.[0];
          let fieldChild = field?.id?.split(".")?.[1];
          value = data?.[fieldParent]?.[fieldChild];
        } else {
          if (data !== undefined && data?.[field?.id] !== undefined) {
            value = data?.[field?.id];
          }
        }

        // Optional Rendering Fields
        let fieldType = "";
        if (field?.showWhen) {
          let checkerKey = field?.showWhen.split(":")?.[0];
          let checkerKey2 = field?.showWhen.split(":")?.[2];
          // let checkerValue: any = field?.showWhen.split(":")?.[1];

          let checkerValue = field?.isBoolean ? field?.showWhen.split(":")?.[1] === `true` : field?.showWhen.split(":")?.[1];
          let checkerValue2 = field?.isBoolean ? field?.showWhen.split(":")?.[3] === `true` : field?.showWhen.split(":")?.[3];

          // if (field?.isBoolean) {
          //   checkerValue = checkerValue === "true" ? true : false
          // }
          if (data?.[checkerKey] != undefined) {
            fieldType = data?.[checkerKey] == checkerValue ? field.type : "";
            // Second Condition applying for showWhen
            if (fieldType !== "" && checkerKey2 != undefined && checkerValue2 != undefined) {
              fieldType = data?.[checkerKey2] == checkerValue2 ? field.type : "";
            }
          } else {
            fieldType = defaultData?.[checkerKey] == checkerValue ? field.type : "";
            // Edit : Second Condition applying for showWhen
            if (fieldType !== "" && checkerKey2 != undefined && checkerValue2 != undefined) {
              fieldType = data?.[checkerKey2] == checkerValue2 ? field.type : "";
            }
          }
        } else if (field?.hideWhen) {
          fieldType = field?.hideWhen == "update" && params?.id ? "" : field?.type;
        } else {
          fieldType = field.type;
        }

        switch (fieldType) {
          case "checkbox":
            return (
              <ERPCheckboxes label={field?.label} items={field?.items} field={field} data={data} defaultData={defaultData} handleChange={handleChange} />
            );
          case "slider":
            return (
              <FormControl key={`tf_${index}`} fullWidth>
                <FormLabel id={field.id}>{label}</FormLabel>
                <Slider
                  onChange={({ target }, value) => handleChange(field?.id, value)}
                  id={"select-slider"}
                  defaultValue={50}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                />
              </FormControl>
            );
          case "radio":
            return (
              <FormControl key={`tf_${index}`}>
                <div className="flex items-center text-xs gap-10">
                  <FormLabel id={field.id} className="!text-xs">
                    {label} {field?.required && "*"}
                  </FormLabel>
                  <RadioGroup
                    row
                    defaultValue={value == undefined ? "" : value}
                    value={value == undefined ? "" : value}
                    aria-labelledby="radio-buttons-group-label"
                    onChange={(e) => handleChange(field?.id, e.target.value)}
                  >
                    {field?.items?.map((item: any, index: number) => (
                      <FormControlLabel
                        key={`rdl_${index}`}
                        className="dark:text-white !text-xs"
                        value={item?.value}
                        defaultChecked={index === 0}
                        control={<Radio size="small" color="primary" />}
                        label={item?.label}
                        disabled={disabled}
                      />
                    ))}
                  </RadioGroup>
                  {field?.hintAvailable && data?.pricing_type === "volume_pricing" && <ERPTooltip message={field?.hintMessage} />}
                </div>
              </FormControl>
            );
          case "switch":
            return (
              <ERPSwitch
                id={field.id}
                label={field?.label}
                title={field?.title}
                onLabel={field?.onLabel}
                offLabel={field.offLabel}
                value={value == undefined ? "" : value}
                defaultValue={value == undefined ? "" : value}
                onChange={(e) => handleChange(field?.id, e.target.checked)}
                required={field?.required}
              />
            );
          case "rating":
            return (
              <FormControl key={`tf_${index}`} fullWidth>
                <FormLabel id={field.id}>{label}</FormLabel>
                <Rating name={field.id} />{" "}
              </FormControl>
            );
          case "select":
            return (
              <FormControl key={`tf_${index}`} fullWidth>
                <InputLabel id={field?.id}>{label}</InputLabel>
                <Select onChange={({ target }) => handleChange(field?.id, target?.value)} labelId={field?.id} id={field?.id} label={label}>
                  {field?.items?.map((item: any, index: number) => (
                    <MenuItem key={`selm_${index}`} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );

          case "list":
            return (
              <ERPSelect
                handleChange={(id, value) => handleChange(field?.id, value?.value)}
                id={field?.id}
                key={`tf_${index}`}
                options={field.items || []}
                defaultValue={value == undefined ? (field?.showFirstItem && field?.items ? field?.items[0]?.value : "") : value}
                value={value == undefined ? "" : value}
                className={`${field?.style}`}
                field={field}
                required={field?.required}
                label={field?.label}
                // isOptionEqualToValue={(option, value) => option.value === value.value}
                // renderInput={(params) => (
                // 	<TextField {...params} required={field?.required} label={label} size="small" />
                // )}
                // inputProps={{ style: { fontSize: 14 } }} // font size of input text
                // InputLabelProps={{ style: { fontSize: 14 } }}
              />
            );

          case "dataList":
            return (
              <ERPDataCombobox
                id={field?.id}
                field={field}
                key={`cbi_${index}`}
                defaultData={defaultData}
                data={data}
                label={label}
                // defaultValue={value == undefined ? "" : value}
                // value={value == undefined ? "" : value}
                handleChange={handleChange}
                includeOptions={field?.includeOptions}
                disabled={disabled}
                isPaginated={field?.isPaginated}
              />
            );
          
          case "multipleList":
            return (
              <ERPMultipleDataList
                field={field}
                key={`tf_${index}`}
                defaultData={defaultData}
                data={data}
                label={label}
                handleChange={handleChange}
                inputProps={{ style: { fontSize: 14 } }} // font size of input text
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            );

          case "textarea":
            return (
              <ERPTextarea
                onChange={({ target }) => handleChange(target?.id, target.value)}
                rows={4}
                key={`tf_${index}`}
                id={field?.id}
                label={label}
                disabled={disabled}
                // defaultValue={value == undefined ? "" : value}
                value={value == undefined ? "" : value}
                required={field?.required}
              />
            );
          case "text" || "password" || "search" || "tel" || "url":
            return (
              <ERPInput
                onChange={({ target }) => handleChange(target?.id, target.value)}
                id={field?.id}
                label={label}
                disabled={disabled}
                type={field?.type}
                required={field?.required}
                // defaultValue={value == undefined ? "" : value}
                value={value == undefined ? "" : value}
                minLength={field?.minLength}
                maxLength={field?.maxLength}
                min={field?.min}
                max={field?.max}
                pattern={field?.pattern}
                key={`tfi_${index}`}
                placeholder={field?.placeholder}
                autoFocus={index == 0}
              />
            );
          case "email":
            return (
              <ERPInput
                onChange={({ target }) => handleChange(target?.id, target.value)}
                id={field?.id}
                label={label}
                disabled={disabled}
                type={field?.type}
                required={field?.required}
                defaultValue={value == undefined ? "" : value}
                value={value == undefined ? "" : value}
                minLength={field?.minLength}
                maxLength={field?.maxLength}
                min={field?.min}
                max={field?.max}
                pattern={field?.pattern}
                key={`tfi_${index}`}
                className="lowercase"
              />
            );
          case "number":
            return (
              <ERPInput
                onChange={({ target }) => handleChange(target?.id, target.value)}
                id={field?.id}
                label={label}
                disabled={disabled}
                type={field?.type}
                required={field?.required}
                defaultValue={value == undefined ? "" : value}
                value={value == undefined ? "" : value}
                minLength={field?.minLength}
                maxLength={field?.maxLength}
                min={field?.min}
                max={field?.max}
                pattern={field?.pattern}
                key={`tfi_${index}`}
              />
            );
          case "tel":
            return (
              <ERPInput
                onChange={({ target }) => handleChange(target?.id, target.value)}
                id={field?.id}
                label={label}
                disabled={disabled}
                type={field?.type}
                required={field?.required}
                defaultValue={value == undefined ? "" : value}
                value={value == undefined ? "" : value}
                minLength={field?.minLength}
                maxLength={field?.maxLength}
                min={field?.min}
                max={field?.max}
                pattern={field?.pattern}
                key={`tfi_${index}`}
              />
            );
          case "file":
            return (
              <FormControl key={`tf_${index}`} fullWidth>
                <Typography component="legend">{label}</Typography>
                <TextField
                  onChange={({ target }) => handleChange(target?.id, target.value)}
                  key={`tfi_${index}`}
                  disabled={disabled}
                  variant={variant}
                  type="file"
                />
              </FormControl>
            );
         
          case "date" || "datetime-local" || "time" || "month" || "week":
            return (
              <ERPDateInput
                key={`sti_${index}`}
                label={label}
                field={field}
                disabled={disabled}
                handleChange={handleChange}
                data={data}
                defaultData={defaultData}
              />
            );
          
          case "heading":
            return <p className="text-sm flex items-center col-start-1 col-end-4">{field?.label}</p>;
          case "":
            return;
        }
        return (
          <ERPInput
            onChange={({ target }) => handleChange(target?.id, target.value)}
            id={field?.id}
            label={label}
            disabled={disabled}
            type={field?.type}
            required={field?.required}
            defaultValue={value == undefined ? "" : value}
            value={value == undefined ? "" : value}
            minLength={field?.minLength}
            maxLength={field?.maxLength}
            min={field?.min}
            max={field?.max}
            pattern={field?.pattern}
            key={`tfi_${index}`}
            // autoFocus={index == 0 ? true : false}
          />
        );
      })}
    </div>
  );
};

export default ERPForm;
