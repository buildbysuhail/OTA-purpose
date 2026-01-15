# RPOS Architecture Design Document

## Executive Summary

Converting a WinForms RPOS to modern React TypeScript web application **as part of integrated ERP solution** with focus on:
- **Best UI/UX Experience** - Instant renders, optimistic updates, skeleton loaders
- **Data Integrity** - Server as ALWAYS source of truth, proper validation
- **Security** - Controlled API access, proper authentication
- **Performance** - Minimal API calls, intelligent caching (NOT offline-first)
- **Scalability** - Industrial standard patterns
- **ERP Integration** - Shared data, consistent state across modules

---

## APPLICATION ROUTING STRUCTURE

### **Root Application Flow**

```
src/App.tsx (Root)
    │
    ├── /login                    → Login Page
    ├── /logout                   → Logout Page
    ├── /select-organization      → Org Selection
    ├── /pos                      → Quick POS (TransactionForm)
    │
    ├── /rpos/*                   → RPosLayout (Our Focus)
    │   ├── RPosHeader            → Header with navigation
    │   └── RPosContent           → Route-based content
    │
    ├── /settings/_/*             → SettingsLayout
    ├── /reports/_/*              → ReportsLayout
    ├── /account-settings/*       → AccountSettingsLayout
    └── /*                        → Main Layout (ERP Dashboard)
```

### **RPOS Module Routing**

```
URL: /rpos/*
    │
    ├── src/App.tsx
    │       └── <Route path="rpos/*" element={<RPosLayout />} />
    │
    ├── src/components/common/layout/rpos-layout.tsx
    │       ├── <RPosHeader />      → Top navigation bar
    │       └── <RPosContent />     → Nested routes
    │
    └── src/components/common/content/rpos-content.tsx
            └── <Routes>
                ├── /              → POS (rpos.tsx) - Main order entry
                ├── /table-view    → RPosTableView - Table selection
                ├── /live-view     → RPosLiveView - Kitchen display
                ├── /operations    → Operations - Day-end operations
                ├── /orders        → RPosOrders - Order history
                ├── /shortkeys     → ShortKeys - Keyboard shortcuts
                ├── /kots          → Kots - KOT management
                ├── /customers     → Customers - Customer lookup
                ├── /customorder-status → CustomOrderStatus
                ├── /payments      → Payments - Payment processing
                └── /deliveryboy   → Deliveryboy - Delivery assignment
```

### **Visual Component Hierarchy**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         RPosLayout                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                      RPosHeader                                  │  │  │
│  │  │  ┌──────────┬─────────┬─────────┬────────────────────────────┐  │  │  │
│  │  │  │ Menu     │New Order│Bill No  │ Icons (Print, Settings...) │  │  │  │
│  │  │  └──────────┴─────────┴─────────┴────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                      RPosContent                                 │  │  │
│  │  │                                                                  │  │  │
│  │  │     ┌─────────────────────────────────────────────────────┐     │  │  │
│  │  │     │              Current Route Component                │     │  │  │
│  │  │     │                                                     │     │  │  │
│  │  │     │   /         → rpos.tsx (Main POS Screen)            │     │  │  │
│  │  │     │   /table-view → rpos-table-view.tsx                 │     │  │  │
│  │  │     │   /live-view  → live-view.tsx                       │     │  │  │
│  │  │     │   /operations → operations.tsx                      │     │  │  │
│  │  │     │   /orders     → orders.tsx                          │     │  │  │
│  │  │     │   /kots       → kots.tsx                            │     │  │  │
│  │  │     │   etc...                                            │     │  │  │
│  │  │     └─────────────────────────────────────────────────────┘     │  │  │
│  │  │                                                                  │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### **Key Files Reference**

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root application, defines `/rpos/*` route |
| `src/components/common/layout/rpos-layout.tsx` | RPOS wrapper with header |
| `src/components/common/header/rpos-header.tsx` | Top navigation bar |
| `src/components/common/content/rpos-content.tsx` | Route definitions for RPOS |
| `src/pages/rpos/rpos.tsx` | Main POS order entry screen |
| `src/pages/rpos/*.tsx` | Individual RPOS feature pages |

---

## RTK QUERY CACHING FLOW (DETAILED)

