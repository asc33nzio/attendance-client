import Axios from 'axios';
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Select, Input, useToast } from '@chakra-ui/react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

export const EditSalary = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [success, setSuccess] = useState(false);
    const token = localStorage.getItem('token');

    const FormSchema = Yup.object().shape({
        amount: Yup.number().min(0, 'Amount must be a positive number').required('Amount is required'),
    });

    useEffect(() => {
        async function fetchRoles() {
            try {
                const response = await Axios.get('http://localhost:3369/api/admin/roles');
                setRoles(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRoles();
    }, []);

    const handleEditSalary = async (values, actions) => {
        try {
            const { amount } = values;
            const requestData = {
                amount: amount,
            };

            const response = await Axios.patch(
                `http://localhost:3369/api/admin/salary/${selectedRole}`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccess(true);
            toast({
                title: "Edit Salary Successful.",
                description: response.data.message,
                status: "success",
                duration: 2500,
                isClosable: true,
                position: "top"
            });
            actions.resetForm();
            onClose();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error.",
                description: error.response.data.message,
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top"
            });
        }
    };

    return (
        <>
            <Button boxShadow={'0px 0px 5px grey'} bg={'#727272'} color={'white'} onClick={onOpen}>
                Edit Salary
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent borderRadius={'10px'}>
                    <ModalHeader borderTopRadius={'10px'} bg={'#E0E0E0'}>
                        Edit Employee Salary
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Formik
                            initialValues={{ amount: '' }}
                            validationSchema={FormSchema}
                            onSubmit={(values, actions) => {
                                handleEditSalary(values, actions);
                            }}>
                            {() => (
                                <Form>
                                    <FormControl>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            onChange={(event) => setSelectedRole(event.target.value)}
                                            onBlur={() => { }}
                                            value={selectedRole}
                                            placeholder="Select role"
                                            name="role">
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl mt={4} mb={7}>
                                        <FormLabel>Salary Amount</FormLabel>
                                        <Field as={Input} type="number" name="amount" variant={'flushed'} />
                                        <ErrorMessage
                                            component="Box"
                                            name="amount"
                                            style={{ color: 'red', marginBottom: '-20px', marginLeft: '3px', marginTop: '-9px' }}
                                        />
                                    </FormControl>
                                    <Button type="submit" colorScheme="green" mr={3}>
                                        Update Salary
                                    </Button>
                                    <Button onClick={onClose}>Cancel</Button>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};