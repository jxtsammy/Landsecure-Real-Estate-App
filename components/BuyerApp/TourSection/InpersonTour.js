import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const DATE_ITEM_WIDTH = (width - 64) / 4; // 4 dates visible at once with padding
const TIME_ITEM_WIDTH = (width - 64) / 4; // 4 time slots visible at once with padding

const InPersonTourScreen = ({ navigation, route }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const properties = route?.params?.properties || {};
  
  const dateListRef = useRef(null);
  const timeListRef = useRef(null);
  
  // Generate dates for the next 14 days
  const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

    dates.push({
      id: i.toString(),
      day,
      month,
      dayName,
      fullDate: date,
    });
  }

  return dates;
};

  
  // Generate time slots from 9 AM to 7 PM
  const generateTimeSlots = () => {
    const timeSlots = [];
    
    for (let hour = 9; hour <= 19; hour++) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      const time = `${hourFormatted.toString().padStart(2, '0')}:00 ${amPm}`;
      
      timeSlots.push({
        id: hour.toString(),
        time,
        hour,
      });
    }
    
    return timeSlots;
  };
  
  const dates = generateDates();
  const timeSlots = generateTimeSlots();
  
  // Set current date as default selected date
  useEffect(() => {
    setSelectedDate(dates[0]);
    
    // Scroll to current date
    setTimeout(() => {
      if (dateListRef.current) {
        dateListRef.current.scrollToIndex({
          index: 0,
          animated: false,
        });
      }
    }, 100);
  }, []);
  
  const isFormValid = () => {
    return (
      fullName.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      selectedDate !== null &&
      selectedTime !== null
    );
  };
  
  const handleContinue = () => {
    if (isFormValid()) {
      // Navigate to confirmation screen or submit the form
      console.log('Form submitted:', {
        fullName,
        phoneNumber,
        date: selectedDate,
        time: selectedTime,
      });
      
      navigation.navigate('TourDetails', {
      fullName,
      phoneNumber,
      date: selectedDate,
      time: selectedTime,
      image: properties.image, 
            price: properties.price,
            beds: properties.beds,
            baths: properties.baths,
            sqft: properties.sqft
      });
    }
  };
  
  const renderDateItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dateItem,
        selectedDate?.id === item.id && styles.selectedItem,
      ]}
      onPress={() => setSelectedDate(item)}
    >
      <Text
        style={[
          styles.dayName,
          selectedDate?.id === item.id && styles.selectedItemText,
        ]}
      >
        {item.dayName}
      </Text>
      <Text
        style={[
          styles.dayNumber,
          selectedDate?.id === item.id && styles.selectedItemText,
        ]}
      >
        {item.day}
      </Text>
      <Text
        style={[
          styles.month,
          selectedDate?.id === item.id && styles.selectedItemText,
        ]}
      >
        {item.month}
      </Text>
    </TouchableOpacity>
  );
  
  const renderTimeItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.timeItem,
        selectedTime?.id === item.id && styles.selectedItem,
      ]}
      onPress={() => setSelectedTime(item)}
    >
      <Text
        style={[
          styles.timeText,
          selectedTime?.id === item.id && styles.selectedItemText,
        ]}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Title */}
      <Text style={styles.title}>Schedule a Tour in Person</Text>
      
      {/* Form */}
      <View style={styles.form}>
        {/* Full Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#888"
        />
        
        {/* Phone Number Input */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />
        
        {/* Date Selector */}
        <View style={styles.selectorContainer}>
          <FlatList
            ref={dateListRef}
            data={dates}
            renderItem={renderDateItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}
            getItemLayout={(data, index) => ({
              length: DATE_ITEM_WIDTH,
              offset: DATE_ITEM_WIDTH * index,
              index,
            })}
            snapToInterval={DATE_ITEM_WIDTH}
            decelerationRate="fast"
          />
        </View>
        
        {/* Time Selector */}
        <View style={styles.selectorContainer}>
          <FlatList
            ref={timeListRef}
            data={timeSlots}
            renderItem={renderTimeItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeList}
            getItemLayout={(data, index) => ({
              length: TIME_ITEM_WIDTH,
              offset: TIME_ITEM_WIDTH * index,
              index,
            })}
            snapToInterval={TIME_ITEM_WIDTH}
            decelerationRate="fast"
          />
        </View>
      </View>
      
      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        {isFormValid() && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1decc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 24,
    color: '#000',
  },
  form: {
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectorContainer: {
    marginBottom: 5,
    marginTop: 20,
  },
  dateList: {
    paddingVertical: 8,
  },
  timeList: {
    paddingVertical: 1,
  },
  dateItem: {
    width: DATE_ITEM_WIDTH - 8,
    height: 80,
    backgroundColor: '#e1decc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  timeItem: {
    width: TIME_ITEM_WIDTH - 8,
    height: 50,
    backgroundColor: '#e1decc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  month: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  selectedItemText: {
    color: '#fff',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InPersonTourScreen;