### **Complete Data Flow Diagram**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT LIFECYCLE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. COMPONENT MOUNTS                                                         │
│     │                                                                        │
│     ▼                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  const { data, isLoading } = useGetProductGroupsQuery()              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│     │                                                                        │
│     ▼                                                                        │
│  2. RTK QUERY CHECKS REDUX STORE                                             │
│     │                                                                        │
│     ├─── Cache Key: "getProductGroups(undefined)"                           │
│     │                                                                        │
│     ▼                                                                        │
│  ┌─────────────────────┐         ┌─────────────────────┐                    │
│  │   CACHE HIT         │         │   CACHE MISS        │                    │
│  │   (Data exists)     │         │   (First time)      │                    │
│  └─────────┬───────────┘         └─────────┬───────────┘                    │
│            │                               │                                 │
│            ▼                               ▼                                 │
│  ┌─────────────────────┐         ┌─────────────────────┐                    │
│  │ Return cached data  │         │ Call rposBaseQuery  │                    │
│  │ IMMEDIATELY         │         │ isLoading = true    │                    │
│  │ isLoading = false   │         └─────────┬───────────┘                    │
│  └─────────────────────┘                   │                                 │
│                                            ▼                                 │
│                                  ┌─────────────────────┐                    │
│                                  │ APIClient.getAsync  │                    │
│                                  │ HTTP GET Request    │                    │
│                                  └─────────┬───────────┘                    │
│                                            │                                 │
│                                            ▼                                 │
│                                  ┌─────────────────────┐                    │
│                                  │ Response Received   │                    │
│                                  └─────────┬───────────┘                    │
│                                            │                                 │
│                                            ▼                                 │
│  3. STORE IN REDUX                                                           │
│     │                                                                        │
│     │  Redux Store:                                                         │
│     │  {                                                                    │
│     │    rposApi: {                                                         │
│     │      queries: {                                                       │
│     │        "getProductGroups(undefined)": {                               │
│     │          status: "fulfilled",                                         │
│     │          data: [{ groupId: 1, name: "Chinese" }, ...],               │
│     │          fulfilledTimeStamp: 1736697600000                            │
│     │        }                                                              │
│     │      },                                                               │
│     │      subscriptions: { ... }                                           │
│     │    }                                                                  │
│     │  }                                                                    │
│     │                                                                        │
│     ▼                                                                        │
│  4. COMPONENT RE-RENDERS                                                     │
│     │                                                                        │
│     │  { data: [...], isLoading: false, isSuccess: true }                   │
│     │                                                                        │
│     ▼                                                                        │
│  5. UI DISPLAYS DATA                                                         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### **Cache Expiration Timeline**

```
keepUnusedDataFor: 300 seconds (5 minutes default)

Timeline Example:
─────────────────────────────────────────────────────────────────────────────

Time 0:00   │ Component A mounts
            │ useGetProductGroupsQuery() called
            │ Cache MISS → API call made
            │ Data stored in Redux, Subscription count: 1
            │
Time 0:30   │ User navigates away (to /rpos/table-view)
            │ Component A unmounts
            │ Subscription count: 0
            │ ⏱️ 300 second countdown STARTS
            │
Time 2:00   │ User returns to /rpos
            │ Component A mounts again
            │ Subscription count: 1
            │ ⏱️ Countdown CANCELLED
            │ Cache HIT → No API call, instant data!
            │
Time 2:30   │ User navigates away again
            │ Subscription count: 0
            │ ⏱️ 300 second countdown RESTARTS
            │
Time 7:30   │ 300 seconds passed with no subscribers
            │ Cache entry REMOVED from Redux store
            │
Time 8:00   │ User returns to /rpos
            │ Cache MISS → Fresh API call made
            │
─────────────────────────────────────────────────────────────────────────────
```

### **Why NOT to Use getWithCacheAsync with RTK Query**

```
❌ WRONG: Double Caching (Causes Issues)
──────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│  Component calls useGetProductGroupsQuery()                                  │
│      ↓                                                                       │
│  RTK Query checks Redux → Cache MISS                                         │
│      ↓                                                                       │
│  Calls rposBaseQuery → apiClient.getWithCacheAsync()                        │
│      ↓                                                                       │
│  getWithCacheAsync checks IndexedDB → Cache HIT (stale data!)               │
│      ↓                                                                       │
│  Returns STALE IndexedDB data                                               │
│      ↓                                                                       │
│  RTK Query stores STALE data in Redux                                       │
│      ↓                                                                       │
│  Component shows OUTDATED information! ❌                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Problems:
1. Two caches with different TTLs → Inconsistent data
2. IndexedDB may have stale data that RTK Query thinks is fresh
3. Cache invalidation becomes impossible to manage
4. Mutations don't invalidate IndexedDB cache

✅ CORRECT: Single Layer Caching (RTK Query Only)
──────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│  Component calls useGetProductGroupsQuery()                                  │
│      ↓                                                                       │
│  RTK Query checks Redux → Cache HIT or MISS                                 │
│      ↓                                                                       │
│  If MISS: Calls rposBaseQuery → apiClient.getAsync() (no cache)             │
│      ↓                                                                       │
│  Fresh data from server                                                     │
│      ↓                                                                       │
│  RTK Query stores in Redux with timestamp                                   │
│      ↓                                                                       │
│  Component shows FRESH data ✅                                              │
│      ↓                                                                       │
│  Mutations automatically invalidate via tags                                │
└─────────────────────────────────────────────────────────────────────────────┘

Benefits:
1. Single source of truth for cache
2. Automatic invalidation via tags
3. Consistent TTL management
4. DevTools visibility
```

### **Cache Tag Invalidation Flow**

