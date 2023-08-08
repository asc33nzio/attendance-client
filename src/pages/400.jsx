import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Error400 = () => {
    return (
        <Box w={"full"} h={"100vh"} bgGradient="linear(#000000, #FFFFFF)" justify={"center"} align={'center'}>
            <Text pt={"200px"} fontFamily={"Monospace"} fontWeight={"extrabold"} fontSize={{ base: '62px', md: '120px', lg: '90px' }} display={"flex"} justifyContent={"center"}>
                Error 400: Invalid Token.
            </Text>
            <Text fontFamily={"Monospace"} fontSize={{ base: '13px', md: '20px', lg: '20px' }} display={"flex"} justifyContent={"center"}>
                Oops! The token you provided is incorrect. Please contact your HRGA administrator for a renewed registration link.
            </Text>
            <Button as={Link} to={"/"} mt={'50px'}>
                Return Home
            </Button>
        </Box>
    );
};