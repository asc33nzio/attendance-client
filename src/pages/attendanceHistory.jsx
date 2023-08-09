import Axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useSelector } from "react-redux";
import { Navbar } from "../components/navbar";
import "react-datepicker/dist/react-datepicker.css";
import "./datePickerStyles.css"
import "./table.css"

export const AttendanceHistory = () => {
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [datesInMonth, setDatesInMonth] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [userAttendance, setUserAttendance] = useState([]);
    const userData = useSelector(state => state.user.value);
    const userId = userData.id;

    useEffect(() => {
        Axios.get("http://localhost:3369/api/attendance/schedules")
            .then(response => {
                setSchedules(response.data.response);
            })
            .catch(error => {
                console.error("Error fetching schedules:", error);
            });
    }, []);
    
    useEffect(() => {
        Axios.get(`http://localhost:3369/api/attendance/all/${userId}`)
            .then(response => {
                setUserAttendance(response.data.result);
            })
            .catch(error => {
                console.error("Error fetching user attendance:", error);
            });
    }, [userId]);

    useEffect(() => {
        const startDate = startOfMonth(selectedMonth);
        const endDate = endOfMonth(selectedMonth);

        const datesInMonth = eachDayOfInterval({ start: startDate, end: endDate });

        const generatedDatesInMonth = datesInMonth.map(date => ({
            date: date,
        }));

        setDatesInMonth(generatedDatesInMonth);
    }, [selectedMonth, schedules]);

    const CustomDatePickerInput = ({ value, onClick }) => (
        <button className="custom-date-picker-input" onClick={onClick}>
            {value}
        </button>
    );

    const getDayOfWeek = (date) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[date.getDay()];
    };

    const findScheduleForDay = (dayOfWeek) => {
        return schedules.find(schedule => schedule.day === dayOfWeek);
    };

    return (
        <Box w="100vw" h="200vh" display="flex" flexDirection="column" align="center" justify="center">
            <Navbar />
            <Box mt="155px" align="center">
                <DatePicker
                    selected={selectedMonth}
                    onChange={(date) => setSelectedMonth(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    customInput={<CustomDatePickerInput />}
                />
                <Box border={'3px ridge black'} p="2" borderRadius="md" mt={2} align="center" justify="center" >
                    <Table variant="striped" border={'2px ridge black'} style={{ borderCollapse: "separate", borderSpacing: "5px" }} fontFamily={'monospace'}>
                        <Thead border={'2px ridge black'}>
                            <Tr>
                                <Th textAlign="center">Date</Th>
                                <Th textAlign="center">Schedule In</Th>
                                <Th textAlign="center">Schedule Out</Th>
                                <Th textAlign="center">Check In</Th>
                                <Th textAlign="center">Check Out</Th>
                                <Th textAlign="center">Time Worked</Th>
                                <Th textAlign="center">Attendance Code</Th>
                                <Th textAlign="center">Overtime</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {datesInMonth.map((date, index) => {
                                const dayOfWeek = getDayOfWeek(date.date);
                                const scheduleForDay = findScheduleForDay(dayOfWeek);
                                const formattedDate = format(date.date, "yyyy-MM-dd");

                                const attendanceForDate = userAttendance.find(attendance => {
                                    const attendanceDate = new Date(attendance.clockInTime).toISOString().substring(0, 10);
                                    return attendanceDate === formattedDate;
                                });

                                const convertDecimalToHoursMinutes = (decimalHours) => {
                                    const hours = Math.floor(decimalHours);
                                    const minutes = Math.round((decimalHours - hours) * 60);
                                    return `${hours}H ${minutes}M`;
                                };

                                const calculateOvertime = (timeWorked) => {
                                    const standardWorkHours = 9;
                                    const overtime = Math.max(timeWorked - standardWorkHours, 0);
                                    return convertDecimalToHoursMinutes(overtime);
                                };

                                let attendanceCode = "";
                                let overtime = "-";
                                if (!attendanceForDate) {
                                    attendanceCode = "AB";
                                } else if (scheduleForDay) {
                                    const shiftStart = new Date(`1970-01-01T${scheduleForDay.shiftStart}`);
                                    const shiftEnd = new Date(`1970-01-01T${scheduleForDay.shiftEnd}`);
                                    const timeWorked = attendanceForDate.timeWorked;

                                    if (timeWorked >= (shiftEnd - shiftStart) / (1000 * 60 * 60)) {
                                        attendanceCode = "OK";
                                    } else {
                                        attendanceCode = "DD";
                                    }

                                    overtime = calculateOvertime(timeWorked);
                                };

                                return (
                                    <Tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                                        <Td textAlign="center">{dayOfWeek}, {format(date.date, "dd-MM-yyyy")}</Td>
                                        <Td textAlign="center">{scheduleForDay ? scheduleForDay.shiftStart : "Weekend"}</Td>
                                        <Td textAlign="center">{scheduleForDay ? scheduleForDay.shiftEnd : "Weekend"}</Td>
                                        <Td textAlign="center">{attendanceForDate ? new Date(attendanceForDate.clockInTime).toISOString().split('T')[1].slice(0, 8) : "-"}</Td>
                                        <Td textAlign="center">{attendanceForDate ? new Date(attendanceForDate.clockOutTime).toISOString().split('T')[1].slice(0, 8) : "-"}</Td>
                                        <Td textAlign="center">{attendanceForDate ? convertDecimalToHoursMinutes(attendanceForDate.timeWorked) : "-"}</Td>
                                        <Td textAlign="center">{attendanceCode}</Td>
                                        <Td textAlign="center">{overtime}</Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Box>
    );
};
