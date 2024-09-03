
interface FieldOption {
  value: string | number;
  label: string;
  color?: string;
}

enum SearchOptionType {
  Text = 'text',
  DateRange = 'date-range',
  Date = 'date',
  Select = 'select',
  MultiSelect = 'multi-select',
  Number = 'number-range',
  Boolean = 'boolean'
}
enum FieldType {
  Amount = 'amount',
  Badge = 'badge',
  DateTime = 'datetime',
  Number = 'number',
  String = 'string',
  Link = 'link',
  Boolean = 'boolean',
  Enum = 'enum',
  Custom = 'custom'
}
interface SearchableConfig {
  enabled: boolean;
  placeholder: string;
  type?: SearchOptionType;
}

type RenderFunction = (value: any, row: any) => string | JSX.Element;

interface TableColumn {
  label: string;
  key: string;
  type: FieldType;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: SearchableConfig;
  format?: string;
  options?: FieldOption[];
  align?: 'left' | 'center' | 'right';
  getText?: (row: any) => string;
  getUrl?: (row: any) => string;
  trueText?: string;
  falseText?: string;
  render?: RenderFunction;
}

// Example usage:
const exampleField: TableColumn = {
  label: "Branch",
  key: "name",
  type: FieldType.String,
  sortable: true,
  filterable: true,
  searchable: {
    enabled: true,
    placeholder: "Search branch name",
    type: SearchOptionType.Text
  }
};

export type { TableColumn, FieldOption, SearchableConfig, RenderFunction };
export const CrudConfig: Record<string, any> = {
  // * ESTIMATES
  // "/settings/branches": {
  //   title: "Branches",
  //   endpointUrl: Urls.branch,
  //   actionMenus: [{ label: "Add Branch", path: "/settings/branches/create" }],
  //   onRowClickPath: "/settings/branches/update",
  //   search: { enabled: true, placeholder: "Search branches...", keys: ["name", "status", "branchType"] },
  //   fields: [
  //     { label: "Branch", key: "name", type: columnType.STRING, sortable: true, searchable: { enabled: true, placeholder: "Search branch name" } },
  //     { label: "Created At", key: "createdAt", type: columnType.DATETIME, format: "YYYY-MM-DD HH:mm", searchable: { enabled: true, placeholder: "Search date", type: "date-range" } },
  //     { label: "Status", key: "status", type: columnType.BADGE, options: [{ value: "active", label: "Active", color: "green" }, { value: "inactive", label: "Inactive", color: "red" }], searchable: { enabled: true, placeholder: "Search status", type: "select" } },
  //     { label: "Commits", key: "commitCount", type: columnType.NUMBER, align: "right", searchable: { enabled: true, placeholder: "Search commit count", type: "number-range" } },
  //     { label: "Last Commit", key: "lastCommitUrl", type: columnType.LINK, getText: (row) => row.lastCommitHash, getUrl: (row) => `/commit/${row.lastCommitHash}`, searchable: { enabled: true, placeholder: "Search commit hash" } },
  //     { label: "Protected", key: "isProtected", type: columnType.BOOLEAN, trueText: "Yes", falseText: "No", searchable: { enabled: true, placeholder: "Search protected status", type: "boolean" } },
  //     { label: "Type", key: "branchType", type: columnType.ENUM, options: ["feature", "bugfix", "hotfix", "release"], searchable: { enabled: true, placeholder: "Search branch type", type: "multi-select" } },
  //     { label: "Custom", key: "custom", type: columnType.CUSTOM, render: (value, row) => `Custom: ${value} (${row.name})`, searchable: { enabled: true, placeholder: "Search custom field" } }
  //   ],
  //   pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 20, 50, 100] },
  //   sorting: { enabled: true, defaultSort: { key: "name", direction: "asc" } },
  //   filtering: { enabled: true }
  // },
};