import { useEffect, useRef } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { domain } from "../../redux/urls";
import { APIClient } from "../../helpers/api-client";
import Urls from "../../redux/urls";

const hubUrl = `${domain}/chathub`;
const api = new APIClient();

function joinGroup(connectionId: string | null) {
  if (!connectionId) return;
  api.postAsync(`${Urls.baseUrl}${Urls.signalr_join}`, { connectionId }).catch(() => {});
}

function leaveGroup(connectionId: string | null) {
  if (!connectionId) return;
  api.postAsync(`${Urls.baseUrl}${Urls.signalr_leave}`, { connectionId }).catch(() => {});
}

export function useSignalR() {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.onreconnected(() => {
      joinGroup(connection.connectionId);
    });

    connection
      .start()
      .then(() => {
        joinGroup(connection.connectionId);
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      if (connection.state === HubConnectionState.Connected) {
        leaveGroup(connection.connectionId);
      }
      connection.stop();
    };
  }, []);

  return connectionRef;
}
