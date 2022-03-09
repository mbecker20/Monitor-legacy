import { useEffect, useRef, useState } from 'react'
import { select } from '../../../index'
import { sendOverRootWS } from '../../../state/sockets'
import { Button, Icon, Tab, Tabs } from '@blueprintjs/core'
import { useTransition, animated } from 'react-spring'
import './LogCard.css'
import { GET_CONTAINER_LOG } from '../../../state/containers'
import { Log } from '../../../state/types/misc'

let ignore = false
let errIgnore = false

function LogCard({ deploymentID, containerLog }: { deploymentID: string, containerLog: Log }) {
  const logRef = useRef<HTMLDivElement>(null);
  const errLogRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [errScrolled, setErrScrolled] = useState(false);
  
  useEffect(() => {
    const rootWS = select(state => state.rootWS)
    if (rootWS?.readyState === WebSocket.OPEN) {
      sendOverRootWS(GET_CONTAINER_LOG, { deploymentID })
    } else {
      rootWS?.addEventListener('open', () => window.setTimeout(() => sendOverRootWS(GET_CONTAINER_LOG, { deploymentID }), 1000))
    }
    // if (select(({ logWS }) => logWS?.deploymentID !== deploymentID)) {
    //   dispatch(setLogWS(deploymentID))
    // } 
  }, [deploymentID])
  
  useEffect(() => {
    if (logRef.current && !scrolled) {
      ignore = true;
      logRef.current.scroll({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        ignore = false;
      }, 1500);
    }
  });
  useEffect(() => {
    if (errLogRef.current && !errScrolled) {
      errIgnore = true;
      errLogRef.current.scroll({
        top: errLogRef.current.scrollHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        errIgnore = false;
      }, 1500);
    }
  });

  const transitions = useTransition(scrolled, {
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' },
    config: {
      tension: 250
    },
  });
  
  const errTransitions = useTransition(errScrolled, {
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
    config: {
      tension: 250,
    },
  });


  return (
    <div style={{ backgroundColor: "var(--gray3)" }}>
      <Tabs>
        <Tab
          id="mainlog"
          title="Main Log"
          className="DCTabs"
          onSelect={() => console.log("main slelected")}
          panel={
            <div className="Log">
              <div
                className="LogBody"
                ref={logRef}
                onScroll={(e) => {
                  if (!ignore) {
                    if (
                      logRef.current &&
                      (logRef.current.scrollHeight -
                        logRef.current.scrollTop -
                        logRef.current.clientHeight) /
                        logRef.current.scrollHeight <
                        0.01
                    ) {
                      console.log("start auto scroll");
                      setScrolled(false);
                    } else if (!scrolled) {
                      console.log("end auto scroll");
                      setScrolled(true);
                    }
                  }
                }}
              >
                {containerLog ? containerLog.stdout : "No Log"}
              </div>
              <div
                style={{
                  height: 0,
                  position: "relative",
                  top: "-2rem",
                  alignSelf: "flex-end",
                }}
              >
                {transitions(
                  (style, item) =>
                    item && (
                      <animated.div style={style}>
                        <Button
                          icon="chevron-down"
                          large
                          intent="primary"
                          onClick={() => setScrolled(!scrolled)}
                          className="DownButton"
                        />
                      </animated.div>
                    )
                )}
              </div>
            </div>
          }
        />
        <Tab
          id="errorlog"
          title={
            <div style={{display: 'flex', alignItems: 'center'}}>
              Error Log
              {containerLog.stderr && containerLog.stderr.length > 0 && (
                <Icon icon='error' intent='danger' style={{marginLeft: '0.25rem'}} />
              )}
            </div>
          }
          className="DCTabs"
          panel={
            <div className="Log">
              <div
                className="LogBody"
                ref={errLogRef}
                onScroll={(e) => {
                  if (!errIgnore) {
                    if (
                      errLogRef.current &&
                      (errLogRef.current.scrollHeight -
                        errLogRef.current.scrollTop -
                        errLogRef.current.clientHeight) /
                        errLogRef.current.scrollHeight <
                        0.01
                    ) {
                      console.log("start auto scroll");
                      setErrScrolled(false);
                    } else if (!errScrolled) {
                      console.log("end auto scroll");
                      setErrScrolled(true);
                    }
                  }
                }}
              >
                {containerLog
                  ? containerLog.stderr && containerLog.stderr.length > 0
                    ? containerLog.stderr
                    : "No Log"
                  : "No Log"}
              </div>
              <div
                style={{
                  height: 0,
                  position: "relative",
                  top: "-2rem",
                  alignSelf: "flex-end",
                }}
              >
                {errTransitions(
                  (style, item) =>
                    item && (
                      <animated.div style={style}>
                        <Button
                          icon="chevron-down"
                          large
                          intent="primary"
                          onClick={() => setErrScrolled(!errScrolled)}
                          className="DownButton"
                        />
                      </animated.div>
                    )
                )}
              </div>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}

export default LogCard