```
Mutation with invalidatesTags: ["PendingOrders", "Tables"]
──────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────────────┐
│  User clicks "Save Order" button                                            │
│      ↓                                                                       │
│  useSaveOrderMutation() triggered                                           │
│      ↓                                                                       │
│  POST /RPOS/Order/Save                                                      │
│      ↓                                                                       │
│  Server responds: { success: true, voucherNumber: "INV001" }                │
│      ↓                                                                       │
│  RTK Query sees: invalidatesTags: ["PendingOrders", "Tables"]               │
│      ↓                                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  AUTOMATIC CACHE INVALIDATION                                      │     │
│  │                                                                    │     │
│  │  Queries with providesTags: ["PendingOrders"] → MARKED STALE       │     │
│  │  Queries with providesTags: ["Tables"] → MARKED STALE              │     │
│  │                                                                    │     │
│  │  If any component is currently subscribed to these queries:        │     │
│  │  → Automatic REFETCH triggered                                     │     │
│  │  → UI updates with fresh data                                      │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## WINFORMS TO REACT CONVERSION STRATEGY

### **Phase 1: Foundation (COMPLETED ✅)**

| Task | Status | Files |
|------|--------|-------|
| Type definitions | ✅ Done | `type/*.ts` |
| Initial state data | ✅ Done | `type/rpos-type-data/*.ts` |
| UI Reducer | ✅ Done | `reducers/ui-reducer.ts` |
| Operational Reducer | ✅ Done | `reducers/operational-reducer.ts` |
| Transaction Reducer | ✅ Done | `reducers/transaction-reducer.ts` |
| RTK Query API | ✅ Done | `api/rpos-api.ts` |
| Base Query | ✅ Done | `api/base-query.ts` |
| Store Registration | ✅ Done | `redux/dynamic-store-manager-pro.ts` |
| Main POS Screen | ✅ Done | `rpos.tsx` |

### **Phase 2: Feature Implementation (IN PROGRESS)**

```
Priority Order (Based on WinForms Usage):
─────────────────────────────────────────

1. ORDER ENTRY (rpos.tsx) ← CURRENT FOCUS
   ├── Product group sidebar ✅
   ├── Product grid with RTK Query ✅
   ├── Order items list ✅
   ├── Quantity +/- buttons ✅
   ├── Payment section ✅
   ├── Save/KOT mutations ✅
   ├── Search with lazy query ✅
   └── Pending: Barcode scanner, Modifiers, Combos

2. TABLE VIEW (rpos-table-view.tsx)
   ├── Table layout grid
   ├── Table status colors
   ├── Pending orders on table
   └── Table merge/split

3. KOT MANAGEMENT (kots.tsx)
   ├── KOT queue display
   ├── Kitchen-wise filtering
   ├── KOT status updates
   └── Print KOT functionality

4. LIVE VIEW (live-view.tsx)
   ├── Kitchen display
   ├── Real-time order updates
   ├── Order ready notifications
   └── WebSocket integration

5. SETTLEMENT (payments.tsx)
   ├── Multi-order settlement
   ├── Payment split
   ├── Cash/Card/UPI handling
   └── Day-end closing

6. OPERATIONS (operations.tsx)
   ├── Day close
   ├── Shift management
   ├── Reports
   └── Cash drawer operations
```

### **Conversion Mapping: WinForms → React**

```
WinForms Pattern                    →    React Pattern
────────────────────────────────────────────────────────────────

Form State Variables                →    Redux State (3-tier)
  Private bool isTableSelected      →    state.operational.dining.isTableSelected
  Private string tableNo            →    state.operational.dining.tableNo
  Private decimal totalAmount       →    state.transaction.summary.grandTotal

Event Handlers                      →    useCallback Handlers
  Private Sub btnSave_Click()       →    const handleSave = useCallback(...)
  Private Sub txtSearch_TextChanged →    const handleSearch = useCallback(...)

Data Binding                        →    useSelector + RTK Query
  BindingSource productBinding      →    const { data } = useGetProductsQuery()
  DataGridView.DataSource = ...     →    {products.map(p => <ProductCard />)}

Modal Dialogs                       →    UI State + Conditional Render
  frmTableSelect.ShowDialog()       →    dispatch(openPanel("tableSelect"))
                                         {panels.tableSelect && <TablePanel />}

API Calls                           →    RTK Query Hooks
  Dim result = Await api.GetAsync   →    const { data } = useGetProductGroupsQuery()
  Await api.PostAsync(...)          →    const [save] = useSaveOrderMutation()

Timers / Polling                    →    RTK Query pollingInterval
  Timer1.Interval = 30000           →    useGetTablesQuery(undefined, {
  Timer1.Tick += RefreshTables          pollingInterval: 30000
                                     })

Print Templates                     →    IndexedDB Cache + Lazy Load
  LoadTemplate("KOT.html")          →    const template = await cacheService
                                           .getPrintTemplate("KOT")
```

### **State Migration Guide**

```typescript
// WinForms: Scattered state across forms and modules
// ─────────────────────────────────────────────────
// frmRPOS.cs:
//   Private tableNo As String
//   Private serveType As String
//   Private orderItems As List(Of OrderItem)
//   Private isTableSelected As Boolean
//
// clsConfig.cs:
//   Public Shared printAfterSave As Boolean
//   Public Shared defaultPriceCategory As Integer

// React: Organized 3-Tier State
// ─────────────────────────────
// Tier 1: UI State (ephemeral)
interface RPosUIState {
  flags: { showPaymentPanel: boolean; showKitchenMessage: boolean };
  panels: { tableSelect: boolean; customerSearch: boolean };
  loading: { savingOrder: boolean; loadingProducts: boolean };
  search: { productSearchQuery: string };
}

// Tier 2: Operational State (session)
interface RPosOperationalState {
  dining: { tableNo: string; serveType: ServeType; isTableSelected: boolean };
  session: { waiterId: number; shiftId: number };
  printConfig: { printAfterSave: boolean };
  productConfig: { defaultPriceCategoryId: number };
}

// Tier 3: Transaction State (server-synced)
interface RPosTransactionState {
  activeOrder: { items: RPosOrderItem[]; isDirty: boolean };
  summary: { subTotal: number; grandTotal: number };
  payment: { payType: string; cashReceived: number };
}
```

### **Component Structure Pattern**

```
Feature: Order Entry Screen
─────────────────────────────

src/pages/rpos/
├── rpos.tsx                      # Main container (smart component)
│   ├── Uses Redux selectors
│   ├── Uses RTK Query hooks
│   ├── Dispatches actions
│   └── Composes child components
│
├── components/                   # Presentation components (dumb)
│   ├── ProductSidebar.tsx        # Category list
│   ├── ProductGrid.tsx           # Product buttons
│   ├── OrderItemsTable.tsx       # Order items list
│   ├── PaymentPanel.tsx          # Payment section
│   └── ActionButtons.tsx         # Save/KOT/Hold buttons
│
├── hooks/                        # Custom hooks
│   ├── useOrderManagement.ts     # Order CRUD logic
│   ├── usePaymentCalculation.ts  # Payment math
│   └── useBarcodeScanner.ts      # Barcode handling
│
└── utils/                        # Utilities
    ├── calculateTotals.ts        # Summary calculations
    └── validateOrder.ts          # Order validation
```

---

## Your Current Approach Analysis

### ✅ **STRENGTHS**

1. **3-Part Data Split (UI/Operational/Transaction)**
   - ✅ Good separation of concerns
   - ✅ Aligns with business logic
   - ✅ Makes state predictable

2. **Server as Source of Truth**
   - ✅ Critical for POS systems (inventory, pricing)
   - ✅ Prevents data inconsistency

3. **RTK Query for API Caching**
   - ✅ Excellent choice - built-in cache management
   - ✅ Automatic refetching
   - ✅ Request deduplication

4. **IndexedDB for Performance Caching**
   - ✅ Print templates (heavy data)
   - ✅ Product images/catalog (reduce API calls)
   - ⚠️ NOT for offline-first (server is always source of truth)

5. **UI Doesn't Wait**
   - ✅ Skeleton loaders and optimistic updates
   - ✅ Better UX

### ⚠️ **AREAS TO REFINE**

1. **3 Reducers Approach** - Need clarification on boundaries
2. **Cache Strategy** - Need clear invalidation rules
3. **ERP Integration** - How RPOS shares state with other ERP modules
4. **Real-time Updates** - Kitchen needs live updates (WebSocket/SignalR?)

---

## Recommended Architecture

### **1. STATE MANAGEMENT ARCHITECTURE**

```
┌──────────────────────────────────────────────────────────────┐
│                  POLOSYS ERP - REDUX STORE                    │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              RPOS MODULE (Our Focus)                    │ │
│  │                                                         │ │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │ UI State │  │ Operational  │  │  Transaction    │  │ │
│  │  │(Session) │  │   (Session)  │  │  (From Server)  │  │ │
│  │  └──────────┘  └──────────────┘  └─────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         Other ERP Modules (Inventory, Accounts, etc)    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              RTK Query API (Centralized Cache)          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │ RPOS API     │  │ Masters API  │  │ Inventory API│  │ │
│  │  │ (rposApi)    │  │ (Shared)     │  │ (Shared)     │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │      IndexedDB (Performance Cache ONLY - Not Source)    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │Print Template│  │Product Images│  │Heavy Catalogs│  │ │
│  │  │  (10-50MB)   │  │  (5-20MB)    │  │  (1-5MB)     │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   RTK Query Layer    │
                   │  (Auto Caching/      │
                   │   Deduplication)     │
                   └──────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   BACKEND SERVER     │
                   │  (Source of Truth)   │
                   │  - Inventory         │
                   │  - Orders            │
                   │  - Kitchen           │
                   │  - Accounts          │
                   └──────────────────────┘
```

### **2. THREE-TIER STATE DESIGN**

#### **Tier 1: UI State (ui-reducer.ts)**
**Purpose:** Temporary, view-only state that doesn't need persistence

**Contains:**
- Modal open/close states
- Loading indicators
- Selected tabs/views
- Search queries
- Filter states
- Sidebar expand/collapse
- Dropdown open/close

**Characteristics:**
- ❌ NOT persisted
- ❌ NOT synced to server
- ✅ Fast, local-only updates
- ✅ Reset on page refresh is OK

**Example:**
```typescript
interface RPosUIState {
  // Kitchen Message UI
  kitchenMessage: {
    isModalOpen: boolean;
    selectedKitchenId: number | null;
    searchQuery: string;
    isLoading: boolean;
  };

  // General UI
  sidebar: {
    isExpanded: boolean;
    activeTab: string;
  };

  // Product Grid UI
  productGrid: {
    viewMode: 'grid' | 'list';
    selectedCategoryId: number | null;
  };
}
```

---

#### **Tier 2: Operational State (operational-reducer.ts)**
**Purpose:** Runtime configuration and session data (lasts during session)

**Contains:**
- Current table/seat selection
- Waiter assignment
- Dining context (dine-in/takeaway)
- Print configuration
- Product view preferences
- Price category
- Current shift info
- User preferences

**Characteristics:**
- ⚠️ Optionally persisted (localStorage/sessionStorage)
- ❌ NOT synced to server automatically
- ✅ Survives component unmounts
- ✅ Can be initialized from server on login

**Example:**
```typescript
interface RPosOperationalState {
  // Dining Context
  dining: {
    tableNo: string;
    seatNo: string;
    isTableSelected: boolean;
    serveType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  };

  // Kitchen Context
  kitchen: {
    availableKitchens: Kitchen[];
    defaultKitchenId: number | null;
    lastLoadedAt: string;
  };

  // Session Info
  session: {
    waiterId: string;
    waiterName: string;
    shiftId: number;
    terminalId: string;
  };

  // Config
  config: {
    printAfterSave: boolean;
    defaultPriceCategoryId: number;
  };
}
```

---

#### **Tier 3: Transaction State (transaction-reducer.ts)**
**Purpose:** Business transaction data from server (NOT persisted locally)

**Contains:**
- Current order data (from server)
- Order items (from server)
- Payment details (from server)
- Customer information (from server)
- Transaction history (cached from API)

**Characteristics:**
- ❌ NOT persisted locally (server is source of truth)
- ✅ Always fetched from server via RTK Query
- ✅ RTK Query handles caching automatically
- ✅ On save/update, immediately sync to server
- ⚠️ If API fails, show error - don't save locally

**Example:**
```typescript
interface RPosTransactionState {
  // Current Active Order (from RTK Query, cached temporarily)
  activeOrder: {
    master: TransactionMaster | null;
    details: TransactionDetail[];
    isDirty: boolean; // Has unsaved changes (in memory only)
  };

  // Form state for current edit (temp storage before save)
  pendingChanges: {
    orderItems: TransactionDetail[];
    isModified: boolean;
  };
}

// Note: Historical data comes from RTK Query, not stored in reducer
// Recent orders, kitchen messages, etc. are fetched via API
```

---

### **3. RTK QUERY ARCHITECTURE**

#### **API Slice Organization**

```typescript
// src/pages/rpos/api/rpos-api.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rposApi = createApi({
  reducerPath: 'rposApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),

  // Tag types for cache invalidation
  tagTypes: [
    'Kitchens',           // Master data - rarely changes
    'KitchenMessages',    // Transaction data - changes often
    'MessageMasters',     // Master data - rarely changes
    'Orders',             // Transaction data - changes often
    'Tables',             // Operational data - moderate changes
  ],

  endpoints: (builder) => ({
    // ... endpoints defined in separate files
  }),
});
```

#### **Endpoint Categories**

**Category A: Master Data (Long Cache)**
- Kitchens, Products, Categories, Price Lists
- Cache: 30 minutes
- Strategy: Cache-first, background refresh

**Category B: Operational Data (Medium Cache)**
- Tables status, Waiter list, Current shift
- Cache: 5 minutes
- Strategy: Cache-first with periodic refetch

**Category C: Transaction Data (Short/No Cache)**
- Orders, Payments, Kitchen Messages
- Cache: 30 seconds or optimistic updates
- Strategy: Server-first with optimistic UI

---

### **4. KITCHEN MESSAGE SPECIFIC ARCHITECTURE (ERP Approach)**

```
User Action Flow:
─────────────────

┌─────────────────┐
│  User Opens     │
│  Kitchen Msg    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 1. UI State: Set isModalOpen = true    │
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ 2. RTK Query Auto-Fetch (with cache):       │
│    const { data: kitchens } =                │
│      useGetKitchensQuery()                   │
│    - If cached (< 30 min): Instant render   │
│    - If stale/missing: Show skeleton loader │
└────────┬─────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ 3. Component Renders:                        │
│    - Skeleton loader while loading           │
│    - Data appears when ready                 │
│    - RTK Query handles all caching           │
└────────┬─────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ 4. User Fills Form & Clicks Send      │
└────────┬───────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 5. Validate Data Locally:               │
│    - Check required fields              │
│    - Validate formats                   │
│    - If invalid: Show error, stop       │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 6. Call API via RTK Mutation:           │
│    const [send] = useSendMessageMutation │
│    await send(data).unwrap()            │
│    - Show loading spinner               │
│    - Wait for server response           │
└────────┬────────────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 SUCCESS    FAILED
    │         │
    │         └──► 7b. Show Error
    │                  - Display error message
    │                  - Keep modal open
    │                  - Let user retry
    │                  ❌ NO offline queue
    │
    └──────────► 7a. Success Flow
                  - Show success message
                  - Close modal
                  - RTK Query invalidates cache
                  - Kitchen list auto-refreshes

┌─────────────────────────────────────────┐
│ 8. No IndexedDB for transactions:       │
│    ❌ NO pending queue                   │
│    ❌ NO offline sync                    │
│    ✅ Server is always source of truth  │
└─────────────────────────────────────────┘
```

---

### **5. IMPLEMENTED FILE STRUCTURE**

```
src/pages/rpos/
│
├── type/                                    # ✅ TYPE DEFINITIONS (IMPLEMENTED)
│   ├── index.ts                             # ✅ Centralized exports
│   ├── rpos-ui-type.ts                      # ✅ UI state types (flags, panels, loading, search, selection, form)
│   ├── rpos-operational.ts                  # ✅ Operational state types (print, product, dining, session, customer, payment, waiter, voucher, kitchen)
│   ├── rpos-transaction.ts                  # ✅ Transaction state types (order, payment, settlement, kitchen message)
│   │
│   └── rpos-type-data.ts/                   # ✅ INITIAL STATE DATA (IMPLEMENTED)
│       ├── index.ts                         # ✅ Centralized exports
│       ├── rpos-ui-data.ts                  # ✅ UI initial state
│       ├── rpos-operational-data.ts         # ✅ Operational initial state
│       └── rpos-transaction-data.ts         # ✅ Transaction initial state
│
├── reducers/                                # 📝 REDUX REDUCERS (TO IMPLEMENT)
│   ├── ui-reducer.ts                        # ✅ Exists - needs update
│   ├── operational-reducer.ts               # 📝 To implement
│   └── transaction-reducer.ts               # 📝 To implement
│
├── api/                                     # 📝 RTK QUERY API (TO IMPLEMENT)
│   ├── rpos-api.ts                          # 📝 Main API slice with baseQuery
│   ├── kitchen-api.ts                       # 📝 Kitchen endpoints (getKitchens, sendMessage)
│   ├── order-api.ts                         # 📝 Order endpoints (getOrder, saveOrder, loadPending)
│   ├── table-api.ts                         # 📝 Table endpoints (getTables, updateTableStatus)
│   ├── product-api.ts                       # 📝 Product endpoints (getProducts, getGroups, getPrices)
│   └── settlement-api.ts                    # 📝 Settlement endpoints (getInvoices, settleBill)
│
├── services/                                # 📝 BUSINESS LOGIC (TO IMPLEMENT)
│   ├── cache-service.ts                     # 📝 IndexedDB cache operations (templates, images)
│   └── validation-service.ts                # 📝 Data validation (Zod schemas)
│
├── hooks/                                   # 📝 CUSTOM HOOKS (TO IMPLEMENT)
│   ├── useKitchenMessage.ts                 # 📝 Kitchen message logic
│   ├── useOrderManagement.ts                # 📝 Order CRUD operations
│   ├── usePayment.ts                        # 📝 Payment calculations
│   └── useTableSelection.ts                 # 📝 Table/seat selection
│
├── KitchenMessage/                          # 📝 FEATURE FOLDER (TO IMPLEMENT)
│   ├── kitchen-message.tsx                  # 📝 UI Component ONLY
│   └── index.ts                             # 📝 Exports
│
├── OrderEntry/                              # 📝 FEATURE FOLDER (TO IMPLEMENT)
│   ├── order-entry.tsx                      # 📝 Main POS screen
│   ├── product-grid.tsx                     # 📝 Product selection grid
│   ├── order-items-grid.tsx                 # 📝 Order items list
│   └── index.ts                             # 📝 Exports
│
├── TableView/                               # 📝 FEATURE FOLDER (TO IMPLEMENT)
│   ├── table-view.tsx                       # 📝 Table selection view
│   └── index.ts                             # 📝 Exports
│
├── Settlement/                              # 📝 FEATURE FOLDER (TO IMPLEMENT)
│   ├── settlement.tsx                       # 📝 Settlement screen
│   └── index.ts                             # 📝 Exports
│
└── Payment/                                 # 📝 FEATURE FOLDER (TO IMPLEMENT)
    ├── payment-panel.tsx                    # 📝 Payment form
    └── index.ts                             # 📝 Exports

Legend: ✅ Implemented | 📝 To implement
```

---

### **6. DATA FLOW PATTERNS**

#### **Pattern 1: Master Data (Kitchens List)**

```typescript
// ❌ BAD: Direct API call every time
function KitchenMessage() {
  const [kitchens, setKitchens] = useState([]);

  useEffect(() => {
    fetch('/api/kitchens').then(res => setKitchens(res.data));
  }, []);
}

// ✅ GOOD: RTK Query with cache
function KitchenMessage() {
  const { data: kitchens, isLoading } = useGetKitchensQuery(undefined, {
    pollingInterval: 1800000, // 30 min
    refetchOnMountOrArgChange: 1800, // 30 min
  });
}
```

#### **Pattern 2: Transaction Data (Send Message)**

```typescript
// ✅ GOOD: Optimistic UI + Server validation (ERP approach)
function KitchenMessage() {
  const [sendMessage, { isLoading }] = useSendKitchenMessageMutation();

  const handleSend = async (message: KitchenMessage) => {
    try {
      // Show loading state immediately
      setLocalLoading(true);

      // Call API (wait for response - server is source of truth)
      const result = await sendMessage(message).unwrap();

      // Success - show confirmation
      toast.success('Message sent to kitchen');

      // Close modal
      onClose();

      // RTK Query automatically invalidates cache and refetches if needed

    } catch (error) {
      // ❌ NO PENDING QUEUE - Just show error
      // User must retry manually or fix the issue

      if (error.status === 400) {
        toast.error('Invalid data. Please check and try again.');
      } else if (error.status === 500) {
        toast.error('Server error. Contact support.');
      } else {
        toast.error('Failed to send. Please try again.');
      }

      // Keep modal open so user can retry

    } finally {
      setLocalLoading(false);
    }
  };
}

// Alternative: Optimistic update for better UX (if appropriate)
function KitchenMessageOptimistic() {
  const [sendMessage] = useSendKitchenMessageMutation();

  const handleSend = async (message: KitchenMessage) => {
    // Close modal immediately (optimistic)
    onClose();

    // Show toast with "sending" state
    const toastId = toast.loading('Sending message...');

    try {
      await sendMessage(message).unwrap();
      toast.success('Message sent', { id: toastId });

    } catch (error) {
      // Rollback UI - reopen modal or show undo option
      toast.error('Failed to send. Click to retry.', {
        id: toastId,
        action: { label: 'Retry', onClick: () => handleSend(message) }
      });
    }
  };
}
```

#### **Pattern 3: Operational Data (Table Selection)**

```typescript
// ✅ GOOD: Local state + optional persistence
function TableView() {
  const dispatch = useDispatch();
  const selectedTable = useSelector(state => state.operational.dining.tableNo);

  const handleSelectTable = (tableNo: string) => {
    // Update operational state
    dispatch(setDiningContext({ tableNo, isTableSelected: true }));

    // Persist to localStorage (optional)
    localStorage.setItem('lastSelectedTable', tableNo);
  };
}
```

---

### **7. INDEXEDDB STRATEGY (Performance Cache ONLY)**

#### **What to Store in IndexedDB**

```typescript
// IndexedDB Schema - ONLY for performance caching, NOT source of truth
{
  databases: {
    'rpos-cache-db': {
      version: 1,
      stores: {

        // 1. Print Templates (Heavy static data)
        'print-templates': {
          keyPath: 'templateId',
          indexes: ['type', 'cachedAt'],
          data: 'KOT templates, Bill templates (10-50MB)',
          ttl: '7 days',
          reason: 'Avoid re-downloading large HTML/CSS templates'
        },

        // 2. Product Images (Binary data)
        'product-images': {
          keyPath: 'productId',
          indexes: ['cachedAt'],
          data: 'Product photos as blob (5-20MB total)',
          ttl: '24 hours',
          reason: 'Reduce image loading time'
        },

        // 3. Product Catalog (Large dataset)
        'product-catalog': {
          keyPath: 'productId',
          indexes: ['categoryId', 'cachedAt'],
          data: 'Full product list with prices (1-5MB)',
          ttl: '30 minutes',
          reason: 'Fast product search/display, reduce API load'
        },

        // 4. User Preferences (Small data)
        'user-preferences': {
          keyPath: 'userId',
          data: 'Layout preferences, shortcuts, favorites',
          ttl: 'No expiry',
          reason: 'Instant UI customization'
        }
      }
    }
  }
}
```

#### **Cache Strategy (NOT Sync Strategy)**

```typescript
// Cache Service - Read-through cache pattern
class CacheService {

  // Get print template (use cache if available, otherwise fetch)
  async getPrintTemplate(templateId: string): Promise<PrintTemplate> {
    // 1. Check IndexedDB cache
    const cached = await db.printTemplates.get(templateId);

    if (cached && !this.isExpired(cached.cachedAt, 7 * 24 * 60 * 60)) {
      console.log('Using cached template');
      return cached.data;
    }

    // 2. Cache miss or expired - fetch from server
    console.log('Fetching template from server');
    const template = await api.getPrintTemplate(templateId);

    // 3. Update cache
    await db.printTemplates.put({
      templateId,
      data: template,
      cachedAt: new Date().toISOString()
    });

    return template;
  }

  // Get product with image (read-through cache)
  async getProductWithImage(productId: number): Promise<Product> {
    const cached = await db.productImages.get(productId);

    if (cached && !this.isExpired(cached.cachedAt, 24 * 60 * 60)) {
      return { ...cached.product, image: cached.imageBlob };
    }

    // Fetch from server
    const product = await api.getProduct(productId);
    const imageBlob = await this.fetchImageAsBlob(product.imageUrl);

    // Cache it
    await db.productImages.put({
      productId,
      product,
      imageBlob,
      cachedAt: new Date().toISOString()
    });

    return { ...product, image: imageBlob };
  }

  // Clear expired cache entries (run on app init)
  async clearExpiredCache() {
    const now = Date.now();

    // Clear old print templates (> 7 days)
    await db.printTemplates
      .where('cachedAt')
      .below(new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString())
      .delete();

    // Clear old product images (> 24 hours)
    await db.productImages
      .where('cachedAt')
      .below(new Date(now - 24 * 60 * 60 * 1000).toISOString())
      .delete();
  }
}

// ❌ NO PENDING QUEUE - If API fails, show error and let user retry
// ❌ NO BACKGROUND SYNC - Server is always source of truth
```

---

### **8. API CALL OPTIMIZATION**

#### **Deduplication Strategy**

```typescript
// RTK Query automatically deduplicates
// But you can control it:

const kitchenApi = rposApi.injectEndpoints({
  endpoints: (builder) => ({

    getKitchens: builder.query<Kitchen[], void>({
      query: () => '/kitchens',
      providesTags: ['Kitchens'],

      // Cache for 30 minutes
      keepUnusedDataFor: 1800,

      // Only refetch if data is older than 30 min
      refetchOnMountOrArgChange: 1800,

      // Don't refetch on window focus for master data
      refetchOnFocus: false,
    }),

    getMessageMasters: builder.query<MessageMaster[], void>({
      query: () => '/kitchen-messages/masters',
      providesTags: ['MessageMasters'],
      keepUnusedDataFor: 3600, // 1 hour
    }),

    sendKitchenMessage: builder.mutation<number, KitchenMessage>({
      query: (message) => ({
        url: '/kitchen-messages',
        method: 'POST',
        body: message,
      }),

      // Invalidate related caches
      invalidatesTags: ['KitchenMessages'],

      // Optimistic update
      async onQueryStarted(message, { dispatch, queryFulfilled }) {
        // Optimistic update to UI
        const patchResult = dispatch(
          kitchenApi.util.updateQueryData('getRecentMessages', undefined, (draft) => {
            draft.unshift(message);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
    }),
  }),
});
```

---

### **9. SECURITY BEST PRACTICES**

```typescript
// 1. API Token Management
const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
});

// 2. Request Validation
const sendMessageSchema = z.object({
  KitchenID: z.number().positive(),
  OrderNumber: z.string().min(1),
  KitchenRemarks: z.string().max(500),
});

function handleSend(data: unknown) {
  const validated = sendMessageSchema.parse(data); // Throws if invalid
  dispatch(sendMessage(validated));
}

// 3. Rate Limiting (Client-side)
const useRateLimitedMutation = (mutation: any, limit: number) => {
  const lastCall = useRef<number>(0);

  return async (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current < limit) {
      throw new Error('Too many requests');
    }
    lastCall.current = now;
    return mutation(...args);
  };
};

// 4. Sanitize Inputs
const sanitizedMessage = DOMPurify.sanitize(userInput);
```

---

### **10. PERFORMANCE OPTIMIZATION**

#### **Bundle Splitting**

```typescript
// Lazy load heavy features
const KitchenMessage = lazy(() => import('./KitchenMessage'));
const OrderEntry = lazy(() => import('./OrderEntry'));

// Route-based code splitting
<Route path="kitchen-message" element={
  <Suspense fallback={<Skeleton />}>
    <KitchenMessage />
  </Suspense>
} />
```

#### **Memoization**

```typescript
// Expensive calculations
const filteredMessages = useMemo(() => {
  return messages.filter(m => m.name.includes(search));
}, [messages, search]);

// Prevent unnecessary re-renders
const MemoizedKitchenList = memo(KitchenList, (prev, next) => {
  return prev.kitchens.length === next.kitchens.length;
});
```

---

## FINAL RECOMMENDATIONS

### ✅ **Your Approach is EXCELLENT with these refinements:**

1. **Keep 3-Part State** (UI/Operational/Transaction) - ✅ Perfect for ERP
   - Add clear boundaries (see Tier 1/2/3 above)
   - Transaction state is temporary (from RTK Query cache, not persisted)

2. **RTK Query for API** - ✅ Perfect choice for ERP
   - Automatic caching with smart invalidation
   - Built-in request deduplication
   - Cache strategies per data type (master vs transaction)

3. **IndexedDB for Performance Cache ONLY** - ✅ Correct approach
   - ✅ Use for: Print templates, Product images, Heavy catalogs
   - ❌ NOT for: Pending transactions, Offline queue, Source of truth
   - Cache pattern: Read-through with TTL expiration

4. **Server as Source of Truth** - ✅ Critical for ERP
   - All saves go directly to server
   - If API fails, show error and let user retry
   - No offline queue or background sync needed

### 🎯 **Additional Recommendations:**

5. **Add WebSocket/SignalR for Real-Time** (Recommended)
   - Kitchen gets new orders instantly
   - Order status changes propagate to all terminals
   - Table status updates in real-time
   - Critical for multi-terminal POS

6. **Add Validation Layer**
   - Use Zod/Yup for runtime validation
   - Validate before API calls (client-side)
   - Trust server validation as final authority

7. **Add Error Boundary**
   - Graceful error handling
   - Show user-friendly error messages
   - Log errors for debugging

8. **Add Optimistic UI (Where Appropriate)**
   - Close modals immediately (better UX)
   - Show loading toast during API call
   - Rollback on error with retry option

---

## NEXT STEPS

1. ✅ Approve this architecture
2. 📝 Implement type definitions (3 files)
3. 📝 Implement reducers (3 slices)
4. 📝 Implement RTK Query API
5. 📝 Implement IndexedDB service
6. 📝 Implement Kitchen Message UI (first feature)
7. 📝 Test offline functionality
8. 📝 Implement other features following same pattern

---

**Questions for you:**

1. **Real-time Updates**: Do you want WebSocket/SignalR for live kitchen order updates?
2. **ERP Integration**: Are there shared Redux slices with other ERP modules?
3. **Print Templates**: What's the size of KOT/Bill templates (to optimize IndexedDB)?
4. **Cache Duration**: 30 min for master data, 5 min for operational - is this good?

This architecture will give you:
- ⚡ Lightning-fast UI (RTK Query cache, IndexedDB for heavy assets)
- 🔒 Data integrity (server is always source of truth)
- 🛡️ Security (validated, sanitized, proper auth)
- 🏢 ERP-ready (no offline conflicts, centralized data)
- 📈 Scalability (clean patterns, easy to extend)
- 🎨 Best UX (skeleton loaders, optimistic UI, smart caching)

**Key Differences from Offline-First POS:**
- ❌ No IndexedDB for transactions (server only)
- ❌ No offline queue/pending state
- ❌ No background sync service
- ✅ IndexedDB only for performance (templates, images)
- ✅ API failures show errors immediately
- ✅ User must be online for transactions

Ready to proceed with implementation?
