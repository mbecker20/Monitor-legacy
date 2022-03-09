import { Router, useIsInitialized, useRouter, useFullSelector } from './index'
import { Fragment, useEffect, useState } from "react"
import Login from "./components/Login/Login"
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import IfElse from './kbin-blueprint/IfElse'
import TopBar from './components/TopBar/TopBar'
import SideBar from './components/SideBar/SideBar'
import MainContent from './components/MainContent/MainContent'
import './App.css'
import { useLocalStorage } from './helpers/hooks'
import { FocusStyleManager } from "@blueprintjs/core";
import SearchBar from './components/SearchBar/SearchBar'

FocusStyleManager.onlyShowFocusOnTabs();

function App() {
  const initialized = useIsInitialized()
  const state = useFullSelector()
  const { user } = state
  useRouter()
  const [sidebarOpen, setSidebarOpen] = useLocalStorage(true, 'sidebarOpen')
  const [openSearchBar, setOpenSearchBar] = useState(false)

  const [width, setWidith] = useState(window.innerWidth);
  useEffect(() => {
    const updateWidth = () => setWidith(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }); 
  
  return (
    <Fragment>
      <LoadingScreen initialized={initialized} />
      <IfElse
        showIf={user.username.length > 0}
        show={
          <div className="App">
            <TopBar
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              width={width}
              onSearchClick={() => setOpenSearchBar(!openSearchBar)}
            />
            <SideBar
              open={sidebarOpen}
              width={width}
              closeSidebar={() => setSidebarOpen(false)}
            />
            <MainContent>
              <Router props={{ width }} />
            </MainContent>
            <SearchBar
              state={state}
              isOpen={openSearchBar}
              setOpen={() => setOpenSearchBar(!openSearchBar)}
              width={width}
            />
          </div>
        }
        showElse={<Login />}
      />
    </Fragment>
  );
}

export default App