import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ArrowLeft, X, User, Video } from 'lucide-react-native';

const TourSelectionScreen = ({ navigation, route }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { properties } = route.params;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption) {
      // Navigate to different screens based on the selected option
      if (selectedOption === 'in_person') {
        navigation.navigate('TourSchedule');
      } else if (selectedOption === 'video_call') {
        navigation.navigate('CallTour',{properties});
      }
      console.log(`Navigating to: ${selectedOption} tour screen`);
    }
  };

  const isOptionSelected = (option) => selectedOption === option;

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
          onPress={() => navigation.goBack()}
        >
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Title */}
      <Text style={styles.title}>How do you want to tour?</Text>
      
      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            isOptionSelected('in_person') && styles.selectedOptionCard
          ]}
          onPress={() => handleOptionSelect('in_person')}
          activeOpacity={0.8}
        >
          <View style={styles.optionContent}>
            <User 
              size={20} 
              color={isOptionSelected('in_person') ? "#fff" : "#000"} 
            />
            <Text 
              style={[
                styles.optionText,
                isOptionSelected('in_person') && styles.selectedOptionText
              ]}
            >
              In person
            </Text>
          </View>
          <View 
            style={[
              styles.radioButton,
              isOptionSelected('in_person') && styles.selectedRadioButton
            ]}
          >
            {isOptionSelected('in_person') && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionCard,
            isOptionSelected('video_call') && styles.selectedOptionCard
          ]}
          onPress={() => handleOptionSelect('video_call')}
          activeOpacity={0.8}
        >
          <View style={styles.optionContent}>
            <Video 
              size={20} 
              color={isOptionSelected('video_call') ? "#fff" : "#000"} 
            />
            <Text 
              style={[
                styles.optionText,
                isOptionSelected('video_call') && styles.selectedOptionText
              ]}
            >
              Live video call
            </Text>
          </View>
          <View 
            style={[
              styles.radioButton,
              isOptionSelected('video_call') && styles.selectedRadioButton
            ]}
          >
            {isOptionSelected('video_call') && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedOption && styles.continueButtonActive
          ]}
          onPress={handleContinue}
          disabled={!selectedOption}
          activeOpacity={selectedOption ? 0.8 : 1}
        >
          <Text 
            style={[
              styles.continueButtonText,
              selectedOption && styles.continueButtonTextActive
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
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
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ebe7dd',
    borderRadius: 8,
    padding: 20,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  selectedOptionCard: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedRadioButton: {
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: '#e1decc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "#ccc",
    borderWidth: 1,
  },
  continueButtonActive: {
    backgroundColor: '#000',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  continueButtonTextActive: {
    color: '#fff',
  },
});

export default TourSelectionScreen;