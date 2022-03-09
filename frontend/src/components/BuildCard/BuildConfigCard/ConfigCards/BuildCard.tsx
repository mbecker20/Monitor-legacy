import { EditableText } from '@blueprintjs/core'
import { Build } from '../../../../state/types/build'

function BuildCard({ 
  build, 
  setBuild 
}: { 
  build: Build
  setBuild: (build: Build) => void
}) {
  const { repoURL, branch, buildPath, dockerfilePath } = build 

  return (
    <div className="ConfigCard">
      <div className="ConfigCardBody">
        <div className="ConfigInputTitle"> Repo URL: </div>
        <div className="ConfigInput bp3-dark" style={{maxWidth: '10rem'}}>
          <EditableText
            placeholder="Paste URL Here"
            value={repoURL}
            onChange={repoURL => {
              if (repoURL !== build.repoURL) {
                setBuild({ ...build, repoURL })
              }
            }}
          />
        </div>
      </div>
      <div className="ConfigCardBody">
        <div className="ConfigInputTitle"> Repo Branch: </div>
        <div className="ConfigInput bp3-dark">
          <EditableText
            placeholder="Repo Branch"
            value={branch}
            onChange={branch => {
              if (branch !== build.branch) {
                setBuild({ ...build, branch })
              }
            }}
          />
        </div>
      </div>
      <div className="ConfigCardBody">
        <div className="ConfigInputTitle"> Build Path: </div>
        <div className="ConfigInput bp3-dark">
          <EditableText
            placeholder="Build Path"
            value={buildPath}
            onChange={buildPath => {
              if (buildPath !== build.buildPath) {
                setBuild({ ...build, buildPath })
              }
            }}
          />
        </div>
      </div>
      <div className="ConfigCardBody">
        <div className="ConfigInputTitle"> Dockerfile Path: </div>
        <div className="ConfigInput bp3-dark">
          <EditableText
            placeholder="Dockerfile Path"
            value={dockerfilePath ? dockerfilePath : ''}
            onChange={dockerfilePath => {
              if (dockerfilePath !== build.dockerfilePath) {
                setBuild({ ...build, dockerfilePath })
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BuildCard