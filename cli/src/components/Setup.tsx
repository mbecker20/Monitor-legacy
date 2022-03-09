import React from "react";
import { Box, Text } from "ink";

const Setup = (p: { peripheral: boolean | undefined }) => {
  return (
    <Box flexDirection="column">
      <Text>
        setting up{" "}
        <Text color={p.peripheral ? "red" : "cyan"}>
          {p.peripheral ? "a peripheral client..." : "monitor core"}
        </Text>{" "}
        {!p.peripheral && "using the specified configuration..."}
      </Text>
    </Box>
  );
};

export default Setup;
