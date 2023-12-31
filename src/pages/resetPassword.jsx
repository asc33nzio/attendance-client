import Axios from "axios";
import * as Yup from "yup";
import { Box, Button, Flex, Heading, Input, VStack, useToast } from "@chakra-ui/react";
import { Field, ErrorMessage, Formik, Form } from "formik";
import { useNavigate, useParams } from "react-router";

export const ResetPassword = () => {
    const navigate = useNavigate()
    const toast = useToast();
    const { token } = useParams();
    const Resetschema = Yup.object().shape(({
        newPassword: Yup.string()
            .required("Password is required.")
            .min(6, "Password must be at least 6 characters long.")
            .matches(/^(?=.*[A-Z])/, "Password must contain at least 1 capital letter.")
            .matches(/^(?=.*(\W|_))/, "Password must contain at least 1 symbol.")
            .matches(/.*[0-9].*/, "Password must contain at least 1 number."),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Password does not match.")
            .required("Please enter password confirmation."),
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
                description: "You can login with your new password!",
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
                description: "Password reset unsuccessful. Please try again.",
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
                boxShadow='0px 0px 6px black' bgGradient={"linear(yellow.500,#FFC900)"}>
                <Flex margin={"auto"} borderRadius={"10px"} justifyContent={"center"}
                    boxShadow='0px 0px 6px black' bg={"white"} w={"700px"} h={"450px"}>
                    <Box justifyContent={"center"}>
                        <Heading mt={{ base: '68px', md: '55px', lg: '80px' }} color={"#D5AD18"} fontSize={{ base: '30px', md: '40px', lg: '60px', xl: "60px" }} fontFamily={"Monospace"}>Reset Password!</Heading>
                        <Formik
                            initialValues={{ newPassword: "", confirmPassword: "" }}
                            validationSchema={Resetschema}
                            onSubmit={(value, action) => {
                                handleReset(value);
                            }}>
                            {(props) => {
                                return (
                                    <Box as={Form}>
                                        <Flex mt={"50px"} justifyContent={"center"}>
                                            <VStack>
                                                <Field as={Input} name="newPassword" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="New Password" size={"md"} variant={"flushed"} color={"black"} borderBottom={"2px solid"} borderColor={"#D5AD18"} />
                                                <ErrorMessage component="box" name="newPassword" style={{ color: "red", marginTop: "-8px" }} />
                                            </VStack>
                                        </Flex>
                                        <Flex mt={"10px"} justifyContent={"center"}>
                                            <VStack>
                                                <Field as={Input} name="confirmPassword" w={{ base: '180px', md: '400px', lg: '400px' }} placeholder="Confirm Password" size={"md"} variant={"flushed"} color={"black"} borderBottom={"2px solid"} borderColor={"#D5AD18"} />
                                                <ErrorMessage
                                                    component="box"
                                                    name="confirmPassword"
                                                    style={{ color: "red", marginBottom: "-18px", marginTop: "-8px" }} />
                                            </VStack>
                                        </Flex>
                                        <Flex mt={"30px"} justifyContent={"center"}>
                                            <Button isDisabled={!props.dirty} type="submit" fontFamily={"Monospace"} boxShadow='0px 0px 6px black' color={"black"} bgGradient="linear(#FFEA61, #FFC900)" w={"200px"}>
                                                Login
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
};