import { toRouterName } from "kbin-router"

export function toContainerName(name: string) {
  return name.toLowerCase().replace(/ /g, '-')
}

export async function returnAfterTimeout<T>(func: () => T | Promise<T>, timeout: number): Promise<T> {
  return await new Promise((resolve) => {
    window.setTimeout(async () => {
      resolve(await func())
    }, timeout)
  })
}

export function classNames(...args: string[]) {
  return args.filter(arg => arg ? true : false).reduce((a, b) => `${a} ${b}`)
}

export function range(start: number, stop: number, curr = []): number[] {
  if (start === stop) {
    return []
  } else {
    return [start, ...range(start + 1, stop, curr)]
  }
}

export function lengthArray(length: number) {
  return range(0, length)
}

export function isValidRepoURL(url: string) {
  return url.length > 5 && url.slice(url.length - 4, url.length) === '.git'
}



export function getIDFromName(name: string, obj: any) {
  for (const id of Object.keys(obj)) {
    if (toRouterName(obj[id].name) === name) {
      return id
    }
  }
  return ''
}
