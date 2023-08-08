import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react';
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { EmployeeLogin } from '../components/employee/employeeLogin';
import { AdminLogin } from '../components/admin/adminLogin';
import { Link } from 'react-router-dom';

export const Login = () => {
    return (
        <>
            <Flex w={"full"} h={"100vh"} bgGradient="linear(#000000, #FFFFFF)" justifyContent={"center"}>
                <Box margin={"auto"} bg={"white"} w={{ base: '300px', md: '550px', lg: '650px', xl: "650px" }} h={"550px"} border={"2px solid"} borderColor={"black"} borderRadius={"10px"} boxShadow={"0px 0px 10px black"} justifyContent={"center"}>
                    <Flex justifyContent={"center"}>
                        <Heading mt={{ base: '58px', md: '55px', lg: '45px' }} color={"#414141"} fontSize={{ base: '30px', md: '40px', lg: '60px', xl: "60px" }} fontFamily={"Cascadia Mono"}>◈Ⓛ◈Ⓞ◈Ⓖ◈Ⓘ◈Ⓝ◈</Heading>
                    </Flex>
                    <Flex mt={"25px"} fontSize={{ base: '10px', md: '12px', lg: '12px', xl: "12px" }} justifyContent={"center"} fontFamily={"Monospace"}>
                        <Text display={"flex"}>  Forget your Password?
                            <Link to="/forgetpassword">
                                <Text _hover={{ color: "red" }} color={"#B0B0B0"}>‎ Click here.</Text>
                            </Link>
                        </Text>
                    </Flex>
                    <Flex mt={"20px"} fontSize={"25px"} color={"#414141"} justifyContent={"center"} >
                        <Text display={"flex"} fontFamily={"Cascadia Mono"}>Login As</Text>
                    </Flex>
                    <Tabs mt={"10px"} align={"center"} variant="unstyled">
                        <TabList>
                            <Tab fontFamily={"Cascadia Mono"} fontSize={{ base: '11px', md: '18px', lg: '18px' }}>Employee</Tab>
                            <Text color={"#414141"} mt={{ base: '6px', md: '5px', lg: '7px' }} fontSize={{ base: '11px', md: '20px', lg: '18px' }}>or</Text>
                            <Tab fontFamily={"Cascadia Mono"} fontSize={{ base: '11px', md: '18px', lg: '18px' }}>Admin</Tab>
                        </TabList>
                        <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
                        <TabPanels>
                            <TabPanel>
                                <EmployeeLogin />
                            </TabPanel>
                            <TabPanel>
                                <AdminLogin />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>
        </>
    );
}