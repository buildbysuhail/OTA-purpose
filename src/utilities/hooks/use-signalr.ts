import { useEffect, useRef } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { domain } from "../../redux/urls";

const hubUrl = `${domain}/chathub`;

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

    connection
      .start()
      .then(() => {
        connection.invoke("JoinGroup", { connectionId: connection.connectionId });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      if (connection.state === HubConnectionState.Connected) {
        connection.invoke("LeaveGroup", { connectionId: connection.connectionId }).catch(() => {});
      }
      connection.stop();
    };
  }, []);

  return connectionRef;
}
