export function getFirstPathStar(path: string) {
  if (path.length > 1) {
    for (let i = 2; i < path.length; i++) {
      if (path[i] === '/') {
        return path.slice(0, i + 1) + '*'
      }
    }
    return path + '/*'
  } else {
    return '/*'
  }
}

export function getShortName(path: string) {
  if (path.length > 0 && path !== '/') {
    if (path[path.length - 1] === '/') {
      return getShortNameRec(path.slice(0, path.length - 1), path.length - 2)
    } else {
      return getShortNameRec(path, path.length - 1)
    }
  } else {
    return '/'
  }
}

function getShortNameRec(path: string, index: number): string {
  if (path[index] === '/') {
    return path.slice(index + 1, path.length)
  } else {
    return getShortNameRec(path, index - 1)
  }
}

export function pathToArray(path: string): string[] {
  if (path[0] !== '/') {
    // assumes path like dir1/dir2/...
    for (let i = 0; i < path.length; i++) {
      if (path[i] === '/') {
        return [path.slice(0, i), ...pathToArray(path.slice(i + 1, path.length))]
      }
    }
    return path.length > 0 ? [path] : []
  } else {
    return path.length > 0 ? pathToArray(path.slice(1, path.length)) : []
  }
}

export function arrayToPath(arPath: string[]): string {
  // assumes incoming arPath not empty
  const [first, ...rest] = arPath
  if (rest.length === 0) {
    return first ? first : ''
  } else {
    return `${first}/${arrayToPath(rest)}`
  }
}

export function arrayToPathSlash(arPath: string[], preAppend?: string) {
  const [first, ...rest] = arPath
  if (rest.length === 0) {
    return first ? first : `${preAppend ? preAppend : ''}/`
  } else {
    return `${preAppend ? preAppend : ''}/${first}/${arrayToPath(rest)}`
  }
}