import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import ErpDevGrid, {
} from "../../../../components/ERPComponents/erp-dev-grid";
import { ActionType } from "../../../../redux/types";
import { FC, useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
interface DiagnosisDynamicProps {
  gridHeader: string;
  dataUrl: string;
  gridId: string;
}
const DiagnosisDynamicReport: FC<DiagnosisDynamicProps> = ({
  gridHeader,
  dataUrl,
  gridId,
}) => {
  const { t } = useTranslation("accountsReport");
  const location = useLocation();
  const [key, setKey] = useState(1);
   useEffect(() => {
    setKey((prev: any) => prev + 1);
  }, [location]);
  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
          <div className="px-4 pt-4 pb-2 ">
            <div className="grid grid-cols-1 gap-3">
              <ErpDevGrid
                key={key}
                remoteOperations={{
                  filtering: false,
                  paging: false,
                  sorting: false,
                  summary: false,
                }}
                columns={[]}
                gridHeader={t(gridHeader)}
                dataUrl={dataUrl}
                hideGridAddButton={true}
                enablefilter={false}
                method={ActionType.POST}
                reload={true}
                gridId={gridId}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DiagnosisDynamicReport;
