import { MenuItem } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";

export type ConfigItem = {
  title: string
}

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}

function searchConfigs(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

export const renderConfig: ItemRenderer<ConfigItem> = (item, { handleClick, query }, key = 'title') => {
  return (
    <MenuItem
      key={item.title}
      onClick={handleClick}
      text={searchConfigs(item.title, query)}
      intent='none'
      className='bp3-dark'
    />
  )
}
