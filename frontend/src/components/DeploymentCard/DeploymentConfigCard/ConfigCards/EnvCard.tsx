import { Button, EditableText } from '@blueprintjs/core'
import { toRouterName } from 'kbin-router'
import { genUpdateID } from 'kbin-state'
import Map from '../../../../kbin-blueprint/Map'
import { Deployment } from '../../../../state/types/deployment'

function EnvCard({ deployment, setDeployment }: { deployment: Deployment, setDeployment: (deployment: Deployment) => void }) {
  const { environment } = deployment
  const _environment = environment ? environment : []
  return (
    <div className="ConfigCard" style={{ maxHeight: "25rem", padding: 0 }}>
      <div className="Scrolling" style={{ padding: "0.5rem" }}>
        <Map
          array={_environment}
          map={({ variable, value, _id, id }, i) => (
            <div className="ConfigCardBody bp3-dark" key={_id ? _id : id}>
              <div className="ConfigInputTitle">
                <EditableText
                  value={variable}
                  placeholder="Name Variable"
                  onChange={variable =>
                    setDeployment({
                      ...deployment,
                      environment: _environment.map((envVar, index) =>
                        i === index
                          ? {
                              ...envVar,
                              variable: toRouterName(variable.toUpperCase()),
                            }
                          : envVar
                      ),
                    })
                  }
                />
              </div>
              <div className="ConfigInput">
                <EditableText
                  value={value}
                  placeholder="Define Value"
                  onChange={value =>
                    setDeployment({
                      ...deployment,
                      environment: _environment.map((envVar, index) =>
                        i === index ? { ...envVar, value } : envVar
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
                      environment: _environment.filter(
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
            intent="success"
            icon="add"
            onClick={() => {
              setDeployment({
                ...deployment,
                environment: [
                  ..._environment,
                  {
                    variable: "",
                    value: "",
                    id: genUpdateID(_environment.length),
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

export default EnvCard