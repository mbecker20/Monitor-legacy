import { Alignment, Button, EditableText, Switch } from "@blueprintjs/core";
import { genUpdateID } from "kbin-state";
import Map from "../../../../kbin-blueprint/Map";
import { Deployment } from "../../../../state/types/deployment";

function VolumesCard({
  deployment,
  setDeployment,
}: {
  deployment: Deployment;
  setDeployment: (deployment: Deployment) => void;
}) {
  const { volumes } = deployment;
  const _volumes = volumes ? volumes : []
  return (
    <div className="ConfigCard" style={{ maxHeight: "10rem", padding: 0 }}>
      <div className="Scrolling" style={{ padding: "0.5rem" }}>
        <Map
          array={_volumes}
          map={({ local, container, useSystemRoot, _id, id }, i) => (
            <div className="ConfigCardBody bp3-dark" key={_id ? _id : id}>
              <div className="ConfigInputTitle">
                <EditableText
                  value={local}
                  onChange={(local) =>
                    setDeployment({
                      ...deployment,
                      volumes: _volumes.map((volume, index) =>
                        i === index ? { ...volume, local } : volume
                      ),
                    })
                  }
                />
              </div>
              <div className="ConfigInput">
                <EditableText
                  value={container}
                  onChange={(container) =>
                    setDeployment({
                      ...deployment,
                      volumes: _volumes.map((volume, index) =>
                        i === index ? { ...volume, container } : volume
                      ),
                    })
                  }
                />
              </div>
              <div>
                <Switch
                  checked={useSystemRoot}
                  alignIndicator={Alignment.RIGHT}
                  label="Use System Root"
                  style={{ margin: 0, color: "white" }}
                  onClick={() =>
                    setDeployment({
                      ...deployment,
                      volumes: _volumes.map((volume, index) =>
                        i === index
                          ? { ...volume, useSystemRoot: !useSystemRoot }
                          : volume
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
                      volumes: _volumes.filter((_, index) => index !== i),
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
            intent="success"
            icon="add"
            onClick={(e: any) => {
              e.stopPropagation()
              setDeployment({
                ...deployment,
                volumes: [
                  ..._volumes,
                  {
                    local: "",
                    container: "",
                    useSystemRoot: false,
                    id: genUpdateID(_volumes.length),
                  },
                ],
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default VolumesCard;
