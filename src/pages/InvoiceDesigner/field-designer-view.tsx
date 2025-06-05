import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface FieldProps {
  labelProps: {
    show: boolean;
    text: string;
    fontSize: number;
    fontColor: string;
    fontBgColor: string;
    align: 'left' | 'center' | 'right';
    textDecoration: string;
  };
  valueProps: {
    show: boolean;
    mergeField: string;
    fontSize: number;
    fontColor: string;
    fontBgColor: string;
    align: 'left' | 'center' | 'right';
    textDecoration: string;
  };
}

interface ColumnProps {
  width: string;
  bgColor: string;
  showBorder: boolean;
  align: 'left' | 'center' | 'right';
  children: Array<{
    id: string;
    type: string;
  }>;
}

interface RowProps {
  columns: ColumnProps[];
}

interface PDFFieldProps {
  field: FieldProps;
  mergeData: { [key: string]: string };
}

interface PDFColumnProps {
  column: ColumnProps;
  mergeData: { [key: string]: string };
}

interface PDFRowProps {
  row: RowProps;
  mergeData: { [key: string]: string };
}

const PDFField = ({ field, mergeData = {} }: PDFFieldProps) => {
  const labelStyle = {
    fontSize: field.labelProps.fontSize,
    color: field.labelProps.fontColor,
    backgroundColor: field.labelProps.fontBgColor !== 'transparent' ? field.labelProps.fontBgColor : undefined,
    textAlign: field.labelProps.align,
    textDecoration: field.labelProps.textDecoration !== 'none' ? field.labelProps.textDecoration : undefined,
  };

  const valueStyle = {
    fontSize: field.valueProps.fontSize,
    color: field.valueProps.fontColor,
    backgroundColor: field.valueProps.fontBgColor !== 'transparent' ? field.valueProps.fontBgColor : undefined,
    textAlign: field.valueProps.align,
    textDecoration: field.valueProps.textDecoration !== 'none' ? field.valueProps.textDecoration : undefined,
  };

  const getValue = () => {
    const mergeField = field.valueProps.mergeField;
    const fieldKey = mergeField.replace(/[{}]/g, '');
    return mergeData[fieldKey] || field.valueProps.mergeField;
  };

  return (
    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
      {field.labelProps.show && (
        <Text style={labelStyle as any}>
          {field.labelProps.text}:
        </Text>
      )}
      {field.valueProps.show && (
        <Text style={[valueStyle, { marginLeft: field.labelProps.show ? 8 : 0 },] as any}>
          {getValue()}
        </Text>
      )}
    </View>
  );
};

const PDFColumn = ({ column, mergeData }: PDFColumnProps) => {
  const columnStyle = {
    width: typeof column.width === 'number' ? column.width : parseFloat(column.width),
    backgroundColor: column.bgColor !== 'transparent' ? column.bgColor : undefined,
    borderWidth: column.showBorder ? 1 : 0,
    borderColor: column.showBorder ? '#000' : undefined,
    borderStyle: column.showBorder ? 'solid' : undefined,
    padding: column.showBorder ? 4 : 0,
    alignItems:
      column.align === 'center'
        ? 'center'
        : column.align === 'right'
          ? 'flex-end'
          : 'flex-start' as 'flex-start' | 'flex-end' | 'center',
  };
  return (
    <View style={columnStyle as any}>
      {column.children.map((child: any) =>
        child.type === 'field' ? (
          <PDFField key={child.id} field={child} mergeData={mergeData} />
        ) : (
          <PDFRow key={child.id} row={child} mergeData={mergeData} />
        )
      )}
    </View>
  );
};

const PDFRow = ({ row, mergeData }: PDFRowProps) => {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
      {row.columns.map((column: any) => (
        <PDFColumn key={column.id} column={column} mergeData={mergeData} />
      ))}
    </View>
  );
};