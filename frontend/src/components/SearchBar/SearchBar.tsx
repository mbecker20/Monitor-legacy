import { HotkeysTarget2, Icon, MenuItem } from "@blueprintjs/core";
import { Omnibar } from "@blueprintjs/select";
import { roughStringsEqual } from "kbin-state";
import { useMemo, useState } from "react";
import Conditional from "../../kbin-blueprint/Conditional";
import { navigateToBuild } from "../../state/builds";
import { navigateToDeployment } from "../../state/deployments";
import { navigateToServer } from "../../state/servers";
import { Build } from "../../state/types/build";
import { Deployment } from "../../state/types/deployment";
import { RootState } from "../../state/types/rootState";
import { Server, Servers } from "../../state/types/server";
import './SearchBar.css'

function SearchBar({
  state,
  isOpen,
  setOpen,
  width
}: {
  state: RootState;
  isOpen: boolean;
  setOpen: () => void;
  width: number;
}) {
  const { deployments, builds, servers } = state;
  const [selectedID, setSelectedID] = useState("");

  const items = useMemo(
    () => [
      ...Object.values(deployments).map((deployment) => ({
        ...deployment,
        type: "Deployment",
      })),
      ...Object.values(builds).map((build) => ({ ...build, type: "Build" })),
      ...Object.values(servers).map((server) => ({
        ...server,
        type: "Server",
      })),
    ],
    [builds, deployments, servers]
  );

  const [queryItems, setQueryItems] = useState(items);

  const onSelect = ({ type, _id }: { type: string; _id: string }) => {
    switch (type) {
      case "Deployment":
        navigateToDeployment(_id);
        break;
      case "Build":
        navigateToBuild(_id);
        break;
      case "Server":
        navigateToServer(_id);
        break;
    }
    setOpen();
  };

  return (
    <HotkeysTarget2
      hotkeys={[
        {
          combo: "shift + s",
          global: true,
          label: "Show Search Bar",
          onKeyDown: () => setOpen(),
          preventDefault: true,
        },
      ]}
    >
      <Omnibar
        isOpen={isOpen}
        items={queryItems}
        itemRenderer={(item) => (
          <SearchItem
            key={item._id}
            item={item}
            servers={servers}
            onClick={() => onSelect(item)}
            selected={item._id === selectedID}
          />
        )}
        onItemSelect={onSelect}
        onClose={() => setOpen()}
        onQueryChange={(query) =>
          setQueryItems(
            items.filter(
              (item) => roughStringsEqual(query, item.name)
              // (item as any).serverID ? roughStringsEqual(query, servers[(item as any).serverID]?.name) : false
            )
          )
        }
        noResults={<MenuItem disabled={true} text="No results." />}
        onActiveItemChange={(item) => {
          if (item) setSelectedID(item._id);
        }}
        className={width < 1000 ? "SearchbarMobile" : ""}
      />
    </HotkeysTarget2>
  );
}

export default SearchBar

function SearchItem({ 
  item, servers, onClick, selected
}: { 
  item: (Deployment | Build | Server) & { type: string } 
  servers: Servers
  onClick: () => void
  selected: boolean
}) {
  return (
    <div 
      className='bp3-menu-item Pointer FlexCol'
      style={{ backgroundColor: selected ? '#106BA3' : undefined }}
      onClick={onClick}
    >
      <div 
        className='SearchItemName' 
        style={{ color: selected ? 'white' : undefined }}
      > 
        {item.name}
      </div>
      <div className='FlexRow CenterAlign'>
        <Conditional showIf={item.type === 'Deployment'}>
          <div className='SearchItemInfo' style={{ color: selected ? 'white' : undefined }}>
            {servers[(item as Deployment).serverID]?.name}
          </div>
          <Icon icon='caret-right' iconSize={16} style={{ color: selected ? 'white' : 'darkslategray', position: 'relative', top: 1 }} />
        </Conditional>
        <div 
          className='SearchItemInfo' 
          style={{ color: selected ? 'white' : undefined }}
        >
          {item.type}
        </div>
      </div>
    </div>
  )
}

