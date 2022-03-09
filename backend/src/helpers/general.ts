import { Deployment } from "../types/deployment"

export function objFrom2Arrays(keys: string[], entries: any[]) {
  if (keys.length === entries.length) {
    return Object.fromEntries(keys.map((id, index) => {
      return [id, entries[index]]
    }))
  }
  return {}
}

export function mergeNullableIntoUpdate(nullableProps: any) {
  const propsToMerge = Object.keys(nullableProps).filter(prop => {
    const notZero = nullableProps[prop] !== 0
    return (!nullableProps[prop] && notZero) ? false : true
  }).map(prop => {
    return {
      [prop]: nullableProps[prop]
    }
  })
  return Object.assign({}, ...propsToMerge)
}

export function objectLength(obj: any) {
  return Object.keys(obj).length
}

export function timestamp() {
  // (month - day - year)
  const date = new Date()
  const _hour = date.getHours()
  const hour = _hour >= 5 ? _hour - 5 : 19 + _hour
  const minutes = date.getMinutes().toString()
  const seconds = date.getSeconds().toString()
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2, 4)}`,
    time: `${hour}:${minutes.length > 1 ? minutes : '0' + minutes}:${seconds.length > 1 ? seconds : '0' + seconds}`
  }
}

export function isValidRepoURL(url: string) {
  return url.length > 5 && url.slice(url.length - 4, url.length) === '.git'
}

export function getRepositoryName(url: string) {
  return getRepoNameRec(url, url.length - 5)
}

function getRepoNameRec(url: string, i: number): string {
  if (url[i] === '/') {
    return url.slice(i + 1, url.length - 4)
  } else if (i === 0) {
    return ''
  } else {
    return getRepoNameRec(url, i - 1)
  }
}

export function toContainerName(name: string) {
  return name.toLowerCase().replace(/ /g, '-')
}

export function toPullName(name: string) {
  return name.replace(/ /g, '_')
}

export const toFolderName = toPullName

export const toImageName = toContainerName

export function getDeployment(status: ContainerStatus, deploymentsAr: Deployment[]) {
  for (let i = 0; i < deploymentsAr.length; i++) {
    if (deploymentsAr[i].containerName === status.name) {
      return deploymentsAr[i]
    }
  }
  return undefined
}

export function combineLogs(log0: Log, log1: Log): Log {
  return {
    stdout: (log0.stdout ? log0.stdout : '') + ((log0.stdout && log1.stdout) ? ', ' : '') + (log1.stdout ? log1.stdout : ''),
    stderr: (log0.stderr ? log0.stderr : '') + ((log0.stderr && log1.stderr) ? ', ' : '') + (log1.stderr ? log1.stderr : ''),
  }
}