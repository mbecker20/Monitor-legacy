import { genUpdateID } from "kbin-state";
import { DependencyList, useEffect, useState } from "react";

export function useReRender() {
  const [, toReRender] = useState('')
  let count = 0
  const reRender = () => { 
    toReRender(genUpdateID(count)) 
    count++
  }
  return reRender
}

export function useLocalStorage<T>(defaultStore: T, key: string): [T, (arg: T) => void] {
  const toStore = window.localStorage.getItem(key)
  const [stored, setStore] = useState(toStore ? JSON.parse(toStore) as T : defaultStore)
  return [
    stored,
    (newStore: T) => {
      setStore(newStore)
      window.localStorage.setItem(key, JSON.stringify(newStore))
    }
  ]
}

export function useListener<Event>(listenerID: string, listener: (e: Event) => void, dependencies: DependencyList = []) {
  useEffect(() => {
    window.addEventListener(listenerID, listener as any)
    return () => {
      window.removeEventListener(listenerID, listener as any)
    }
  }, dependencies)
}

export function useReRenderOnResize() {
  const reRender = useReRender()
  useListener('resize', () => {
    window.requestAnimationFrame(reRender)
  })
}

export function useAsyncLoader<T>(loader: () => Promise<T>, init?: T, dependencies: any[] = []): [T | undefined, () => void] {
  const [state, setState] = useState<T | undefined>(init ? init : undefined)
  useEffect(() => {
    loader().then(s => setState(s))
  }, dependencies)
  function reload() {
    loader().then(s => setState(s))
  }
  return [state, reload]
}

export function useEscapeToClose(closeMenu: () => void, dependencies: any[] = []) {
  useListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu()
    }
  }, dependencies)
}

export function useChangedState<T>(initState: T): [T, (state: T) => void, boolean, () => void] {
  const [state, setState] = useState(initState)
  const [changed, setChanged] = useState(false)
  return [
    state,
    (state: T) => {
      setState(state)
      if (!changed) setChanged(true)
    },
    changed,
    () => setChanged(false)
  ]
}

