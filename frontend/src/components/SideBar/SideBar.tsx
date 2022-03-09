import './SideBar.css'
import ServerTree from "./ServerTree/ServerTree"
import { animated, useTransition } from 'react-spring'
import BuildsTree from './BuildsTree/BuildsTree';
import CollectionsTree from './CollectionsTree/CollectionsTree';
import CreatorButtons from './CreatorButtons/CreatorButtons';
import Conditional from '../../kbin-blueprint/Conditional';
import { useFullSelector } from '../..';

function SideBar({ open, width, closeSidebar }: { open: boolean, width: number, closeSidebar: () => void }) {
  const { user } = useFullSelector()
  
  const transitions = useTransition(open, {
    from: {
      width: width > 1000 ? "0rem" : "0vw",
      marginRight: "0rem",
      padding: "0rem",
      opacity: 0,
    },
    enter: {
      width: width > 1000 ? "20rem" : "100vw",
      marginRight: "1rem",
      padding: "0.5rem",
      opacity: 1,
    },
    leave: {
      width: width > 1000 ? "0rem" : "0vw",
      marginRight: "0rem",
      padding: "0rem",
      opacity: 0,
    },
    config: {
      tension: 300,
      clamp: true,
    },
  });

  return transitions(
    (styles, item) =>
      item && (
        <animated.div
          className={width > 1000 ? "SideBar" : "SideBarMobile"}
          style={styles}
        >
          <div style={{ overflowY: "auto" }}>
            <CollectionsTree width={width} closeSidebar={closeSidebar} />
            <ServerTree width={width} closeSidebar={closeSidebar} />
            <BuildsTree width={width} closeSidebar={closeSidebar} />
            <Conditional showIf={user.permissions >= 1}>
              <CreatorButtons width={width} closeSidebar={closeSidebar} />
            </Conditional>
          </div>
        </animated.div>
      )
  );
}

export default SideBar