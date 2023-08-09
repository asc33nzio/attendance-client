import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Box, Button, Text, VStack, HStack, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

export const Clock = () => {
    const toast = useToast();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [currentDayOfWeek, setCurrentDayOfWeek] = useState("");
    const userData = useSelector(state => state.user.value);
    const userId = userData.id;

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            setCurrentDayOfWeek(now.toLocaleDateString("en-US", { weekday: "long" }));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

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
        Axios.get(`http://localhost:3369/api/attendance/today/${userId}`)
            .then(response => {
                const attendanceData = response.data.result;
                if (attendanceData) {
                    setAttendanceHistory([attendanceData]);
                } else {
                    setAttendanceHistory([]);
                }
            })
            .catch(error => {
                console.error("Error fetching attendance history:", error);
            });
    }, [userId]);

    const handleClockIn = () => {
        Axios.post(`http://localhost:3369/api/attendance/in/${userId}`)
            .then(response => {
                toast({
                    title: "Clocked In Successfully",
                    description: response.data.message,
                    status: "success",
                    duration: 2500,
                    isClosable: true,
                    position: "top"
                });
                window.location.reload();
            })
            .catch(error => {
                toast({
                    title: "Error!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 2500,
                    isClosable: true,
                    position: "top"
                });
            });
    };

    const handleClockOut = () => {
        Axios.patch(`http://localhost:3369/api/attendance/out/${userId}`)
            .then(response => {
                toast({
                    title: "Clocked Out Successfully",
                    description: response.data.message,
                    status: "success",
                    duration: 2500,
                    isClosable: true,
                    position: "top"
                });
                window.location.reload();
            })
            .catch(error => {
                toast({
                    title: "Error!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 2500,
                    isClosable: true,
                    position: "top"
                });
            });
    };

    const indochinaTime = new Date(currentTime);
    const formattedTime = indochinaTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const formattedDate = format(indochinaTime, "dd MMMM yyyy");

    const formatTimeWorked = (timeWorked) => {
        const [hours, minutes] = timeWorked.toString().split(".");
        const formattedHours = parseInt(hours) > 0 ? `${hours} Hour(s)` : "";
        const formattedMinutes = parseInt(minutes) > 0 ? `${minutes} Minute(s)` : "";
        return `${formattedHours} ${formattedMinutes}`;
    };

    return (
        <Box w={'1000px'} h={'800px'} align='center' justify='center'>
            <VStack w={'500px'} spacing={4} align="center" p={4} border="3px inset black" borderRadius="md" fontFamily={'monospace'} mt={'250px'} mb={'25px'}>
                <Box align='center' justify='center' borderBottom={'1px solid #ccc'} w={'494px'} pb={'15px'}>
                    <Text fontFamily="monospace" fontSize="40px">
                        {formattedTime}
                    </Text>
                    <Text fontFamily="monospace" fontSize="xl">
                        {currentDayOfWeek}, {formattedDate}
                    </Text>
                </Box>
                <Box align='center' justify='center' borderBottom={'1px solid #ccc'} w={'494px'} pb={'15px'}>
                    <Text fontSize="xl" fontWeight="bold">
                        Today's Working Hours
                    </Text>
                    {schedules
                        .filter(schedule => schedule.day === currentDayOfWeek)
                        .map(schedule => (
                            <Box key={schedule.id} p={2}>
                                <Text fontFamily="monospace">
                                    {schedule.day}:{" "}
                                    {schedule.shiftStart && schedule.shiftEnd
                                        ? `${schedule.shiftStart} - ${schedule.shiftEnd}`
                                        : "Holiday"}
                                </Text>
                            </Box>
                        ))}
                </Box>
                <HStack mt="15px" align={'space-evenly'} spacing={9}>
                    <Button onClick={handleClockIn} colorScheme="teal" variant="solid" fontFamily="monospace" w={'200px'}>
                        Clock In
                    </Button>
                    <Button onClick={handleClockOut} colorScheme="red" variant="solid" fontFamily="monospace" w={'200px'}>
                        Clock Out
                    </Button>
                </HStack>
            </VStack>
            <Box w={'500px'} p={4} border="3px inset black" borderRadius="md" fontFamily={'monospace'}>
                <Text fontSize="xl" fontWeight="bold" mb={3}>
                    Attendance Log
                </Text>
                {attendanceHistory.length > 0 ? (
                    attendanceHistory.map((attendance, index) => (
                        <VStack key={index} spacing={1} alignItems="flex-start">
                            <Text fontFamily="monospace">
                                Clocked-In &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {attendance.clockInTime ? new Date(attendance.clockInTime).toISOString().split('T')[1].slice(0, 8) : "You have not clocked in yet."}
                            </Text>
                            <Text fontFamily="monospace">
                                Clocked-Out &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {attendance.clockOutTime ? new Date(attendance.clockOutTime).toISOString().split('T')[1].slice(0, 8) : "You have not clocked out yet."}
                            </Text>
                            <Text fontFamily="monospace">Hours Worked Today&nbsp;: {attendance.timeWorked ? formatTimeWorked(attendance.timeWorked) : "0 Hours 0 Minutes"}</Text>
                        </VStack>
                    ))
                ) : (
                    <VStack key={"norecord"} spacing={1} alignItems="flex-start">
                        <Text fontFamily="monospace">
                            Clocked-In &nbsp;&nbsp;&nbsp;: You have not clocked in yet.
                        </Text>
                        <Text fontFamily="monospace">
                            Clocked-Out &nbsp;&nbsp;: You have not clocked out yet.
                        </Text>
                        <Text fontFamily="monospace">Hours Worked &nbsp;: 0 Hours 0 Minutes</Text>
                    </VStack>
                )}
            </Box>
        </Box>
    );
};