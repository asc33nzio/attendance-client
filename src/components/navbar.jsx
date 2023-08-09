import Axios from "axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setValue } from '../redux/userSlice';
import { Avatar, Box, Flex, IconButton, Img, Stack, Text, useToast } from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem, Portal } from '@chakra-ui/react';
import { Link, useNavigate } from "react-router-dom";
import SCP_AMS_LOGO from "../public/SCP_AMS.png";

export const Navbar = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const data = useSelector((state) => state.user.value);

    const onLogout = () => {
        localStorage.removeItem("token");
        toast({
            title: "Good Bye!",
            description: "You have successfully logged out!",
            colorScheme: "red",
            status: 'success',
            duration: 1500,
            isClosable: true,
            position: "top"
        });
        setTimeout(() => {
            navigate("/");
        }, 500);
    };

    useEffect(() => {
        const keepLogin = async () => {
            try {
                const response = await Axios.get(`http://localhost:3369/api/users/keeplogin`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch(setValue(response.data));
            } catch (error) {
                localStorage.removeItem("token");
                toast({
                    title: "Session Ended.",
                    description: "Your login session has ended. Please login again.",
                    colorScheme: "red",
                    status: 'success',
                    duration: 1500,
                    isClosable: true,
                    position: "top"
                });
                setTimeout(() => {
                    navigate("/");
                }, 500);
                console.log(error);
            }
        };
        keepLogin();
    }, [dispatch, token, navigate, toast]);

    return (
        <Box zIndex={"100"} position={"fixed"}>
            <Flex boxShadow={"0px 0px 10px grey"} p={{ base: '25px', sm: '25px' }} alignItems={"center"} w={{ base: '100vw', md: '100vw', sm: '100vw', lg: '100vw' }} h={'150px'} bgColor={"#000000"} >
                <Box w={"20%"}>
                    <Box as={Link} to={"/employee"} color={"white"} fontSize={"30px"} fontWeight={"thin"} textShadow={"0px 0px 5px white"}>
                        <Img src={SCP_AMS_LOGO} w={"150px"} h={"150px"} />
                    </Box>
                </Box>
                <Stack w={"100vw"} _focus={{ borderColor: '#D5AD18', boxShadow: 'none', transform: 'scale(1.01)' }} marginRight="250px">
                    <Text color={'white'} textAlign={'left'} fontFamily={'monospace'}>
                        Greetings {data.firstName} {data.lastName}. Please don't forget to check in today.
                    </Text>
                    <Text color={'white'} textAlign={'left'} mt={'-10px'} fontFamily={'monospace'}>
                        Have a nice day!
                    </Text>
                </Stack>
                <Flex justifyContent={"end"} align={"center"} w={"20%"}>
                    <Flex cursor={"pointer"} onClick={() => navigate("/history")} _active={{ transition: "0.1s", transform: "scale(0.95)" }} alignItems={"center"} p={"10px"} borderRadius={"5px"} color={"white"} h={{ base: '30px', sm: '40px', md: '40px' }}>
                        <SearchIcon boxSize={{ base: "25px" }} />
                    </Flex>
                    <Avatar as={Link} to={"/profile"} left={"20px"} boxShadow={"0px 0px 10px grey"} src={`http://localhost:3369/avatars/${data.avatar}`} bgColor={"gray.400"} colorScheme={"#FFC900"} />
                    <Menu>
                        <MenuButton as={IconButton} left={"28px"}
                            mt={"3px"}
                            color={"white"}
                            aria-label='Options'
                            icon={<HamburgerIcon />}
                            variant="unstyled">
                        </MenuButton>
                        <Portal>
                            <MenuList boxShadow={"0px 0px 5px grey"} zIndex={100}>
                                <MenuItem>
                                    <Box mt={"2px"}>
                                        <Text fontWeight={"bold"}>{data.username}</Text>
                                        <Text fontSize={"12px"}>{data.email}</Text>
                                    </Box>
                                </MenuItem>
                                <MenuItem as={Link} to="/">Home</MenuItem>
                                <MenuItem as={Link} to="/profile">Profile</MenuItem>
                                <MenuItem as={Link} to="/history">Attendance History</MenuItem>
                                <MenuItem as={Link} to="/payroll">Payroll Report</MenuItem>
                                {data.isAdmin ? (
                                    <Box>
                                        <MenuItem as={Link} to="/employeelist">Employee List</MenuItem>
                                    </Box>
                                ) : (null)}
                                <MenuItem fontWeight={"bold"} color={"red"} onClick={onLogout}>Log Out</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Flex>
            </Flex>
        </Box>
    )
};