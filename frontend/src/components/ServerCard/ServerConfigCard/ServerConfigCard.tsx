import { animated } from "react-spring";
import { useEffect } from "react";
import { select } from "../../..";
import { useConfigTransition } from "../../../helpers/spring"
import { useChangedState } from "../../../helpers/hooks";
import { Button, EditableText, Switch } from "@blueprintjs/core";
import Conditional from "../../../kbin-blueprint/Conditional";
import { sendOverRootWS } from "../../../state/sockets";
import { UPDATE_SERVER } from "../../../state/servers";

function ServerConfigCard({ serverID, isOpen } : { serverID: string, isOpen: boolean}) {
  const [server, setServer, changed, resetChanged] = useChangedState(select(state => state.servers[serverID]))
  const { address, port, enabled } = server 
  const transitions = useConfigTransition(isOpen)
  
  useEffect(() => {
    if (serverID !== server._id) {
      setServer(select((state) => state.servers[serverID]));
      resetChanged();
    }
  });

  return transitions(
    (styles, item) =>
      item && (
        <animated.div className="InnerCard" style={styles}>
          <div className="InnerCardHeader">Configure</div>
          <div className="ConfigCard">
            <div className="ConfigCardBody">
              <div className="ConfigInputTitle">Address:</div>
              <div className="ConfigInput bp3-dark">
                <EditableText
                  placeholder="Server IP Address"
                  value={address}
                  onChange={(address) => {
                    if (address !== server.address) {
                      setServer({ ...server, address });
                    }
                  }}
                />
              </div>
            </div>
            <div className="ConfigCardBody">
              <div className="ConfigInputTitle">Port:</div>
              <div className="ConfigInput bp3-dark">
                <EditableText
                  placeholder="Server Port"
                  value={port}
                  onChange={(port) => {
                    if (port !== server.port) {
                      setServer({ ...server, port });
                    }
                  }}
                />
              </div>
            </div>
            <div className="ConfigCardBody">
              <div className="ConfigInputTitle">Enabled:</div>
              <div className="ConfigInput bp3-dark" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Switch 
                  checked={enabled}
                  onChange={() => setServer({ ...server, enabled: !enabled })}
                  className='ZeroMargin'
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              overflow: "hidden",
              marginTop: "1rem",
            }}
          >
            <Conditional showIf={changed}>
              <Button
                text="Discard"
                rightIcon="remove"
                intent="danger"
                onClick={() => {
                  setServer(select(({ servers }) => servers[serverID]));
                  resetChanged();
                }}
              />
              <Button
                text="Confirm"
                rightIcon="confirm"
                intent="success"
                style={{ marginLeft: "1rem" }}
                onClick={() => {
                  sendOverRootWS(UPDATE_SERVER, { server });
                  resetChanged();
                }}
              />
            </Conditional>
          </div>
        </animated.div>
      )
  );
}

export default ServerConfigCard