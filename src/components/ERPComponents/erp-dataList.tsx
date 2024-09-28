import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAction, reducerNameFromUrl } from "../../redux/actions/AppActions";
import { getOptions } from "../../utilities/Utils";

const ERPDataList = ({ handleChange, field, defaultData, data, label }: any) => {
	const dispatch = useDispatch();
	const GetReducerName = reducerNameFromUrl(field?.getListUrl, "GET");
	const dataList = useSelector((state: any) => state?.[GetReducerName]);
	const [localValue, setLocalValue] = useState<any>();

	useEffect(() => {
		field?.getListUrl && dispatch(getAction(field?.getListUrl));
	}, []);

	let value = field?.getter ? defaultData?.[field?.id]?.[field?.getter] : defaultData?.[field?.id];
	// let value = data?.[field?.id] === undefined ? value : data?.[field?.id]?.value;

	if (data !== undefined && data?.[field?.id] !== undefined) {
		value = data?.[field?.id] === undefined ? value : localValue?.label;
	}

	const onChange = (value: any) => {
		handleChange(field?.id, value?.[field?.value]);
		setLocalValue(value);
	};

	return (
		<div>
			<Autocomplete
				onChange={({ target }, value) => onChange(value)}
				options={getOptions(dataList?.data?.results, field?.getter) || []}
				multiple={field.multiple}
				// defaultValue={field?.getter ? defaultData?.[field?.id]?.[field?.getter] : defaultData?.[field?.id]}
				defaultValue={value == undefined ? "" : value}
				value={value == undefined ? "" : value}
				className={`${field?.style}`}
				isOptionEqualToValue={(option, value) => option.value === value.value}
				renderInput={(params) => (
					<TextField
						{...params}
						required={field?.required}
						label={label}
						size="small"
						// inputProps={{ style: { fontSize: 14 } }} // font size of input text
						InputLabelProps={{ style: { fontSize: 14 } }}
					/>
				)}
				loading={dataList?.loading}
			/>
		</div>
	);
};

export default ERPDataList;
