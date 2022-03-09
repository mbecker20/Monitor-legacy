export const ROOT = '/rootDir/'
export const SYSROOT = '/home/ubuntu/'
export const REPO_PATH = ROOT + 'builds/'
export const DEPLOYDATA_ROOT = 'deployments/'
export const REGISTRY_URL = 'localhost:5000/'
export const REGISTRY_URL_EXT = '172.31.64.202:5000/'

export const IS_DEV = process.env.IS_DEV === 'true' ? true : false
export const MONGO_URL = process.env.MONGO_URL!

export const GH_ACCESS_TOKEN = process.env.GH_ACCESS_TOKEN!

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!

export const UPDATE_LIMIT = 10

export const SYSTEM_NAME = IS_DEV ? 'Monitor Dev' : 'Monitor'
export const SYSTEM_SERVER_NAME = 'Monitor Server'

export const SYSTEM_OPERATOR = 'Monitor'

export const FRONTEND_REPO = 'Monitor Frontend'

export const ERROR = 'Error'
export const UNAUTHORIZED_ATTEMPT = 'Unauthorized Attempt'

/* Docker */
export const PRUNE_SERVER = 'Prune Server' // Remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes

/* listener */
export const LISTENER = 'Listener'

export const PERMISSIONS_DENY_LOG = { stderr: 'Someone tried to access this route without appropriate permissions' }

export const DEFAULT_INIT_SEND = { ok: 'ok' }

export const SERVER_CHECK_TIMEOUT = 3000

// export const ADMIN_PASS = process.env.ADMIN_PASS