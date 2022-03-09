import { Alignment, Button, Divider, EditableText, Switch } from '@blueprintjs/core'
import { Deployment } from '../../../../state/types/deployment'
import { Select } from '@blueprintjs/select'
import { useState } from 'react';
import { select } from '../../../..';
import { roughStringsEqual } from 'kbin-state';
import { renderConfig } from '../../../../helpers/selector';
import Conditional from '../../../../kbin-blueprint/Conditional';

function ImageCard({ deployment, setDeployment }: { deployment: Deployment, setDeployment: (deployment: Deployment) => void }) {  
  const { image, latest } = deployment
  return (
    <div className='ConfigCard'>
      <Conditional showIf={!deployment.buildID}>
        <div className='ConfigCardBody'>
          <div className='ConfigInput bp3-dark' style={{ marginBottom: '0.5rem' }}>
            <EditableText
              placeholder='Image'
              value={image}
              onChange={image => setDeployment({
                ...deployment, image, buildID: undefined
              })}
            />
          </div>
          <Switch
            checked={latest}
            onChange={() => setDeployment({ ...deployment, latest: !latest })}
            alignIndicator={Alignment.RIGHT}
            label='Latest'
            style={{ margin: 0, color: 'white' }}
          />
        </div>
        <div className='ConfigCardBody'>
          <Divider className='bp3-dark' style={{ width: '8rem', borderRightStyle: 'none', transform: 'translate(0, -20%)', marginRight: '.70rem' }} />
            or
          <Divider className='bp3-dark' style={{ width: '8rem', borderRightStyle: 'none', transform: 'translate(0, -20%)', marginLeft: '.70rem' }} />
        </div>
      </Conditional> 
      
      <div className='ConfigCardBody'>
        <div>
          Select Build
        </div>
        <BuildSelector 
          deployment={deployment}
          setDeployment={setDeployment}
        />
      </div>
    </div>
  )
}

export default ImageCard


function BuildSelector({ deployment, setDeployment }: { deployment: Deployment, setDeployment: (deployment: Deployment) => void }) {
  const items = [
    { title: 'Custom Image', _id: undefined, imageName: '' },
    ...select(state => Object.values(state.builds).map(build => ({ ...build, title: build.name })))
  ]
  const [queryItems, setQueryItems] = useState(items)
  return(
    <Select
      items={queryItems}
      itemRenderer={renderConfig as any}
      onItemSelect={({ _id, imageName }) => setDeployment({ 
        ...deployment, 
        buildID: _id, 
        image: _id ? select(({ deployments }) => deployments[deployment._id].image) : imageName 
      })}
      popoverProps={{ className: 'bp3-dark' }}
      onQueryChange={query => setQueryItems(items.filter(({ title }) => roughStringsEqual(query, title)))}
      resetOnClose
    >
      <Button 
        text={deployment.buildID ? select(({ builds }) => builds[deployment.buildID!].name) : items[0].title} 
        rightIcon='caret-down'
      />
    </Select>
  )
}