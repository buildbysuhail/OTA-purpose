# Service Transaction Implementation Plan

## Overview
Implement a "Service Transaction" feature based on the Windows Forms `frmServiceTransaction` with 5 tabs:
1. **Order** - Service order entry with customer details
2. **Service** - Service processing with spare parts inventory
3. **Agent Transfer** - Agent assignment for service work
4. **Invoice** - Billing and invoicing
5. **Reports** - Service transaction reports

## Architecture Decisions

### 1. State Management Approach
- Create a dedicated Redux slice for Service Transaction (`serviceTransactionSlice`)
- Similar pattern to `InventoryTransaction` slice but simpler
- Separate from the main inventory transaction as it has different data structure

### 2. File Structure
```
src/pages/inventory/transactions/service/
├── index.tsx                        # Main container with tabs
├── service-transaction-types.ts     # TypeScript interfaces
├── service-transaction-reducer.ts   # Redux slice
├── service-transaction-data.ts      # Initial state data
├── use-service-transaction.ts       # Main hook for business logic
├── tabs/
│   ├── order-tab.tsx               # Order tab component
│   ├── service-tab.tsx             # Service tab component
│   ├── agent-transfer-tab.tsx      # Agent Transfer tab
│   ├── invoice-tab.tsx             # Invoice tab
│   └── reports-tab.tsx             # Reports tab
└── components/
    ├── customer-form.tsx           # Reusable customer details form
    ├── service-history.tsx         # Service history sidebar
    └── spare-parts-grid.tsx        # Spare parts data grid
```

## Implementation Details

### Phase 1: Types & State Setup

#### service-transaction-types.ts
```typescript
// Service Transaction Master
interface ServiceTransactionMaster {
  serviceTransMasterID: number;
  jobNo: number;
  orderDate: string;
  branchID: number;
  ledgerID: number;         // Customer account
  customerName: string;
  address1: string;
  address2: string;
  mobile: string;
  phone: string;
  serviceID: number;        // Service type
  serviceName: string;
  productRemarks: string;
  serialNo: string;
  receivedItems: string;
  complaints: string;
  expectedDeliveryDate: string;
  advanceReceived: number;
  unitRate: number;
  isWarrantyService: boolean;
  status: ServiceStatus;
}

// Service Tab specific fields
interface ServiceDetails {
  serviceDoneDate: string;
  serviceCharge: number;
  consumedQtyAmount: number;
  warehouseID: number;
}

// Agent Transfer fields
interface AgentTransfer {
  agentID: number;
  agentName: string;
  despatchedDate: string;
  despatchedReturnDate: string;
  expectedDeliveryDate: string;
  agentCharge: number;
  status: ServiceStatus;
}

// Invoice fields
interface ServiceInvoice {
  invoiceDate: string;
  accountID: number;        // Payment account
  consumedQtyAmount: number;
  serviceCharge: number;
  total: number;
  cashReceived: number;
  balance: number;
  closingRemarks: string;
  remarks: string;
  remarks2: string;
}

// Spare parts used
interface ServiceSpareDetail {
  slNo: number;
  productID: number;
  productBatchID: number;
  pCode: string;
  barcode: string;
  product: string;
  qty: number;
  purchasePrice: number;
  total: number;
}

enum ServiceStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Transferred = 'Transferred',
  Invoiced = 'Invoiced'
}
```

### Phase 2: Redux Slice

Key actions needed:
- `setServiceTransaction` - Load existing transaction
- `clearServiceTransaction` - Reset for new
- `updateMasterField` - Update master fields
- `addSpareDetail` - Add spare part to grid
- `removeSpareDetail` - Remove spare part
- `updateSpareDetail` - Update spare part details
- `updateServiceDetails` - Update service tab fields
- `updateAgentTransfer` - Update agent transfer fields
- `updateInvoice` - Update invoice fields

### Phase 3: Tab Components

#### Order Tab
Form fields:
- Job No (auto-generated or manual entry)
- Date picker for order date
- Cash/Bank checkbox with ledger dropdown
- Customer details (Name, Address1, Address2, Mobile, Phone)
- Service dropdown
- Product Remarks, Serial No, Received Items, Complaints
- Expected Delivery Date
- Advance Received, Unit Rate
- Is Warranty Service checkbox
- History button to show previous services for serial number
- Action buttons: Save, Clear, Print, Delete, Close

#### Service Tab
Form fields:
- Job No (search field)
- Search In dropdown for filtering
- Service details (readonly from order)
- Status dropdown
- Expected Delivery Date
- Service Done Date
- Service Charge, Unit Rate
- Consumed Qty Amount
- Warehouse dropdown
- Spare Parts Grid (PCode, Barcode, Product, Qty, PPrice, Total)
- Action buttons: Save, Clear, Close

