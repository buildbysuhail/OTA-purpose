import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { APIClient } from "../../helpers/api-client";
import { handleResponse } from "../../utilities/HandleResponse";

type ActionType = {
  type: "link" | "popup";
  path?: string;
  action?: () => void;
};

type DeleteActionType = {
  url?: string;
  key?: any;
  confirmationRequired: boolean;
  confirmationMessage?: string;
  action?: () => void;
};

const defaultActionType: ActionType = {
  type: "link",
  path: "#",
  action: () => {}
};

const defaultDeleteAction: DeleteActionType = {
  url: "",
  key: null,
  confirmationRequired: false,
  confirmationMessage: "Are you sure you want to delete this item?",
  action: () => {}
};

type ERPGridActionsProps = {
  edit?: ActionType;
  view?: ActionType;
  delete?: DeleteActionType;
};
const api = new APIClient();
const ERPGridActions: React.FC<ERPGridActionsProps> = ({
  edit = defaultActionType,
  view = defaultActionType,
  delete: deleteAction = defaultDeleteAction
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteAction.confirmationRequired) {
      const isConfirmed = window.confirm(deleteAction.confirmationMessage);
      if (!isConfirmed) return;
    }

    setIsDeleting(true);
    try {
      if (deleteAction.action) {
        await deleteAction.action();
      } else if (deleteAction.url) {
		let res = await api.delete(`${deleteAction.url}/${deleteAction.key}`)
		handleResponse(res);
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
      return (
        <button
          onClick={type === "delete" ? handleDelete : (action as ActionType).action}
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
      {renderActionButton("edit", edit)}
      {renderActionButton("delete", deleteAction)}
    </div>
  );
};

export default ERPGridActions;