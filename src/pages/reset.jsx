import Axios from "axios";
import * as Yup from "yup";
import { Box, Button, Flex, Heading, Input, VStack, useToast } from "@chakra-ui/react";
import { Field, ErrorMessage, Formik, Form } from "formik";
import { useNavigate, useParams } from "react-router";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

export const Reset = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleClickNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleClickConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const { token } = useParams();
    const navigate = useNavigate()
    const toast = useToast();
    const Resetschema = Yup.object().shape(({
        newPassword: Yup.string()
            .min(6, 'Password must be at least 6 characters.')
            .matches(/^(?=.*[A-Z])(?=.*\W)(?=.*\d).+$/, 'Password must contain an uppercase letter, a symbol, and a number.')
            .required('Password is required.'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match.')
            .required('Confirm Password is required.'),
    }));

    const handleReset = async (values) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            await Axios.patch(`http://localhost:3369/api/users/resetpassword`,
                {
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword
                },
                { headers }
            );

            toast({
                title: "Password Updated!",
                description: "You can now login with your new password!",
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: "top"
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            toast({
                title: "Failed to Reset",
                description: error.response.data.message,
                status: 'error',
                duration: 2500,
                isClosable: true,
                position: "top"
            });
        }
    };
    return (
        <>
            <Flex w={"full"} h={"100vh"} justifyContent={"center"} margin={"auto"} borderRadius={"10px"}
                boxShadow='0px 0px 6px black' bgGradient={"linear(#FFFFFF, #000000)"}>
                <Flex margin={"auto"} borderRadius={"10px"} justifyContent={"center"}
                    boxShadow='0px 0px 6px black' bg={"white"} w={"700px"} h={"450px"}>
                    <Box justifyContent={"center"}>
                        <Heading mt={{ base: '68px', md: '55px', lg: '80px' }} color={"black"} fontSize={{ base: '30px', md: '40px', lg: '60px', xl: "60px" }} fontFamily={"Monospace"}>Reset Password</Heading>
                        <Formik
                            initialValues={{ newPassword: "", confirmPassword: "" }}
                            validationSchema={Resetschema}
                            onSubmit={(values) => {
                                handleReset(values);
                            }}>
                            {(props) => {
                                return (
                                    <Box as={Form}>
                                        <Flex mt={"50px"} justifyContent={"center"}>
                                            <VStack>
                                                <Flex alignItems="center">
                                                    <Field as={Input} name="newPassword" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="New Password" size={"md"} variant={"flushed"} color={"black"} borderBottom={"2px solid"} borderColor={"#000000"} type={showNewPassword ? 'text' : 'password'} />
                                                    <Button variant={"unstyled"} size='md' onClick={handleClickNewPassword}>
                                                        {showNewPassword ? <ViewIcon /> : <ViewOffIcon />}
                                                    </Button>
                                                </Flex>
                                                <ErrorMessage component="box" name="newPassword" style={{ color: "red", marginTop: "-8px" }} />
                                            </VStack>
                                        </Flex>
                                        <Flex mt={"10px"} justifyContent={"center"}>
                                            <VStack>
                                                <Flex alignItems="center">
                                                    <Field as={Input} name="confirmPassword" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="Confirm Password" size={"md"} variant={"flushed"} color={"black"} borderBottom={"2px solid"} borderColor={"#000000"} type={showConfirmPassword ? 'text' : 'password'} />
                                                    <Button variant={"unstyled"} size='md' onClick={handleClickConfirmPassword}>
                                                        {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                                                    </Button>
                                                </Flex>
                                                <ErrorMessage component="box" name="confirmPassword" style={{ color: "red", marginBottom: "-18px", marginTop: "-8px" }} />
                                            </VStack>
                                        </Flex>
                                        <Flex mt={"30px"} justifyContent={"center"}>
                                            <Button isDisabled={!props.dirty} type="submit" fontFamily={"Monospace"} boxShadow='0px 0px 6px black' color={"black"} bgGradient="linear(#000000, #FFFFFF)" w={"200px"}>
                                                Confirm Reset
                                            </Button>
                                        </Flex>
                                    </Box>
                                );
                            }}
                        </Formik>
                    </Box >
                </Flex>
            </Flex>
        </>
    );
}