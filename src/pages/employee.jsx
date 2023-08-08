import { Navbar } from "../components/navbar";
import { Clock } from "../components/clock";
import { Box, Flex } from "@chakra-ui/react";

export const Employee = () => {
    return (
        <Box w={'100vw'} h={'100vh'}>
            <Navbar />
            <Flex justify={'center'} align={'center'} h={'calc(100vh - 50px)'}>
                <Clock />
            </Flex>
        </Box>
    );
};