#### Agent Transfer Tab
Form fields:
- Job No (search field)
- Search In dropdown
- Date
- Agent Name dropdown with add button
- Despatched Return Date
- Expected Delivery Date
- Status dropdown
- Agent Charge, Unit Rate
- Consumed Qty Amount
- Is Warranty Service checkbox
- Action buttons: Save, Clear, Close

#### Invoice Tab
Form fields:
- Job No (search field)
- Search In dropdown
- Is Warranty Service checkbox
- Cash/Bank dropdown
- Customer details (readonly)
- Service, Complaints
- Account dropdown
- Remarks, Remarks2
- Consumed Qty Amount
- Date
- Closed With dropdown
- Service Charge, Total
- Advance Received
- Cash Received, Balance
- Print after save checkbox
- Action buttons: Print, Save, Clear, Delete, Close

#### Reports Tab
Form fields:
- From Date, To Date
- Status dropdown
- Show button
- Data grid with service report data
- Excel export button

### Phase 4: API Endpoints

Based on existing patterns, endpoints will be:
```
/Inventory/ServiceTransaction/Order/          - CRUD for orders
/Inventory/ServiceTransaction/Service/        - Update service details
/Inventory/ServiceTransaction/AgentTransfer/  - Agent transfer operations
/Inventory/ServiceTransaction/Invoice/        - Invoice operations
/Inventory/ServiceTransaction/Search/         - Search by job no
/Inventory/ServiceTransaction/History/        - Get history by serial no
/Inventory/RptInventoryReport/ServiceReport/  - Reports (existing)
```

### Phase 5: Route Configuration

Add to `transaction-routes.ts`:
```typescript
{
  transactionBase: TransactionBase.OtherTransactions,
  formCode: "SVT",
  action: UserAction.Show,
  voucherType: VoucherType.ServiceInventory,
  transactionType: "ServiceTransaction",
  formType: "",
  title: TransactionTitles.ServiceTransaction,
  drCr: "Dr",
  listTitle: TransactionListTitles.ServiceTransactions,
  icon: Wrench,
}
```

Add to `transaction-titles.ts`:
```typescript
ServiceTransaction: "Service Transaction",
```

### Phase 6: Side Menu Integration

Add menu item for Service Transaction under Inventory > Other Transactions

## Component Reuse

Existing components to reuse:
- `ERPTab` - Tab navigation
- `ERPInput` - Text inputs
- `ERPButton` - Action buttons
- `ERPDataCombobox` - Dropdowns with data
- `ERPDatePicker` - Date selection
- `ERPCheckbox` - Checkboxes
- `ERPNumericInput` - Number inputs
- `AccLedgerCombo` - Customer/account selection (pattern from Elements)
- `WarehouseCombo` - Warehouse selection
- `ErpDevGrid` / `ERPPurchaseGrid` - Data grids

## Estimated Files to Create/Modify

**New Files (10):**
1. `src/pages/inventory/transactions/service/index.tsx`
2. `src/pages/inventory/transactions/service/service-transaction-types.ts`
3. `src/pages/inventory/transactions/service/service-transaction-reducer.ts`
4. `src/pages/inventory/transactions/service/service-transaction-data.ts`
5. `src/pages/inventory/transactions/service/use-service-transaction.ts`
6. `src/pages/inventory/transactions/service/tabs/order-tab.tsx`
7. `src/pages/inventory/transactions/service/tabs/service-tab.tsx`
8. `src/pages/inventory/transactions/service/tabs/agent-transfer-tab.tsx`
9. `src/pages/inventory/transactions/service/tabs/invoice-tab.tsx`
10. `src/pages/inventory/transactions/service/tabs/reports-tab.tsx`

**Files to Modify (4):**
1. `src/components/common/content/transaction-routes.ts` - Add route
2. `src/components/common/content/transaction-titles.ts` - Add titles
3. `src/redux/store.ts` - Add reducer
4. `src/components/common/sidebar/sidemenu/sidemenu.tsx` - Add menu item

## Implementation Order

1. Create types file
2. Create initial data and reducer
3. Create main container with tab navigation
4. Implement Order tab (most complex, foundation for others)
5. Implement Service tab
6. Implement Agent Transfer tab
7. Implement Invoice tab
8. Implement Reports tab
9. Add routes and menu items
10. Testing and refinement

## Questions for Clarification

1. Should the spare parts grid in Service tab allow barcode scanning?
2. Is there a specific print template for service orders/invoices?
3. Should the history feature show services from all branches or current branch only?
4. Are there any specific validation rules for warranty vs non-warranty services?
