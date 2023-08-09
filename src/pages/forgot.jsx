import Axios from "axios";
import { Box, Button, Flex, Heading, Input, Text, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Forgot = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    
    const handleForget = async () => {
        try {
            await Axios.post("http://localhost:3369/api/users/forget", { email: email })
            setTimeout(() => {
                navigate("/");
            }, 1000)
            toast({
                title: "Check your e-mail to reset your password!",
                description: "Sent to your Email!",
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: "top"
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Error!",
                description: err.response.data.message,
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top"
            });

        }
    }
    return (
        <>
            <Flex w={"full"} h={"100vh"} bgGradient="linear(#000000, #FFFFFF)" justifyContent={"center"}>
                <Box m={"auto"} bg={"white"} w={{ base: '250px', md: '500px', lg: '600px', xl: "600px" }} h={"350px"} border={"2px solid"} borderColor={"black"} borderRadius={"10px"} boxShadow={"0px 0px 10px black"} justifyContent={"center"}>
                    <Flex justifyContent={"center"}>
                        <Heading mt={"50px"} color={"black"} fontSize={{ base: '20px', md: '40px', lg: '40px' }} fontFamily={"Monospace"}>Forgot your Password?</Heading>
                    </Flex>
                    <Flex mt={"25px"} fontSize={{ base: '8px', md: '12px', lg: '12px' }} justifyContent={"center"} >
                        <Text display={"flex"}>
                            Enter your e-mail to reset your password.
                        </Text>
                    </Flex>
                    <Flex mt={"20px"} justifyContent={"center"}>
                        <Input
                            value={email}
                            onChange={(input) => setEmail(input.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleForget();
                                }
                            }}
                            w={{ base: '200px', md: '400px', lg: '400px' }} placeholder="Email" size={"md"} variant={"flushed"} color={"black"} borderBottom={"2px solid"} borderColor={"#000000"} />
                    </Flex>
                    <Flex mt={"30px"} justifyContent={"center"}>
                        <Button type="submit" onClick={handleForget} fontFamily={"monospace"} boxShadow='0px 0px 6px black' color={"black"} bgGradient="linear(#FFFFFF, #000000)" w={"200px"}>
                            Submit
                        </Button>
                    </Flex>
                    <Flex m={"25px"} fontSize={{ base: '10px', md: '12px', lg: '12px' }} justifyContent={"center"} >
                        <Text display={"flex"}>
                            Already have an account?
                            <Link to="/">
                                <Text _hover={{ color: "red" }} color={"#B0B0B0"}>‎ Sign In.</Text>
                            </Link>
                        </Text>
                    </Flex>
                </Box>
            </Flex>
        </>
    );
};