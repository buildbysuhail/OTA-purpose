import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { APIClient } from "../../helpers/api-client";
import { handleResponse } from "../../utilities/HandleResponse";
import { useDispatch } from 'react-redux';
import { popupDataProps } from "../../redux/slices/popup-reducer";
import ERPAlert from "./erp-sweet-alert";
import ERPSweetAlert from "./erp-sweet-alert";

type ActionType = {
  type: "link" | "popup";
  path?: string;
  visible?: boolean,
  action?: (payload: popupDataProps) => void;
};

type DeleteActionType = {
  url?: string;
  key?: any;
  confirmationRequired: boolean;
  visible?: boolean;
  confirmationMessage?: string;
  action?: () => void;
  onSuccess?: () => void;
};

const defaultActionType: ActionType = {
  type: "link",
  path: "#",
  visible: true,
  action: () => {}
};

const defaultDeleteAction: DeleteActionType = {
  url: "",
  key: null,
  confirmationRequired: false,
  visible: true,
  confirmationMessage: "Are you sure you want to delete this item?",
  action: () => {},
  onSuccess: () => {}
};

type ERPGridActionsProps = {
  edit?: ActionType;
  view?: ActionType;
  delete?: DeleteActionType;
  itemId?: any; // Add this to pass the item ID
};

const api = new APIClient();

const ERPGridActions: React.FC<ERPGridActionsProps> = ({
  edit = defaultActionType,
  view = defaultActionType,
  delete: deleteAction = defaultDeleteAction,
  itemId
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteAction.action) {
        await deleteAction.action();
      } else if (deleteAction.url) {
        let res = await api.delete(`${deleteAction.url}${deleteAction.key || itemId}`);
        handleResponse(res, () => {deleteAction.onSuccess && deleteAction.onSuccess()});
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderActionButton = (type: "view" | "edit" | "delete", action: ActionType | DeleteActionType) => {
    const icons = {
      view: "ri-eye-2-line view-icon",
      edit: "ri-edit-line edit-icon",
      delete: "ri-delete-bin-5-line delete-icon"
    };

    const titles = {
      view: "View",
      edit: "Edit",
      delete: "Delete"
    };

    if (type === "delete" || (action as ActionType).type === "popup") {
      const handleClick = () => {
        if (type === "delete") {
          setShowDeleteConfirmation(true);
        } else if ((action as ActionType).action) {
          const payload: popupDataProps = {
            isOpen: true,
            key: itemId,
            mode: type as "view" | "edit"
          };
          
          dispatch((action as ActionType).action?.(payload) as any);
        }
      };

      return (
        <>
        <button
          onClick={handleClick}
          disabled={type === "delete" && isDeleting}
          className="ti-btn-link"
          type="button"
        >
          {isDeleting && type === "delete" ? (
            <CircularProgress size={20} />
          ) : (
            <i className={icons[type]} title={titles[type]}></i>
          )}
        </button>
        {showDeleteConfirmation && (
            <ERPAlert
              title="Are you sure?"
              text={"You won't be able to revert this!"}
              icon="warning"
              confirmButtonText="Yes, delete it!"
              cancelButtonText="Cancel"
              onConfirm={() => {
                handleDelete();
                setShowDeleteConfirmation(false);
              }}
              onCancel={() => setShowDeleteConfirmation(false)}
            />
          )}
        </>
      );
    }

    return (
      <Link to={(action as ActionType).path || "#"}>
        <i className={icons[type]} title={titles[type]}></i>
      </Link>
    );
  };

  return (
    <div className="action-field">
      {renderActionButton("view", view)}
      {edit?.visible != false ? renderActionButton("edit", edit): null}
      {deleteAction.visible != false ? renderActionButton("delete", deleteAction): null}
    </div>
  );
};

export default ERPGridActions;