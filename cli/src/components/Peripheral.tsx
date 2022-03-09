import React from "react";
import { Box, Newline, Text } from "ink";
import Selector from "./util/Selector";
import { SetConfig } from "../types";

const Peripheral = (p: {
  setPeripheral: (a: boolean) => void;
  next: () => void;
}) => {
  return (
    <Box flexDirection="column">
      <Text>
        Are you setting up <Text color="cyan">monitor core</Text> or a{" "}
        <Text color="red">peripheral server</Text>?
      </Text>
      <Newline />
      <Selector
        items={["core", "peripheral"]}
        onSelect={(item) => {
          p.setPeripheral(item === "peripheral");
          p.next();
        }}
      />
    </Box>
  );
};

export default Peripheral;
