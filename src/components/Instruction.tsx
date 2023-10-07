import { Box, Button, Flex, Heading, Kbd } from "@chakra-ui/react";

export interface IInstructionProps {
  resetBoard: () => void;
}

const Instruction = ({ resetBoard }: IInstructionProps) => (
  <Box mt={3}>
    <Heading as="h6" size="lg">
      How To Play
    </Heading>
    <Heading as="h5" size="sm" mt={1}>
      NOTE: Start the game with the <Kbd>D</Kbd> key
    </Heading>
    <Flex flexDirection="column" mt={3}>
      <Flex flexDirection={"column"}>
        <span>
          <Kbd>W</Kbd> Move UP
        </span>
        <span>
          <Kbd>S</Kbd> Move DOWN
        </span>
        <span>
          <Kbd>D</Kbd> Move RIGHT
        </span>
        <span>
          <Kbd>A</Kbd> Move LEFT
        </span>
      </Flex>
      <Flex flexDirection="column" ml={5}>
        <Button onClick={() => resetBoard()}>Reset game</Button>
      </Flex>
    </Flex>
  </Box>
);

export default Instruction;
