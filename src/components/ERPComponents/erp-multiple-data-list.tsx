import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { reducerNameFromUrl } from "../../redux/actions/AppActions";
import { getOptions } from "../../utilities/Utils";
import { getAction } from "../../redux/slices/app-thunks";
import { useAppDispatch } from "../../utilities/hooks/useAppDispatch";

const ERPMultipleDataList = ({ handleChange, field, defaultData, data, label }: any) => {
  const dispatch = useAppDispatch();
  const GetReducerName = reducerNameFromUrl(field?.getListUrl, "GET");
  const dataList = useSelector((state: any) => state?.[GetReducerName]);

  const onChange = (value: any) => {
    handleChange(
      field?.id,
      value?.map((value: any) => {
        return {
          [field?.multiKey]: value?.value,
        };
      })
    );
  };

  useEffect(() => {
    field?.getListUrl && dispatch(getAction({apiUrl:field?.getListUrl}));
  }, []);

  return (
    <div>
      <Autocomplete
        onChange={({ target }, value) => onChange(value)}
        options={getOptions(dataList?.data?.results, field?.getListUrl) || []}
        multiple
        className={`${field?.style} border-gray-200 bg-gray-50 rounded-md focus:ring-1 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500`}
        // isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} label={label} size="small" />}
        loading={dataList?.loading}
        // style={{
        //   background: "rgb(241,245,249,0.4)",
        // }}
      />
    </div>
  );
};

export default ERPMultipleDataList;
