import { Alignment, Button, EditableText, Switch } from '@blueprintjs/core'
import { genUpdateID } from 'kbin-state';
import Conditional from '../../../../kbin-blueprint/Conditional'
import Map from '../../../../kbin-blueprint/Map';
import { Deployment } from '../../../../state/types/deployment';

function PortsCard({
  deployment,
  setDeployment,
}: {
  deployment: Deployment;
  setDeployment: (deployment: Deployment) => void;
}) {
  const { ports, network } = deployment;
  const _ports = ports ? ports : []
  return (
    <div className="ConfigCard">
      <div className="ConfigCardBody">
        <div className="ConfigInputTitle"> Host Network </div>
        <Switch
          checked={network === "host"}
          onChange={() =>
            setDeployment({
              ...deployment,
              network: network === "host" ? undefined : "host",
            })
          }
          alignIndicator={Alignment.RIGHT}
          style={{ margin: 0, color: "white" }}
        />
      </div>
      <Conditional showIf={network !== "host"}>
        <Map
          array={_ports}
          map={({ local, container, _id, id }, i) => (
            <div className="ConfigCardBody bp3-dark" key={_id ? _id : id}>
              <div className="ConfigInputTitle">
                <EditableText
                  value={local}
                  onChange={local =>
                    setDeployment({
                      ...deployment,
                      ports: _ports.map((port, index) =>
                        i === index
                          ? { ...port, local }
                          : port
                      ),
                    })
                  }
                />
              </div>
              <div className="ConfigInput">
                <EditableText
                  value={container}
                  onChange={container =>
                    setDeployment({
                      ...deployment,
                      ports: _ports.map((port, index) =>
                        i === index
                          ? { ...port, container }
                          : port
                      ),
                    })
                  }
                />
              </div>
              <div
                className="ConfigCardBody"
                style={{ justifyContent: "center", paddingTop: "0.5rem" }}
              >
                <Button
                  outlined
                  intent="danger"
                  icon="remove"
                  onClick={() =>
                    setDeployment({
                      ...deployment,
                      ports: _ports.filter(
                        (_, index) => index !== i
                      ),
                    })
                  }
                />
              </div>
            </div>
          )}
        />
        <div 
          className="ConfigCardBody"
          style={{ justifyContent: "center", paddingTop: "0.5rem" }}
        >
          <Button
            outlined
            icon="add"
            intent='success'
            onClick={() => setDeployment({
              ...deployment,
              ports: [..._ports, { local: "", container: "", id: genUpdateID(_ports.length) }]
            })}
          />
        </div>
      </Conditional>
    </div>
  );
}

export default PortsCard
