import Axios from 'axios';
import * as Yup from "yup";
import { useRef, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import { EditIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input, FormControl, FormLabel, useToast, Flex, Box, } from '@chakra-ui/react';

export default function UpdateEmployee({ id, username, email }) {
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const toast = useToast();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [file, setFile] = useState(null);
    const Formschema = Yup.object().shape(({
        username: Yup.string()
            .required("Write your name"),
        email: Yup.string()
            .email("Invalid email addres format")
            .required("Write your Email"),
        avatar: Yup.string()
            .required("Add image"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password minimum 6 characters long")
            .matches(/^(?=.*[A-Z])/, "Password Must Contain 1 Capital")
            .matches(/^(?=.*(\W|_))/, "Password Must Contain 1 Symbol")
            .matches(/.*[0-9].*/, "Password Must Contain 1 number"),
    }));
    const handleCreate = async (value) => {
        try {
            const data = new FormData();
            const { username, email, password } = value;
            data.append("username", { username }.username);
            data.append("email", { email }.email);
            data.append("password", { password }.password);
            data.append("avatar", file);
            await Axios.patch(`http://localhost:3369/api/admin/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
                "content-Type": "Multipart/form-data"
            });
            toast({
                title: "Employee Updated!",
                description: "Employee data updated!",
                status: 'success',
                duration: 1000,
                isClosable: true,
                position: "top"
            });
            setTimeout(() => {
                window.location.reload();
                navigate("/employeelist");
            }, 1000);
        } catch (err) {
            toast({
                title: "Employee Update Failed",
                description: err.response.data.message,
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: "top"
            });
            console.error(err);
        }
    }
    return (
        <>
            <Button borderRadius={"70px"} color={"white"} bg={"blue.700"} onClick={onOpen}><EditIcon /> </Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose} >
                <ModalOverlay />
                <ModalContent borderRadius={"10px"}>
                    <ModalHeader borderTopRadius={"10px"} bg={"#414141"} color={'black'}>Update Employee Data</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Formik
                            initialValues={{ username: username, email: email, avatar: null }}
                            validationSchema={Formschema}
                            onSubmit={(value, action) => {
                                handleCreate(value);
                            }}>
                            {() => {
                                return (
                                    <Form>
                                        <FormControl>
                                            <FormLabel>Username</FormLabel>
                                            <Field as={Input} ref={initialRef} borderBottom={"1px solid"} borderColor={"#D5AD18"} variant={"flushed"} placeholder='Username' name="username" />
                                            <ErrorMessage component="Box" name="username" style={{ color: "red", marginBottom: "-20px", marginLeft: "3px", marginTop: "-9px" }} />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Email</FormLabel>
                                            <Field as={Input} variant={"flushed"} borderBottom={"1px solid"} borderColor={"#D5AD18"} placeholder='Email' name='email' />
                                            <ErrorMessage component="Box" name="email" style={{ color: "red", marginBottom: "-20px", marginLeft: "3px", marginTop: "-9px" }} />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Password</FormLabel>
                                            <Flex>
                                                <Box>
                                                    <Field as={Input} name="password" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="Password" size={"md"} type={show ? 'text' : 'password'} variant={"flushed"} color={"black"} borderBottom={"1px solid"} borderColor={"#D5AD18"} />
                                                    <ErrorMessage
                                                        component="box"
                                                        name="password"
                                                        style={{ color: "red", marginBottom: "-18px", marginTop: "-8px" }} />
                                                </Box>

                                                <Button right={"30px"} variant={"unstyled"} size='sm' onClick={handleClick}>
                                                    {show ? <ViewIcon /> : <ViewOffIcon />}
                                                </Button>
                                            </Flex>
                                        </FormControl>
                                        <Field name="avatar">
                                            {({ field }) => (
                                                <FormControl mt={4}>
                                                    <FormLabel>Photo</FormLabel>
                                                    <Input mb={"25px"}  {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setFile(e.target.files[0]);
                                                        }} variant={"flushed"} borderBottom={"1px solid"} borderColor={"#D5AD18"} placeholder='Photo' name='avatar' as={Field} type='file' />
                                                    <ErrorMessage component="Box" name="avatar" style={{ color: "red", marginBottom: "-20px", marginLeft: "3px", marginTop: "-9px" }} />
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Button type='submit' colorScheme='green' mr={3}>Update Employee</Button>
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