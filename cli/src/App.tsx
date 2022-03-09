import React, { ReactNode, useState } from "react";
import { Box, Newline, Text, useInput } from "ink";
import Builds from "./components/Builds";
import FinalConfig from "./components/FinalConfig";
import { useConfig, useSequence } from "./hooks";
import { Config } from "./types";
import Intro from "./components/Intro";
import Setup from "./components/Setup";
import Peripheral from "./components/Peripheral";

const App = () => {
  const [current, next, prev] = useSequence();
  const [peripheral, setPeripheral] = useState<boolean>();
  const [installing, setInstalling] = useState(false);
  const [config, setConfig] = useConfig<Config>({
    useBuilds: false,
  });

  const corePages: ReactNode[] = [<Builds setConfig={setConfig} next={next} />];

  const peripheralPages: ReactNode[] = [];

  const pages: ReactNode[] = [
    <Intro next={next} />,
    <Peripheral setPeripheral={setPeripheral} next={next} />,
    ...(peripheral === true ? peripheralPages : []),
    ...(peripheral === false ? corePages : []),
    <FinalConfig
      peripheral={peripheral}
      config={config}
      onConfirm={() => {
        next();
        setInstalling(true);
      }}
    />,
    <Setup peripheral={peripheral} />,
  ];

  useInput((_, key) => {
    if (!installing && key.escape) prev();
  });
  return (
    <Box flexDirection="column">
      <Newline />
      <Text color="blue" bold underline>
        Monitor CLI
      </Text>
      <Newline />
      {pages[current]}
    </Box>
  );
};

export default App;
