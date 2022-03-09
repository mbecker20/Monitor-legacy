import { Tree } from '@blueprintjs/core'
import { useFullSelector } from '../../..'
import { useLocalStorage } from '../../../helpers/hooks'
import { navigateToBuild } from '../../../state/builds'
import './BuildsTree.css'

function BuildsTree({ width, closeSidebar }: { width: number, closeSidebar: () => void }) {
  const { builds } = useFullSelector()
  const [expandBuilds, setExpandBuilds] = useLocalStorage(false, 'buildtree')
  const onExpandCollapse = (node: any) => {
    if (node.className === 'Header') {
      setExpandBuilds(!expandBuilds)
    } else {
      navigateToBuild(node.id as string)
      if (width <= 1000) closeSidebar()
    }
  }

  return (
    <div className='TreeContainer' style={{marginTop: '1rem'}}>
      <Tree
        className='BuildsTree'
        onNodeClick={onExpandCollapse}
        onNodeExpand={onExpandCollapse}
        onNodeCollapse={onExpandCollapse}
        contents={['Builds'].map((i) => ({
          id: i,
          label: (
            <div className='FlexRow CenterAlign Pointer' style={{ justifyContent: 'space-between', paddingRight: '0' }}>
              <div style={{ color: 'white', fontSize: '1.25rem', borderRadius: '0.2rem', padding: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                Builds
              </div>
            </div>
          ),
          className: 'Header',
          isExpanded: expandBuilds,
          childNodes: Object.keys(builds).map((buildID) => ({
            id: buildID,
            // icon: 'pin',
            label: (
              <div className='Build Pointer'>
                {builds[buildID].name}
              </div>
            ),
            className: 'Build',
          }))
        }))}
        
      />
    </div>
  )
}

export default BuildsTree  