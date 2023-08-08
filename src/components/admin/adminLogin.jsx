import Axios from "axios";
import * as Yup from "yup";
import { Box, Button, Flex, Input, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Field, ErrorMessage, Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { setValue } from "../../redux/userSlice";
import { useNavigate } from "react-router";

export const AdminLogin = () => {
    const [success, setSuccess] = useState();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const loginSchema = Yup.object().shape({
        username: Yup.string()
            .min(6, 'Reminder: AMS username must be at least 6 characters.')
            .required("Username is required"),
        password: Yup.string()
            .min(6, 'Reminder: AMS password must be at least 6 characters.')
            .matches(/^(?=.*[A-Z])(?=.*\W).+$/, 'Reminder: AMS password must contain a symbol, a number, and an uppercase letter.')
            .required('Password is required.'),
    });
    const handleSubmit = async (data) => {
        try {
            const response = await Axios.post("http://localhost:3369/api/users/admin", data);
            dispatch(setValue(response.data.user));
            localStorage.setItem("token", response.data.token);
            setSuccess(true);
                navigate("/employee");
            toast({
                title: "Welcome!",
                description: "Login Success!",
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: "top"
            });
        } catch (err) {
            toast({
                title: "Access Denied!",
                description: err.response.data.error.message,
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top"
            });
        }
    }
    useEffect(() => {
        if (token) {
            navigate("/employee")
        }
    }, []);
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(value, action) => {
                handleSubmit(value);
                if (success) action.resetForm();
            }}>
            {(props) => {
                return (
                    <Box as={Form}>
                        <Flex justifyContent={"center"}>
                            <VStack>
                                <Field as={Input} name="username" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="Username" size={"md"} variant={"flushed"} color={"black"} borderBottom={"1px solid"} borderColor={"#E0E0E0"} focusBorderColor="#B0B0B0" fontFamily={"Monospace"} />
                                <ErrorMessage component="box" name="username" style={{ color: "red", marginTop: "-8px" }} />
                            </VStack>
                        </Flex>
                        <Flex ml={{ base: '33px', md: '30px', lg: '30px' }} mt={"10px"} justifyContent={"center"}>
                            <VStack>
                                <Field as={Input} name="password" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="Password" size={"md"} type={show ? 'text' : 'password'} variant={"flushed"} color={"black"} borderBottom={"1px solid"} borderColor={"#E0E0E0"} focusBorderColor="#B0B0B0" fontFamily={"Monospace"} />
                                <ErrorMessage
                                    component="box"
                                    name="password"
                                    style={{ color: "red", marginBottom: "-18px", marginTop: "-8px" }} />
                            </VStack>
                            <Button right={"30px"} variant={"unstyled"} size='sm' onClick={handleClick}>
                                {show ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                        </Flex>
                        <Flex mt={"30px"} justifyContent={"center"}>
                            <Button isDisabled={!props.dirty} type="submit" fontFamily={"Monospace"} boxShadow='0px 0px 6px black' color={"black"} bgGradient="linear(#FFFFFF, #000000)" w={"200px"}>
                                Login
                            </Button>
                        </Flex>
                    </Box>
                );
            }}
        </Formik>
    );
};