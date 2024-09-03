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
import { useParams, useSearchParams } from "react-router-dom";
import ERPTooltip from "./erp-tooltip";
import ERPSwitch from "./erp-switch";
import ERPInput from "./erp-input";

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

interface SBTableProps {
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
const ERPForm = ({ data, defaultData, onChangeData, onChangeDefaultData, ...props }: SBTableProps) => {
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
          // case "checkbox":
          //   return (
          //     <SBCheckbox label={field?.label} items={field?.items} field={field} data={data} defaultData={defaultData} handleChange={handleChange} />
          //   );
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
                  {field?.hintAvailable && <ERPTooltip message={field?.hintMessage} />}
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
          // case "image":
          //   return (
          //     <TGImageUpload
          //       key={`imgupl_${index}`}
          //       id={field?.id}
          //       label={field?.label}
          //       defaultValue={value === undefined ? "" : value}
          //       onChange={(e: any) => handleChange(field?.id, e.target.files[0])}
          //       required={field?.required}
          //       handleChange={handleChange}
          //     />
          //   );
          // case "associate_tags":
          //   return <TGAssociatedTags key={`AST_${index}`} defaultData={defaultData} />;
          // case "tax_number":
          //   return (
          //     <ERPTaxNumber
          //       id={field?.id}
          //       label={field?.label}
          //       defaultData={defaultData}
          //       data={data}
          //       defaultValue={value === undefined ? "" : value}
          //       onChange={(e: any) => handleChange(field?.id, e.target.value)}
          //       handleBulkChange={handleChangeBulkData}
          //     />
          //   );
          // case "rating":
          //   return (
          //     <FormControl key={`tf_${index}`} fullWidth>
          //       <FormLabel id={field.id}>{label}</FormLabel>
          //       <Rating name={field.id} />{" "}
          //     </FormControl>
          //   );
          // case "select":
          //   return (
          //     <FormControl key={`tf_${index}`} fullWidth>
          //       <InputLabel id={field?.id}>{label}</InputLabel>
          //       <Select onChange={({ target }) => handleChange(field?.id, target?.value)} labelId={field?.id} id={field?.id} label={label}>
          //         {field?.items?.map((item: any, index: number) => (
          //           <MenuItem key={`selm_${index}`} value={item}>
          //             {item}
          //           </MenuItem>
          //         ))}
          //       </Select>
          //     </FormControl>
          //   );

          // case "list":
          //   return (
          //     <SBSelect
          //       handleChange={(id, value) => handleChange(field?.id, value?.value)}
          //       id={field?.id}
          //       key={`tf_${index}`}
          //       options={field.items || []}
          //       defaultValue={value == undefined ? (field?.showFirstItem && field?.items ? field?.items[0]?.value : "") : value}
          //       value={value == undefined ? "" : value}
          //       className={`${field?.style}`}
          //       field={field}
          //       required={field?.required}
          //       label={field?.label}
          //       // isOptionEqualToValue={(option, value) => option.value === value.value}
          //       // renderInput={(params) => (
          //       // 	<TextField {...params} required={field?.required} label={label} size="small" />
          //       // )}
          //       // inputProps={{ style: { fontSize: 14 } }} // font size of input text
          //       // InputLabelProps={{ style: { fontSize: 14 } }}
          //     />
          //   );

          // case "dataList":
          //   return (
          //     <SBDataCombobox
          //       id={field?.id}
          //       field={field}
          //       key={`cbi_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       // defaultValue={value == undefined ? "" : value}
          //       // value={value == undefined ? "" : value}
          //       handleChange={handleChange}
          //       includeOptions={field?.includeOptions}
          //       disabled={disabled}
          //       isPaginated={field?.isPaginated}
          //     />
          //   );

          // case "PlaceOfSupply":
          //   return (
          //     <ERPPlaceOfSupply
          //       id={field?.id}
          //       field={field}
          //       key={`Pos_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       handleChange={handleChange}
          //       onChangeData={onChangeData}
          //     />
          //   );

          // case "reason":
          //   return (
          //     <TGInventoryReason
          //       id={field?.id}
          //       field={field}
          //       key={`rsn_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       handleChange={handleChange}
          //     />
          //   );
          // case "managableDatalist":
          //   return (
          //     <TGSalesPerson
          //       id={field?.id}
          //       field={field}
          //       key={`mdl_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       handleChange={handleChange}
          //       onChangeData={onChangeData}
          //       onChangeDefaultData={onChangeDefaultData}
          //     />
          //   );
          // case "employee":
          //   return (
          //     <TGEmployee
          //       id={field?.id}
          //       field={field}
          //       key={`rsn_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       handleChange={handleChange}
          //     />
          //   );
          // case "customTaxDataList":
          //   return (
          //     <ERPCustomTaxDataList
          //       id={field?.id}
          //       field={field}
          //       key={`cbi_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       handleChange={handleChange}
          //       onChangeDefaultData={onChangeDefaultData}
          //       includeOptions={field?.includeOptions}
          //     />
          //   );
          // case "ZoneInput":
          //   return (
          //     <TGZoneInput
          //       id={field?.id}
          //       field={field}
          //       onChange={(branches) => handleChange(field?.id, branches)}
          //       key={`cbi_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       // label={label}
          //       // defaultValue={value == undefined ? "" : value}
          //       // value={value == undefined ? "" : value}
          //       // handleChange={handleChange}
          //     />
          //   );
          // case "multiUnit":
          //   return (
          //     <MultiUnitInput
          //       id={field?.id}
          //       field={field}
          //       key={`cbi_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       defaultValue={value == undefined ? "" : value}
          //       value={value == undefined ? "" : value}
          //       handleChange={handleChange}
          //       onChangeData={(unitData) => onChangeData?.({ ...data, ...unitData })}
          //     />
          //   );
          // case "tradeInfo":
          //   return (
          //     <TradeInfoInput
          //       data={data}
          //       onChangeData={(tradeData) => onChangeData?.({ ...data, ...tradeData })}
          //       // id={field?.id}
          //       // field={field}
          //       key={`cbi_${index}`}
          //       defaultData={defaultData}
          //       // data={data}
          //       // label={label}
          //       // defaultValue={value == undefined ? "" : value}
          //       // value={value == undefined ? "" : value}
          //       handleChange={handleChange}
          //       // onChangeData={(unitData) => onChangeData?.({ ...data, ...unitData })}
          //     />
          //   );
          // case "exchange_rate":
          //   return (
          //     <TGExchangeRate
          //       onChange={({ target }: any) => handleChange(target?.id, target?.value)}
          //       field={field}
          //       data={data}
          //       defaultData={defaultData}
          //       id={field?.id}
          //     />
          //   );
          // case "ExpenseVendor":
          //   return (
          //     <ERPExpenseVendor
          //       field={field}
          //       index={index}
          //       label={label}
          //       data={data}
          //       defaultData={defaultData}
          //       handleChange={handleChange}
          //       handleChangeBulkData={handleChangeBulkData}
          //     />
          //   );
          // case "expenseIsTax":
          //   return <TGExpenseTax field={field} data={data} defaultData={defaultData} handleChange={handleChange} />;
          // case "billableCustomer":
          //   return <ERPBillableCustomer field={field} data={data} defaultData={defaultData} onChangeData={onChangeData} label={field?.label} />;
          // case "accountsList":
          //   return (
          //     <AccountsInput
          //       id={field?.id}
          //       field={field}
          //       key={`acci_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       defaultValue={value == undefined ? field?.defaultValue ?? "" : value}
          //       value={value == undefined ? "" : value}
          //       handleChange={handleChange}
          //       initialValueCode={field?.initialValue}
          //     />
          //   );

          // case "accountsListWithCode":
          //   return (
          //     <AccountsByCodeInput
          //       account_code={field?.accountCode || 0}
          //       id={field?.id}
          //       field={field}
          //       label={field?.label}
          //       disabled={disabled}
          //       data={data}
          //       onChangeData={onChangeData}
          //       defaultData={defaultData}
          //       noLabel={field?.noLabel}
          //     />
          //   );

          // case "accountsWithType":
          //   return (
          //     <AccountsByTypeInput
          //       key={`AWT_${index}`}
          //       // account_code={field?.accountCode || 0}
          //       id={field?.id}
          //       field={field}
          //       label={field?.label}
          //       disabled={disabled}
          //       data={data}
          //       onChangeData={onChangeData}
          //       defaultData={defaultData}
          //       initialValueCode={field?.initialValue}
          //     />
          //   );
          // case "accountsGroup":
          //   return (
          //     <AccountsByGroupInput
          //       // account_code={field?.accountCode || 0}
          //       id={field?.id}
          //       field={field}
          //       label={field?.label}
          //       disabled={disabled}
          //       data={data}
          //       handleChangeBulkData={handleChangeBulkData}
          //       defaultData={defaultData}
          //       initialValueCode={field?.initialValue}
          //     />
          //   );
          // case "multipleList":
          //   return (
          //     <SBMultipleDataList
          //       field={field}
          //       key={`tf_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       handleChange={handleChange}
          //       inputProps={{ style: { fontSize: 14 } }} // font size of input text
          //       InputLabelProps={{ style: { fontSize: 14 } }}
          //     />
          //   );
          // case "PeopleCurrency":
          //   return <ERPPeopleCurrency field={field} data={data} defaultData={defaultData} handleChange={handleChange} onChangeData={onChangeData} />;
          // case "exchangeRate":
          //   return <ERPPeopleExchangeRate data={data} defaultData={defaultData} onChangeData={onChangeData} />;
          // case "assignOwnerDropDown":
          //   return <ERPAssignOwner data={data} defaultData={defaultData} onChangeData={onChangeData} field={field} />;
          // case "currency":
          //   return (
          //     <ERPCurrency
          //       id={field?.id}
          //       field={field}
          //       key={`cbi_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       // defaultValue={value == undefined ? "" : value}
          //       // value={value == undefined ? "" : value}
          //       handleChange={handleChange}
          //       includeOptions={field?.includeOptions}
          //       disabled={disabled}
          //       onChangeData={onChangeData}
          //     />
          //   );

          // case "textarea":
          //   return (
          //     <SBTextarea
          //       onChange={({ target }) => handleChange(target?.id, target.value)}
          //       rows={4}
          //       key={`tf_${index}`}
          //       id={field?.id}
          //       label={label}
          //       disabled={disabled}
          //       // defaultValue={value == undefined ? "" : value}
          //       value={value == undefined ? "" : value}
          //       required={field?.required}
          //     />
          //   );
          // case "barcode":
          //   return (
          //     <BarcodeInput
          //       onChange={({ target }) => handleChange(target?.id, target.value)}
          //       //   rows={4}
          //       key={`tf_${index}`}
          //       fieldId={field?.id}
          //       label={label}
          //       disabled={disabled}
          //       defaultValue={value == undefined ? "" : value}
          //       value={value == undefined ? "" : value}
          //     />
          //   );
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
          // case "img-upload":
          //   return (
          //     <SBImgUploadInput
          //       defaultUrl={value || undefined}
          //       onFinishUpload={(path) => handleChange(field?.id, path)}
          //       disabled={disabled}
          //       label={label}
          //       key={`tf_${index}`}
          //     />
          //   );
          // case "date" || "datetime-local" || "time" || "month" || "week":
          //   return (
          //     <SBDateInput
          //       key={`sti_${index}`}
          //       label={label}
          //       field={field}
          //       disabled={disabled}
          //       handleChange={handleChange}
          //       data={data}
          //       defaultData={defaultData}
          //     />
          //   );
          // // ERP COMPONENTS
          // case "payment_terms":
          //   return (
          //     <ERPPaymentTerms
          //       field={field}
          //       key={`pt_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       hasDueDate={field?.hasDueDate}
          //       onChangeData={onChangeData}
          //       handleChange={handleChange}
          //     />
          //   );
          // case "sales_person":
          //   return (
          //     <ERPSalesPersonField
          //       key={`ept_${index}`}
          //       data={data}
          //       id={field?.id}
          //       onChange={({ target }: any) => handleChange(target?.id, target?.value)}
          //     />
          //   );
          // case "uniqueId":
          //   return (
          //     <ERPIdFields
          //       key={`tf_${index}`}
          //       onChange={({ target }: any) => handleChange(target?.id, target?.value)}
          //       id={field?.id}
          //       label={label}
          //       disabled={disabled}
          //       variant={variant}
          //       type={field.type}
          //       field={field}
          //       data={data}
          //       defaultData={defaultData}
          //     />
          //   );
          // case "ChartCode":
          //   return (
          //     <ERPChartofAccountCodeField
          //       key={`ch_${index}`}
          //       onChange={({ target }: any) => handleChange(target?.id, target?.value)}
          //       onChangeData={onChangeData}
          //       id={field?.id}
          //       label={label}
          //       disabled={disabled}
          //       variant={variant}
          //       type={field.type}
          //       field={field}
          //       data={data}
          //       defaultData={defaultData}
          //     />
          //   );
          // case "peopleList":
          //   return (
          //     <ERPCustomerList
          //       field={field}
          //       peopleType={field?.peopleType}
          //       key={`ptf_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       handleChange={handleChange}
          //       onChangeData={onChangeData}
          //       autoFocus={index === 0}
          //     />
          //   );
          // case "actionTextExpense":
          //   return <ERPExpensetoggler handleChange={handleChange} field={field} />;
          // case "accountList":
          //   return <ERPAccountList />;
          // case "discountInput":
          //   return <ERPDiscountInput key={`disInp_${index}`} field={field} handleChange={handleChange} defaultData={defaultData} data={data} />;
          // case "deliver_to":
          //   return <ERPDeliverTo handleChange={handleChange} data={data} defaultData={defaultData} />;
          // case "itemize":
          //   return <ERPItemize handleChange={handleChange} data={data} defaultData={defaultData} />;
          // case "amountWithDue":
          //   return (
          //     <ERPAmountWithDue
          //       key={`tfi_${index}`}
          //       data={data}
          //       label={label}
          //       id={field?.id}
          //       disabled={disabled}
          //       defaultData={defaultData}
          //       required={field?.required}
          //       handleChange={handleChange}
          //       value={value == undefined ? "" : value}
          //       defaultValue={value == undefined ? "" : value}
          //       onChange={({ target }) => handleChange(target?.id, parseFloat(target.value) < 0 ? 0 : parseFloat(target?.value))}
          //       onBlur={(id: any, value: any) => handleChange(id, value)}
          //     />
          //   );
          // case "customCombobox":
          //   return (
          //     <ERPCustomCombobox
          //       id={field?.id}
          //       field={field}
          //       key={`cbic_${index}`}
          //       defaultData={defaultData}
          //       data={data}
          //       label={label}
          //       disabled={disabled}
          //       handleChange={handleChange}
          //       includeOptions={field?.includeOptions}
          //     />
          //   );
          // case "paymentTerms":
          //   return (
          //     <TGPaymentTerms
          //       id={field?.id}
          //       field={field}
          //       data={data}
          //       label={label}
          //       defaultData={defaultData}
          //       includeOptions={field?.includeOptions}
          //       onChangeData={onChangeData}
          //     />
          //   );
          // // case "associatedTags":
          // //   return <ERPAssocitatedTags />;
          // case "state":
          //   return <ERPStateComponent data={data} defaultData={defaultData} id={field?.id} field={field} handleChange={handleChange} />;
          // case "moreDetails":
          //   return <TGFieldToggler data={data} id={field?.id} field={field} toggle={onChangeData} />;
          // case "recurringDates":
          //   return (
          //     <RecurringDateSelector
          //       key={field?.id}
          //       field={field}
          //       data={data}
          //       defaultData={defaultData}
          //       handleChange={handleChange}
          //       onChangeData={onChangeData}
          //     />
          //   );
          // case "reverseCharge":
          //   return (
          //     <ERPReverseChargeHandle
          //       key={`RVC-${index}`}
          //       data={data}
          //       id={field?.id}
          //       field={field}
          //       handleChange={handleChange}
          //       defaultData={defaultData}
          //     />
          //   );
          // case "LockingDateSelector":
          //   return <ERPLockingDateSelector data={data} handleChange={handleChange} onChangeData={onChangeData} />;
          // case "ListItems":
          //   return (
          //     <ERPSearchHLUI
          //       data={data}
          //       label={label}
          //       field={field}
          //       key={field?.id}
          //       module={field?.module}
          //       noLabel={field?.noLabel}
          //       placeholder={field?.placeholder}
          //       checkInventoryTracking={{ value: field?.should_track_inventory ? true : false, condition: field?.should_track_inventory ?? false }}
          //       onChangeID={(value: number) => onChangeData?.({ ...data, [field?.id]: value })}
          //       className="w-full appearance-none rounded border border-gray-300 h-9 outline-0 px-3 py-2 text-xs"
          //     />
          //   );
          // case "salesReturnInvoice":
          //   return <TGInvoiceField data={data} defaultData={defaultData} field={field} />;
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
