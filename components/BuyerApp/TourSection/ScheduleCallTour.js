"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  ImageBackground,
  StatusBar,
  Platform,
} from "react-native"
import { Calendar, Clock, ChevronLeft } from "lucide-react-native"

const { height, width } = Dimensions.get("window")

const ScheduleCallScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [location, setLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [showDateModal, setShowDateModal] = useState(false)
  const [showTimeModal, setShowTimeModal] = useState(false)

  // Get current date information
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // State for calendar navigation
  const [displayMonth, setDisplayMonth] = useState(currentMonth)
  const [displayYear, setDisplayYear] = useState(currentYear)
  const [calendarDays, setCalendarDays] = useState([])

  // Animation values
  const dateModalAnim = useRef(new Animated.Value(height)).current
  const timeModalAnim = useRef(new Animated.Value(height)).current

  // Month names for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Day names for display
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Format the selected date and time for display
  const formattedDateTime =
    selectedDate && selectedTime
      ? `${selectedTime} - ${getEndTime(selectedTime)}, ${selectedDate}`
      : "Select date and time"

  // Generate calendar days whenever month or year changes
  useEffect(() => {
    generateCalendarDays(displayMonth, displayYear)
  }, [displayMonth, displayYear])

  // Generate calendar days for the given month and year
  const generateCalendarDays = (month, year) => {
    const days = []

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Get the number of days in the previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    // Add days from the previous month to fill the first row
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevMonthDay = daysInPrevMonth - i
      days.push({
        day: prevMonthDay,
        month: "prev",
        date: new Date(year, month - 1, prevMonthDay),
      })
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: "current",
        date: new Date(year, month, i),
        isToday: i === currentDay && month === currentMonth && year === currentYear,
      })
    }

    // Add days from the next month to complete the grid (6 rows x 7 columns = 42 cells)
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        month: "next",
        date: new Date(year, month + 1, i),
      })
    }

    setCalendarDays(days)
  }

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    } else {
      setDisplayMonth(displayMonth - 1)
    }
  }

  // Navigate to next month
  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    } else {
      setDisplayMonth(displayMonth + 1)
    }
  }

  // Format date for display
  const formatDate = (date) => {
    const dayOfWeek = dayNames[date.getDay()]
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    return `${dayOfWeek}, ${month} ${day}, ${year}`
  }

  // Show date modal with animation
  const showDatePicker = () => {
    setShowDateModal(true)
    // Reset to current month/year when opening the date picker
    setDisplayMonth(currentMonth)
    setDisplayYear(currentYear)
    generateCalendarDays(currentMonth, currentYear)

    Animated.timing(dateModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  // Hide date modal with animation
  const hideDatePicker = () => {
    Animated.timing(dateModalAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowDateModal(false))
  }

  // Show time modal with animation
  const showTimePicker = () => {
    setShowTimeModal(true)
    Animated.timing(timeModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  // Hide time modal with animation
  const hideTimePicker = () => {
    Animated.timing(timeModalAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowTimeModal(false))
  }

  // Calculate end time (30 min after start time)
  function getEndTime(startTime) {
    if (!startTime) return ""

    const [hours, minutes] = startTime.split(":").map(Number)
    let endHours = hours
    let endMinutes = minutes + 30

    if (endMinutes >= 60) {
      endMinutes -= 60
      endHours += 1
    }

    return `${endHours}:${endMinutes === 0 ? "00" : endMinutes}`
  }

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(formatDate(date))
    hideDatePicker()

    // Show time picker after date is selected
    setTimeout(() => {
      showTimePicker()
    }, 400)
  }

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    hideTimePicker()
  }

  // Handle form submission
  const handleScheduleCall = () => {
    // Validate form
    if (!firstName || !lastName || !email || !phoneNumber || !selectedDate || !selectedTime) {
      alert("Please fill in all required fields")
      return
    }

    // Make sure all parameters are properly defined before navigation
    const params = {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phoneNumber: phoneNumber || "",
      location: location || "",
      date: selectedDate || "",
      time: selectedTime || "",
      endTime: getEndTime(selectedTime) || "",
      formattedDateTime: formattedDateTime || "",
    }

    // Navigate to confirmation screen with all details
    navigation.navigate("CallDetails", params)
  }

  // Generate time slots
  const timeSlots = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"]

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/28fcf6eb56a7a24e7bc11bb346af6f06.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          {/* Rest of your content remains the same */}
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

          {/* Header */}
          <View style={[styles.header, { marginTop: Platform.OS === "ios" ? 50 : 40 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft color="#fff" size={32} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Schedule a Call</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Consultation Card */}
          <View style={styles.consultationCard}>
            <View style={styles.durationContainer}>
              <Clock size={18} color="#fff" />
              <Text style={styles.durationText}>30 minutes</Text>
            </View>

            <View style={styles.dateTimeContainer}>
              <Calendar size={18} color="#fff" />
              <Text style={styles.dateTimeText}>{formattedDateTime}</Text>
            </View>
          </View>

          {/* Form Container with ScrollView */}
          <View style={styles.formWrapper}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.formContainer}>
                {/* Form content remains the same */}
                <Text style={styles.formTitle}>Enter Details</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    First Name<Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter your first name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Last Name<Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter your last name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Email<Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Phone Number<Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Enter location"
                  />
                </View>

                {/* Date Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Date<Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity style={[styles.input, styles.dateTimeInput]} onPress={showDatePicker}>
                    <Text style={[styles.dateTimeInputText, !selectedDate && styles.placeholderText]}>
                      {selectedDate || "Select date"}
                    </Text>
                    <Calendar size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Time Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Time<Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[styles.input, styles.dateTimeInput, !selectedDate && styles.disabledInput]}
                    onPress={selectedDate ? showTimePicker : null}
                    disabled={!selectedDate}
                  >
                    <Text
                      style={[
                        styles.dateTimeInputText,
                        !selectedTime && styles.placeholderText,
                        !selectedDate && styles.disabledText,
                      ]}
                    >
                      {selectedTime ? `${selectedTime} - ${getEndTime(selectedTime)}` : "Select time"}
                    </Text>
                    <Clock size={20} color={selectedDate ? "#666" : "#ccc"} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleCall}>
                  <Text style={styles.scheduleButtonText}>Schedule a Call</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </ImageBackground>

      {/* Date Modal */}
      {showDateModal && (
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: dateModalAnim }] }]}>
          <View style={styles.dateModal}>
            <View style={styles.monthSelector}>
              <Text style={styles.monthText}>{`${monthNames[displayMonth]} ${displayYear}`}</Text>
              <View style={styles.monthNavigation}>
                <TouchableOpacity onPress={goToPrevMonth}>
                  <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={goToNextMonth}>
                  <ChevronLeft color="#000" size={24} style={{ transform: [{ rotate: "180deg" }] }} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.weekDays}>
              {dayNames.map((day, index) => (
                <Text key={index} style={styles.weekDay}>
                  {day.toUpperCase()}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    item.month !== "current" && styles.otherMonthDay,
                    item.isToday && styles.todayDay,
                    selectedDate === formatDate(item.date) && styles.selectedDay,
                  ]}
                  onPress={() => item.month === "current" && handleDateSelect(item.date)}
                  disabled={item.month !== "current"}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      item.month !== "current" && styles.otherMonthDayText,
                      item.isToday && styles.todayDayText,
                      selectedDate === formatDate(item.date) && styles.selectedDayText,
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={hideDatePicker}>
              <Text style={styles.continueButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Time Modal */}
      {showTimeModal && (
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: timeModalAnim }] }]}>
          <View style={styles.timeModal}>
            <Text style={styles.timeModalTitle}>Select a Time</Text>
            <Text style={styles.timeModalSubtitle}>Duration: 30 min</Text>

            <View style={styles.timeSlotContainer}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.timeSlot, selectedTime === time && styles.selectedTimeSlot]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text style={[styles.timeSlotText, selectedTime === time && styles.selectedTimeSlotText]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timeActionButtons}>
              <TouchableOpacity style={[styles.timeActionButton, styles.timeSelectButton]} onPress={hideTimePicker}>
                <Text style={styles.timeSelectButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.timeActionButton, styles.timeConfirmButton]}
                onPress={() => {
                  if (selectedTime) {
                    hideTimePicker()
                  } else {
                    alert("Please select a time")
                  }
                }}
              >
                <Text style={styles.timeConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  consultationCard: {
    padding: 20,
    alignItems: "center",
    marginHorizontal: 0,
    borderRadius: 0,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },
  durationText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
  },
  formWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  dateTimeInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTimeInputText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    color: "#999",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  disabledText: {
    color: "#ccc",
  },
  scheduleButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  dateModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
  },
  monthNavigation: {
    flexDirection: "row",
    gap: 10,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    width: "14%",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  calendarDayText: {
    fontSize: 16,
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthDayText: {
    color: "#999",
  },
  todayDay: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
  },
  todayDayText: {
    fontWeight: "bold",
  },
  selectedDay: {
    backgroundColor: "#000",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayText: {
    color: "#fff",
  },

  continueButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  timeModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  timeModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  timeModalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  timeSlotContainer: {
    marginBottom: 16,
  },
  timeSlot: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  timeSlotText: {
    fontSize: 16,
  },
  selectedTimeSlot: {
    backgroundColor: "#f0f0f0",
  },
  selectedTimeSlotText: {
    fontWeight: "600",
  },
  timeActionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeActionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  timeSelectButton: {
    backgroundColor: "#6366f1",
    marginRight: 8,
  },
  timeSelectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  timeConfirmButton: {
    backgroundColor: "#000",
    marginLeft: 8,
  },
  timeConfirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ScheduleCallScreen
