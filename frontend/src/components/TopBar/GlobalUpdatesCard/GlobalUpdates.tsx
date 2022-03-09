import { Button, Icon } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { useState } from "react";
import { useFullSelector } from "../../.."
import Conditional from "../../../kbin-blueprint/Conditional";
import IfElse from "../../../kbin-blueprint/IfElse";
import { navigateToBuild } from "../../../state/builds";
import { navigateToDeployment } from "../../../state/deployments";
import { navigateToServer } from "../../../state/servers";
import { Builds } from "../../../state/types/build";
import { Deployments } from "../../../state/types/deployment";
import { Servers } from "../../../state/types/server";
import { Update } from "../../../state/types/update";
import CommandDialog from "../../Menus/UpdatesMenus/CommandDialog";
import NoteDialog from "../../Menus/UpdatesMenus/NoteDialog";
import ResultDialog from "../../Menus/UpdatesMenus/ResultDialog";
import './GlobalUpdates.css'

function GlobalUpdates({
  setMenuOpen,
}: {
  setMenuOpen: (open: boolean) => void;
}) {
  const { updates, builds, deployments, servers, subbed } = useFullSelector();
  return (
    <div
      className="Scrolling"
      style={{ maxHeight: "31.75rem", width: "22rem" }}
    >
      <div>
        {Object.keys(updates).map((key, i) => (
          <UpdateCard
            setMenuOpen={setMenuOpen}
            update={updates[key]}
            builds={builds}
            deployments={deployments}
            servers={servers}
            subbedID={subbed.id}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}

export default GlobalUpdates

function UpdateCard({
  update,
  deployments,
  builds,
  servers,
  setMenuOpen,
  subbedID,
}: {
  update: Update;
  builds: Builds;
  deployments: Deployments;
  servers: Servers;
  setMenuOpen: (open: boolean) => void;
  subbedID: string;
}) {
  const [openCommandDialog, setOpenCommandDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false)

  const {
    operation,
    buildID,
    deploymentID,
    serverID,
    timestamp,
    isError,
    operator,
    note,
    command,
    log
  } = update;
  const name = deploymentID
    ? deployments[deploymentID]
      ? deployments[deploymentID].name
      : "None"
    : buildID
    ? builds[buildID]
      ? builds[buildID].name
      : "None"
    : serverID
    ? servers[serverID]
      ? servers[serverID].name
      : "None"
    : "None";
  const { date, time } = timestamp;
  const _note = note ? note : ''
  const id =
    name !== "None"
      ? deploymentID
        ? deploymentID
        : buildID
        ? buildID
        : serverID
        ? serverID
        : "none"
      : "none";
  const typeToNavigate =
    name !== "None"
      ? deploymentID
        ? "Deployment"
        : buildID
        ? "Build"
        : serverID
        ? "Server"
        : "none"
      : "none";
  return (
    <div className="UpdateCard">
      <div
        className="GUItem Pointer"
        style={{
          gridArea: "name",
          fontSize: "1.15rem",
          fontWeight: "bold",
          color: isError ? "var(--error-update)" : "white",
        }}
        onClick={() => {
          if (subbedID !== id) {
            switch (typeToNavigate) {
              case "Deployment":
                navigateToDeployment(deploymentID!);
                break;
              case "Build":
                navigateToBuild(buildID!);
                break;
              case "Server":
                navigateToServer(serverID!);
                break;
              case "none":
                break;
            }
          }
        }}
      >
        <IfElse
          showIf={typeToNavigate !== "none"}
          show={
            <Tooltip2 content={`Navigate to ${typeToNavigate}`}>
              {name}
            </Tooltip2>
          }
          showElse={name}
        />
      </div>
      <div
        className="GUItem"
        style={{
          gridArea: "operation",
          color: isError ? "var(--error-update)" : "white",
        }}
      >
        {operation}
      </div>
      <div
        className="GUItem"
        style={{ gridArea: "timestamp", justifyContent: "center" }}
      >
        {" "}
        {date} at {time}{" "}
      </div>
      <div className="GUItem" style={{ gridArea: "operator" }}>
        {" "}
        <Icon icon="user" style={{ marginRight: "0.5rem" }} /> {operator}{" "}
      </div>
      <div
        className="GUItem"
        style={{
          gridArea: "buttons",
          display: "flex",
          justifyContent: "space-between",
          padding: "0rem 0.5rem",
        }}
      >
        <Button
          intent="warning"
          icon="unarchive"
          minimal
          onClick={() => {
            setOpenCommandDialog(!openCommandDialog);
            setMenuOpen(true);
          }}
        />
        <Button
          intent="primary"
          icon="archive"
          minimal
          onClick={() => {
            setOpenResultDialog(!openResultDialog);
            setMenuOpen(true);
          }}
        />
        <Conditional showIf={_note.length > 0}>
          <Button
            intent="danger"
            icon="document"
            minimal
            onClick={() => {
              setOpenNoteDialog(!openNoteDialog);
              setMenuOpen(true);
            }}
          />
          <NoteDialog
            showDialog={openNoteDialog}
            closeDialog={() => {
              setOpenNoteDialog(!openNoteDialog);
              setMenuOpen(false);
            }}
            note={note}
          />
        </Conditional>
        <CommandDialog
          showDialog={openCommandDialog}
          closeDialog={() => {
            setOpenCommandDialog(!openCommandDialog);
            setMenuOpen(false);
          }}
          command={command}
        />
        <ResultDialog
          showDialog={openResultDialog}
          closeDialog={() => {
            setOpenResultDialog(!openResultDialog);
            setMenuOpen(false);
          }}
          log={log}
        />
      </div>
    </div>
  );
}
