import Axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import slip_header from "../public/slip_header.jpg";
import { Box, Text, VStack } from "@chakra-ui/react";
import { startOfMonth } from "date-fns";
import { useSelector } from "react-redux";
import { Navbar } from "../components/navbar";
import { Document, Page, View, Text as PDFText, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import "react-datepicker/dist/react-datepicker.css";
import "./datePickerStyles.css"
import "./table.css"

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 14,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        paddingBottom: 30,
    },
    header: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 30,
        marginBottom: 15,
        textAlign: 'center',
    },
    generation: {
        fontSize: 12,
        marginBottom: 3,
        textAlign: 'right',
    },
    longLat: {
        fontSize: 10,
        marginBottom: 12,
        textAlign: 'right',
    },
    personalDetail: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
        textAlign: 'right',
        fontWeight: 'bold'
    },
    personalDetailLast: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
        textAlign: 'right',
        fontWeight: 'bold',
        marginBottom: '20px'
    },
    item: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    itemName: {
        flexGrow: 1,
    },
    itemTotal: {
        textAlign: 'center',
        flexGrow: 1,
    },
    itemTotalLast: {
        textAlign: 'center',
        flexGrow: 1,
        marginBottom: "20px"
    },
    firstTotalAmount: {
        textAlign: 'right',
        marginTop: 35,
        fontSize: 18,
    },
    totalAmount: {
        textAlign: 'right',
        marginTop: 20,
        fontSize: 18,
    },
    footer: {
        fontFamily: 'Helvetica-Bold',
        marginTop: 40,
        textAlign: 'center',
        fontSize: 32,
    }
});

export const Payroll = () => {
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [salary, setSalary] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);
    const [deductionsList, setDeductionsList] = useState([]);
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

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const birthDateIso = new Date(userData.birthDate);
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
        const newDeductionsList = [];
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
        const presentDays = new Set();
        attendanceData.forEach(record => {
            const recordDate = new Date(record.clockInTime);
            if (
                recordDate.getMonth() === selectedMonth.getMonth() &&
                recordDate.getFullYear() === selectedMonth.getFullYear()
            ) {
                const workedHours = Math.floor(record.timeWorked);
                const attendanceDay = recordDate.getDate();
                presentDays.add(attendanceDay);

                if (record.clockInTime && !record.clockOutTime) {
                    const deductionAmount = 5 * 25000;
                    deduction += deductionAmount;
                    newDeductionsList.push({
                        deduction: `No Check-Out: 5H x Rp.25.000,00 = -Rp.${deductionAmount.toLocaleString("id-ID")},00`,
                        date: recordDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    });
                } else if (workedHours < 9) {
                    const deductionAmount = (9 - workedHours) * 25000;
                    deduction += deductionAmount;
                    newDeductionsList.push({
                        deduction: `Early Leave: ${9 - workedHours}H x Rp.25.000,00 = -Rp.${deductionAmount.toLocaleString("id-ID")},00`,
                        date: recordDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    });
                } else if (!record.clockOutTime || workedHours === 0) {
                    const deductionAmount = 9 * 25000;
                    deduction += deductionAmount;
                    newDeductionsList.push({
                        deduction: `Absent: 9H x Rp.25.000,00 = -Rp.${deductionAmount.toLocaleString("id-ID")},00`,
                        date: recordDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    });
                } else if (workedHours > 9) {
                    newDeductionsList.push({
                        deduction: `Full-Time \u00A0: 9H x Rp.25.000,00 = +Rp.225.000,00`,
                        date: recordDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    });
                }
            }
        });

        const presentDaysCount = presentDays.size;
        const absentDays = workingDays - presentDaysCount;
        if (absentDays > 0) {
            const deductionAmount = absentDays * 9 * 25000;
            deduction += deductionAmount;
            newDeductionsList.push({
                deduction: `Absent \u00A0\u00A0\u00A0\u00A0: ${absentDays} Working Days x 9H x Rp.25.000,00 = \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 -Rp.${deductionAmount.toLocaleString("id-ID")},00`,
                date: selectedMonth.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                })
            });
        };

        setTotalDeduction(deduction);
        setDeductionsList(newDeductionsList);
    }, [attendanceData, selectedMonth]);

    const receiptContent = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <Image src={slip_header} />
                    <PDFText style={styles.header}>Wage Slip</PDFText>
                </View>
                <View>
                    <PDFText style={styles.generation}>Generated On: {formattedDate}</PDFText>
                    <PDFText style={styles.personalDetail}>Employee: {lastName}, {firstName}</PDFText>
                    <PDFText style={styles.personalDetail}>Position: {role}</PDFText>
                    <PDFText style={styles.personalDetail}>Birth Date: {birthDate}</PDFText>
                    <PDFText style={styles.personalDetailLast}>Age: {age}</PDFText>
                    <PDFText style={styles.header}>Earnings and Deductions</PDFText>
                    <PDFText style={styles.itemName}>Base Salary</PDFText>
                    <PDFText style={styles.itemTotal}>Rp. {salary.toLocaleString("id-ID")},00</PDFText>
                    <PDFText style={styles.itemName}>Total Deductions</PDFText>
                    <PDFText style={styles.itemTotal}>-Rp. {totalDeduction.toLocaleString("id-ID")},00</PDFText>
                    <PDFText style={styles.itemName}>Net Salary</PDFText>
                    <PDFText style={styles.itemTotalLast}>Rp. {(salary - totalDeduction).toLocaleString("id-ID")},00</PDFText>
                    <PDFText style={styles.header}>Deductions List</PDFText>
                    {deductionsList.map((deduction, index) => (
                        <View key={index} style={styles.item}>
                            <PDFText style={styles.itemName}>{deduction.deduction}</PDFText>
                        </View>
                    ))}
                    <PDFText style={styles.footer}>Work Harder!</PDFText>
                </View>
            </Page>
        </Document>
    );

    const DownloadPDF = () => (
        <PDFDownloadLink document={receiptContent} fileName="wage_slip.pdf">
            {({ blob, url, loading, error }) => {
                if (loading) {
                    return 'Loading your receipt PDF...';
                };

                if (error) {
                    return 'Error occurred while generating PDF.';
                };

                return (
                    <a
                        href={url}
                        download="receipt.pdf"
                        style={{
                            backgroundColor: "#808080",
                            color: "black",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            textDecoration: "none",
                            display: "inline-block",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "16px"
                        }}
                    >
                        Download Wage Slip
                    </a>
                );
            }}
        </PDFDownloadLink>
    );

    return (
        <Box w="100vw" h="145vh" display="flex" flexDirection="column" align="center" justify="center">
            <Navbar />
            <Box mt="155px" align="center" justify='center' pt={6}>
                <DatePicker
                    selected={selectedMonth}
                    onChange={(date) => setSelectedMonth(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    customInput={<CustomDatePickerInput />}
                />
            </Box>
            <VStack w={'650px'} spacing={4} align="center" justify='center' p={4} border="3px inset black" borderRadius="md" fontFamily={'monospace'} alignSelf={'center'} mt={'35px'} mb={'35px'}>
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
                <Box align='left' justify='left' borderTop={'1px solid #ccc'} w={'494px'} pb={'15px'}>
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
                    <Box align='left' justify='left' borderTop={'1px solid #ccc'} w={'494px'} pb={'10px'} pt={'15px'}>
                        {deductionsList.map((deduction, index) => (
                            <Text key={index} ml={5}>
                                {`${deduction.deduction} on ${deduction.date}`}
                            </Text>
                        ))}
                    </Box>
                </Box>
            </VStack>
            <DownloadPDF />
        </Box>
    );
};