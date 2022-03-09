import { addRoutes } from './index'
import { homePage } from './components/HomeCard/HomeCard'
import { deploymentPage } from './components/DeploymentCard/DeploymentCard'
import { buildPage } from './components/BuildCard/BuildCard'
import { serverPage } from './components/ServerCard/ServerCard'

function addBaseRoutes() {
  addRoutes({
    '/*': homePage,
    '/deployments/*': deploymentPage,
    '/builds/*': buildPage,
    '/servers/*': serverPage
  })
}

export default addBaseRoutes