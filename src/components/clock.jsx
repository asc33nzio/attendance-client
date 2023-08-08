import React, { useState, useEffect } from "react";
import { Box, Button, Text, VStack, HStack, Flex } from "@chakra-ui/react";
import { format } from "date-fns";
import Axios from "axios";

export const Clock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [currentDayOfWeek, setCurrentDayOfWeek] = useState("");

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

    const indochinaTime = new Date(currentTime);
    const formattedTime = indochinaTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const formattedDate = format(indochinaTime, "dd MMMM yyyy");

    return (
        <VStack w={'500px'} spacing={4} align="center" p={4} border="3px inset black" borderRadius="md" fontFamily={'monospace'}>
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
                <Button colorScheme="teal" variant="solid" fontFamily="monospace" w={'200px'}>
                    Clock In
                </Button>
                <Button colorScheme="red" variant="solid" fontFamily="monospace" w={'200px'}>
                    Clock Out
                </Button>
            </HStack>
        </VStack>
    );
};
