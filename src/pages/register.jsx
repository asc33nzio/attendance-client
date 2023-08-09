import * as Yup from 'yup';
import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Box, FormControl, FormLabel, Input, Button, Flex, Text, Alert, AlertIcon, CloseButton, useToast } from '@chakra-ui/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { omit } from 'lodash';

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters.')
        .matches(/^(?=.*[A-Z])(?=.*\W)(?=.*\d).+$/, 'Password must contain an uppercase letter, a symbol, and a number.')
        .required('Password is required.'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match.')
        .required('Confirm Password is required.'),
    firstName: Yup.string()
        .required('First name is required.'),
    lastName: Yup.string()
        .required('Last name is required.'),
    birthDate: Yup.string()
        .test('valid-date-format', 'Invalid date format. Please use YYYY-MM-DD format.', (value) => {
            if (!value) return false;
            const regex = /^(?!0000)[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;
            return regex.test(value);
        })
        .required('Birth date is required.'),
    avatar: Yup.mixed()
        .test('file-size', 'File size is too large', (value) => {
            if (!value) return true;
            return value.size <= 1024 * 1024;
        })
        .test('file-type', 'Unsupported file type', (value) => {
            if (!value) return true;
            return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(value.type);
        })
        .required('Your photo is required.'),
});

export const Register = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const toast = useToast();
    let decodedToken;
    try {
        decodedToken = jwt_decode(token);
    } catch (error) {
        navigate("/400");
    };

    if (!decodedToken) {
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
        )
    };

    const { username, email } = decodedToken;

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const valuesToSend = omit(values, 'confirmPassword');

            const formData = new FormData();
            formData.append('firstName', valuesToSend.firstName);
            formData.append('lastName', valuesToSend.lastName);
            formData.append('birthDate', valuesToSend.birthDate);
            formData.append('password', valuesToSend.password);
            formData.append('avatar', values.avatar);

            await axios.post(`http://localhost:3369/api/admin/${token}`, formData);
            navigate("/")
            setSubmitting(false);
        } catch (error) {
            setErrors({ submit: 'Failed to register. Please try again.' });
            setSubmitting(false);
            toast({
                title: "Failed to Register",
                description: error.response.data.message,
                status: 'error',
                duration: 2500,
                isClosable: true,
                position: "top"
            });
        }
    };

    const initialValues = {
        firstName: "",
        lastName: "",
        birthDate: "",
        password: '',
        avatar: ''
    };

    return (
        <Flex justify="center" align="center" height="130vh" bgGradient="linear(#FFFFFF, #000000)">
            <Box bgGradient="linear(#414141, #FFFFFF)" p={8} borderRadius="md" maxWidth={400} width="100%">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <FormControl mb={4}>
                                <FormLabel htmlFor="username" color='black' >Username</FormLabel>
                                <Field as={Input} type="text" id="username" name="username" color='white' defaultValue={username} readOnly focusBorderColor='black' />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="email" color='black' >Email</FormLabel>
                                <Field as={Input} type="email" id="email" name="email" color='white' defaultValue={email} readOnly focusBorderColor='black'/>
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="firstName" color='black' >First Name</FormLabel>
                                <Field as={Input} type="text" id="firstName" name="firstName" color='black' placeholder={"Enter your first name."} focusBorderColor='black'/>
                                <ErrorMessage name="firstName" component={Text} color="red" fontSize="xs" mt={1} />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="lastName" color='black' >Last Name</FormLabel>
                                <Field as={Input} type="text" id="lastName" name="lastName" color='black' placeholder={"Enter your last name."} focusBorderColor='black'/>
                                <ErrorMessage name="lastName" component={Text} color="red" fontSize="xs" mt={1} />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="birthDate" color='black' >Date of Birth</FormLabel>
                                <Field as={Input} type="text" id="birthDate" name="birthDate" color='black' placeholder={"YYYY-MM-DD"} focusBorderColor='black'/>
                                <ErrorMessage name="birthDate" component={Text} color="red" fontSize="xs" mt={1} />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="password" color='black' >Password</FormLabel>
                                <Field as={Input} type="password" id="password" name="password" color='black' placeholder={"Enter a strong password."} focusBorderColor='black'/>
                                <ErrorMessage name="password" component={Text} color="red" fontSize="xs" mt={1} />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="confirmPassword" color='black' >Confirm Password</FormLabel>
                                <Field as={Input} type="password" id="confirmPassword" name="confirmPassword" color='black' placeholder={"Confirm your password."} focusBorderColor='black'/>
                                <ErrorMessage name="confirmPassword" component={Text} color="red" fontSize="xs" mt={1} />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel htmlFor="avatar" color='black'>Avatar</FormLabel>
                                <Field name="avatar">
                                    {({ field, form }) => (
                                        <input
                                            type="file"
                                            id="avatar"
                                            name="avatar"
                                            onChange={(event) => {
                                                const selectedFile = event.currentTarget.files[0];
                                                console.log('Selected File:', selectedFile);
                                                form.setFieldValue("avatar", selectedFile);
                                            }}
                                            accept=".jpg, .jpeg, .webp, .png, .gif"
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="avatar" component={Text} color="red" fontSize="xs" mt={1} />
                            </FormControl>

                            <Flex justify="space-between">
                                <Link to={'/'}>
                                    <Button colorScheme="red" mb={2}>
                                        Return Home
                                    </Button>
                                </Link>

                                <Button type="submit" colorScheme="green" isLoading={isSubmitting} mb={2}>
                                    Register
                                </Button>
                            </Flex>

                            <ErrorMessage name="submit">
                                {errorMessage => (
                                    <Alert status="error" mb={4}>
                                        <AlertIcon />
                                        {errorMessage}
                                        <CloseButton position="absolute" right="8px" top="8px" onClick={() => errorMessage.setErrors(null)} />
                                    </Alert>
                                )}
                            </ErrorMessage>
                        </Form>
                    )}
                </Formik>

            </Box>
        </Flex>
    );
};