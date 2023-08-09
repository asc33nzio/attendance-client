import Axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Box, Text, VStack } from "@chakra-ui/react";
import { startOfMonth } from "date-fns";
import { useSelector } from "react-redux";
import { Navbar } from "../components/navbar";
import "react-datepicker/dist/react-datepicker.css";
import "./datePickerStyles.css"
import "./table.css"

export const Payroll = () => {
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [salary, setSalary] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);
    const [totalDeduction, setTotalDeduction] = useState(0);
    const userData = useSelector(state => state.user.value);
    const userId = userData.id;
    const role = userData.role;
    const firstName = userData.firstName;
    const lastName = userData && userData.lastName ? userData.lastName.toUpperCase() : "";

    const birthDate = new Date(userData.birthDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const birthDateIso = new Date(userData.birthDate);
    const currentDate = new Date();
    var age = currentDate.getFullYear() - birthDateIso.getFullYear();
    if (currentDate.getMonth() < birthDateIso.getMonth() || (currentDate.getMonth() === birthDateIso.getMonth() && currentDate.getDate() < birthDateIso.getDate())) { age--; }

    const CustomDatePickerInput = ({ value, onClick }) => (
        <button className="custom-date-picker-input" onClick={onClick}>
            {value}
        </button>
    );

    useEffect(() => {
        if (role) {
            Axios.get("http://localhost:3369/api/attendance/salaries")
                .then(response => {
                    const salaryIndex = response.data.response.findIndex(item => item.name === role);
                    if (salaryIndex !== -1) {
                        setSalary(response.data.response[salaryIndex].amount);
                    }
                })
                .catch(error => {
                    console.error("Error fetching salary:", error);
                });
        }
    }, [role]);

    useEffect(() => {
        Axios.get(`http://localhost:3369/api/attendance/all/${userId}`)
            .then(response => {
                setAttendanceData(response.data.result);
            })
            .catch(error => {
                console.error("Error fetching user attendance:", error);
            });
    }, [userId]);

    useEffect(() => {
        const totalDays = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
        let weekends = 0;
    
        for (let day = 1; day <= totalDays; day++) {
            const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                weekends++;
            }
        }
    
        const workingDays = totalDays - weekends;
        let deduction = 0;
        const presentDays = new Set(); // Clear the set for each month
        attendanceData.forEach(record => {
            const recordDate = new Date(record.clockInTime);
            if (
                recordDate.getMonth() === selectedMonth.getMonth() &&
                recordDate.getFullYear() === selectedMonth.getFullYear()
            ) {
                const workedHours = Math.floor(record.timeWorked);
                const attendanceDay = recordDate.getDate();
                presentDays.add(attendanceDay);
    
                if (workedHours < 9) {
                    deduction += (9 - workedHours) * 25000;
                }

                if (record.clockInTime && !record.clockOutTime) {
                    deduction += 5 * 25000;
                }
    
                if (!record.clockOutTime || workedHours === 0) {
                    deduction += 9 * 25000;
                }
            }
        });
    
        const presentDaysCount = presentDays.size;
        const absentDays = workingDays - presentDaysCount;
        deduction += absentDays * 9 * 25000;

        console.log(presentDays);
        console.log(presentDaysCount);
    
        setTotalDeduction(deduction);
    }, [attendanceData, selectedMonth]);

    return (
        <Box w="100vw" h="200vh" display="flex" flexDirection="column" align="center" justify="center">
            <Navbar />
            <Box mt="155px" align="center" justify='center'>
                <DatePicker
                    selected={selectedMonth}
                    onChange={(date) => setSelectedMonth(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    customInput={<CustomDatePickerInput />}
                />
            </Box>
            <VStack w={'500px'} spacing={4} align="center" justify='center' p={4} border="3px inset black" borderRadius="md" fontFamily={'monospace'} alignSelf={'center'} mt={'35px'}>
                <Box align='center' justify='center' borderBottom={'1px solid #ccc'} w={'494px'} pb={'15px'}>
                    <Text fontFamily="monospace" fontSize="40px" mb={'15px'}>
                        Payroll Report
                    </Text>
                    <Text fontFamily="monospace" fontSize="xl">
                        {lastName}, {firstName}
                    </Text>
                    <Text fontFamily="monospace" fontSize="xl">
                        Your Position: {role}
                    </Text>
                    <Text fontFamily="monospace" fontSize="xl">
                        Born On: {birthDate}
                    </Text>
                    <Text fontFamily="monospace" fontSize="xl">
                        Age: {age}
                    </Text>
                </Box>
                <Box align='left' justify='left' borderBottom={'1px solid #ccc'} w={'494px'} pb={'15px'}>
                    <Text fontSize="xl" fontWeight="bold" ml={5}>
                        Base Salary&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Rp. &nbsp;&nbsp;{salary.toLocaleString("id-ID")},00
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" ml={5}>
                        Deduction&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: - Rp. {totalDeduction.toLocaleString("id-ID")},00
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" ml={5}>
                        This Month's Salary : Rp. &nbsp;&nbsp;{(salary - totalDeduction).toLocaleString("id-ID")},00
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" ml={5}>
                        Breakdown&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
};
