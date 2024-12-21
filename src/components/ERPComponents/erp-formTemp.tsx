// // ERP COMPONENTS
// case "img-upload":
//   return (
//     <ERPImgUploadInput
//       defaultUrl={value || undefined}
//       onFinishUpload={(path) => handleChange(field?.id, path)}
//       disabled={disabled}
//       label={label}
//       key={`tf_${index}`}
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
//       onChange={(e: any) => handleChange(field?.id, e.target?.value)}
//       handleBulkChange={handleChangeBulkData}
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
//   case "PlaceOfSupply":
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