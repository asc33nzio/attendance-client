import Axios from "axios";
import AddEmployee from "../components/admin/addEmployee";
import UpdateEmployee from "../components/admin/updateEmployee";
import { Avatar, Box, Button, Flex, HStack, Text, useToast } from "@chakra-ui/react";
import { Navbar } from "../components/navbar";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, } from '@chakra-ui/react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DeleteButton } from "../components/admin/deleteButton";
import { useSelector } from "react-redux";
import { EditSalary } from "../components/admin/editSalary";

export const EmployeeList = () => {
    const token = localStorage.getItem("token");
    const toast = useToast();
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [reload, setReload] = useState(true);
    const userData = useSelector(state => state.user.value);

    if (userData.isAdmin === false) {
        toast({
            title: "Forbidden!",
            description: "You are not an administrator.",
            status: "error",
            duration: 3500,
            isClosable: true,
            position: "top"
        });
        navigate("/")
    };

    const getEmployees = async (data) => {
        try {
            const response = await Axios.get("http://localhost:3369/api/admin/all", data);
            setData(response.data);
        } catch (error) {
            console.log(error);
        };
    };

    const handleSuspend = async (id) => {
        try {
            await Axios.patch(`http://localhost:3369/api/admin/suspend/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                "content-Type": "Multiple/form-data"
            });
            toast({
                title: "Employee status changed!",
                description: "Employee account status updated.",
                status: "warning",
                duration: 3500,
                isClosable: true,
                position: "top"
            });
            setReload(!reload);
        } catch (error) {
            console.log(error);
        };
    };
    useEffect(() => {
        getEmployees();
        if (!token) {
            navigate("/")
        }
    }, [reload]);
    return (
        <>
            <Flex mt={"0px"}>
                <Navbar />
            </Flex>
            <Flex mt={"195px"} justifyContent={"center"}>
                <Text mt={"10px"} borderBottom={"2px solid"} fontFamily={"Monospace"} fontSize={"35px"}>SCP AMS Employee Data</Text>
            </Flex>
            <HStack mt={"20px"} spacing={'25px'} justifyContent={"center"}>
                <AddEmployee />
                <EditSalary />
            </HStack>
            <Flex mt={"40px"} justifyContent={"center"}>
                <Box>
                    <TableContainer w={{ base: '250px', md: '800px', lg: '900px', xl: "1200px" }}>
                        <Table variant='simple' >
                            <Thead >
                                <Tr >
                                    <Th textAlign={"center"}>Photo</Th>
                                    <Th textAlign={"center"}>Username</Th>
                                    <Th textAlign={"center"}>Email</Th>
                                    <Th textAlign={"center"}>Status</Th>
                                    <Th textAlign={"center"}>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {data?.map((item) => {
                                    return (
                                        <Tr>
                                            <Td textAlign={"center"}><Avatar boxShadow={"0px 0px 10px grey"} src={`http://localhost:3369/avatars/${item.avatar}`} /></Td>
                                            <Td textAlign={"center"}>{item.username}</Td>
                                            <Td textAlign={"center"}>{item.email}</Td>
                                            {item.isSuspended ? (
                                                <Td><Flex boxShadow={"0px 0px 10px grey"} ml={"55px"} justifyContent={"center"} bgColor={"red.400"} h={"30px"} w={"100px"} lineHeight={"30px"} color={"white"} borderRadius={"5px"}>Supended</Flex></Td>
                                            ) : (
                                                <Td><Flex boxShadow={"0px 0px 10px grey"} ml={"55px"} justifyContent={"center"} bgColor={"green.400"} h={"30px"} w={"100px"} lineHeight={"30px"} color={"white"} borderRadius={"5px"}>Active</Flex></Td>
                                            )}
                                            <Td display={"flex"} justifyContent={"center"} >
                                                <UpdateEmployee id={item.id} username={item.username} email={item.email} />
                                                <DeleteButton id={item.id} />
                                                {item.isSuspended ? (<Button w={"90px"} borderRadius={"70px"} onClick={() => handleSuspend(item.id)} color={"white"} bg={"Teal"} ml={"5px"}>Activate</Button>) : (<Button Button w={"90px"} borderRadius={"70px"} onClick={() => handleSuspend(item.id)} color={"white"} bg={"#D5AD18"} ml={"5px"}>Suspend</Button>)}
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Flex>
        </>
    )
};