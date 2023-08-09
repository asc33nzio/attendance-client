import Axios from 'axios';
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';

export default function AddEmployee() {
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [success, setSuccess] = useState();
    const [roles, setRoles] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const Formschema = Yup.object().shape(({
        username: Yup.string()
            .required("Enter a username.")
            .min(6, 'AMS username must be at least 6 characters.')
            .matches(/^(\S+$)/g, 'This field cannot contain blankspaces.'),
        email: Yup.string()
            .email("Invalid e-mail address format.")
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Valid e-mail address format is required.")
            .required("Please include an e-mail address.")
    }));

    useEffect(() => {
        async function fetchRoles() {
            try {
                const response = await Axios.get("http://localhost:3369/api/admin/roles");
                setRoles(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRoles();
    }, []);

    const handleCreate = async (value) => {
        try {
            const { username, email, role } = value;
            const requestData = {
                username: username,
                email: email,
                role: role
            };

            await Axios.post(
                "http://localhost:3369/api/admin",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setSuccess(true);
            toast({
                title: "Success!",
                description: "Preliminary registration successful. Please inform new employee to check their e-mail.",
                status: 'success',
                duration: 1500,
                isClosable: true,
                position: "top"
            });
            setTimeout(() => {
                window.location.reload();
                navigate("/employeeList");
            }, 1000);
        } catch (err) {
            console.log(err);
            toast({
                title: "Failed!",
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
            <Button boxShadow={"0px 0px 5px grey"} bg={"#727272"} color={"white"} w={{ base: '200px', md: '200px', lg: '200px' }} onClick={onOpen}>Add New Employee</Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose} >
                <ModalOverlay />
                <ModalContent borderRadius={"10px"}>
                    <ModalHeader borderTopRadius={"10px"} bg={"#E0E0E0"}>Create a New Employee Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Formik
                            initialValues={{ username: "", email: "", role: "Employee" }}
                            validationSchema={Formschema}
                            onSubmit={(value, action) => {
                                handleCreate(value);
                                if (success) action.resetForm();
                            }}>
                            {() => {
                                return (
                                    <Form>
                                        <FormControl>
                                            <FormLabel>Username</FormLabel>
                                            <Field as={Input} ref={initialRef} variant={"flushed"} placeholder='i.e. : JohnDoe' name="username" borderBottom={"1px solid"} borderColor={"#E0E0E0"} />
                                            <ErrorMessage component="Box" name="username" style={{ color: "red", marginBottom: "-20px", marginLeft: "3px", marginTop: "-9px" }} />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Email</FormLabel>
                                            <Field as={Input} variant={"flushed"} placeholder='i.e. : johndoe@examplemail.com' name='email' borderBottom={"1px solid"} borderColor={"#E0E0E0"} />
                                            <ErrorMessage component="Box" name="email" style={{ color: "red", marginBottom: "-20px", marginLeft: "3px", marginTop: "-9px" }} />
                                        </FormControl>
                                        <FormControl mt={4} mb={"50px"}>
                                            <FormLabel>Role</FormLabel>
                                            <Field as="select" variant={"flushed"} name="role" borderBottom={"1px solid"} borderColor={"#E0E0E0"}>
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.name}>{role.name}</option>
                                                ))}
                                            </Field>
                                        </FormControl>
                                        <Button type='submit' colorScheme='green' mr={3}>Add Employee</Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
};