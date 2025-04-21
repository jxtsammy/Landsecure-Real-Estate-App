import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Home,
  Building2,
  Tag,
  Landmark,
  Hotel,
  Warehouse,
  Castle,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const AddListingScreen = () => {
  const navigation = useNavigation();

  const [propertyName, setPropertyName] = useState('');
  const [listingTypes, setListingTypes] = useState([]);
  const [propertyCategories, setPropertyCategories] = useState([]);
  const [features, setFeatures] = useState({
    Bedroom: 1,
    Bathroom: 1,
    Balcony: 1,
    Plot: 0,
    Acre: 0,
    Hectare: 0,
  });

  const toggleSelection = (type, setType, value, single = false) => {
    if (single) {
      setType((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setType((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const incrementFeature = (feature) => {
    if (isLandSelected()) {
      const current = features[feature];
      const otherKeys = ['Plot', 'Acre', 'Hectare'].filter(
        (k) => k !== feature
      );
      const othersSelected = otherKeys.some((k) => features[k] > 0);

      if (!othersSelected || current > 0) {
        setFeatures((prev) => ({
          ...prev,
          [feature]: prev[feature] + 1,
          ...otherKeys.reduce((acc, k) => ({ ...acc, [k]: 0 }), {}),
        }));
      }
    } else {
      setFeatures((prev) => ({ ...prev, [feature]: prev[feature] + 1 }));
    }
  };

  const decrementFeature = (feature) => {
    if (features[feature] > 0) {
      setFeatures((prev) => ({ ...prev, [feature]: prev[feature] - 1 }));
    }
  };

  const isLandSelected = () => propertyCategories.includes('Land');

  const handleNext = () => {
    const listingData = {
      propertyName,
      listingTypes,
      propertyCategories,
      features,
    };
    console.log('Saved data:', listingData);
    navigation.navigate('AddPropertyImages', { listingData });
  };

  const featureIcons = {
    Bedroom: <Hotel size={18} color="#8A2BE2" />,
    Bathroom: <Building2 size={18} color="#8A2BE2" />,
    Balcony: <Warehouse size={18} color="#8A2BE2" />,
    Plot: <Landmark size={18} color="#8A2BE2" />,
    Acre: <Castle size={18} color="#8A2BE2" />,
    Hectare: <Tag size={18} color="#8A2BE2" />,
  };

  const renderFeatureBox = (label) => (
    <View key={label} style={styles.featureBox}>
      <View style={styles.featureLabelContainer}>
        {featureIcons[label]}
        <Text style={styles.featureLabel}>{label}</Text>
      </View>
      <View style={styles.featureControl}>
        <TouchableOpacity
          style={styles.featureBtn}
          onPress={() => decrementFeature(label)}>
          <Text style={styles.featureBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.featureValue}>{features[label]}</Text>
        <TouchableOpacity
          style={styles.featureBtn}
          onPress={() => incrementFeature(label)}>
          <Text style={styles.featureBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const circleColors = [
    '#8DDC30',
    '#FF8C42',
    '#60A5FA',
    '#A78BFA',
    '#F472B6',
    '#FCD34D',
  ];

  return (
    <View style={styles.container}>
      {[...Array(10)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.circle,
            {
              backgroundColor: circleColors[index % circleColors.length],
              top: Math.random() * height,
              left: Math.random() * width,
              width: 40 + Math.random() * 50,
              height: 40 + Math.random() * 50,
              opacity: 0.1,
            },
          ]}
        />
      ))}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <ArrowLeft color="#fff" size={26} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Property</Text>
        </View>

        <Text style={styles.greeting}>
          Hi there, fill detail of your{' '}
          <Text style={styles.highlight}>new property listing</Text>
        </Text>

        <View style={styles.inputBox}>
          <TextInput
            value={propertyName}
            onChangeText={setPropertyName}
            placeholder="Property name"
            placeholderTextColor="#333"
            style={styles.input}
          />
          <Home color="#8A2BE2" size={22} style={styles.inputIcon} />
        </View>

        <Text style={styles.sectionTitle}>Listing type</Text>
        <View style={styles.optionContainer}>
          {[{ label: 'Sell', icon: <Tag size={18} color="#fff" /> }].map(
            ({ label, icon }) => (
              <TouchableOpacity
                key={label}
                style={[
                  styles.option,
                  listingTypes.includes(label) && styles.optionSelected,
                ]}
                onPress={() => toggleSelection(label, setListingTypes, label)}>
                {listingTypes.includes(label) ? icon : null}
                <Text
                  style={[
                    styles.optionText,
                    listingTypes.includes(label) && styles.optionTextSelected,
                  ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <Text style={styles.sectionTitle}>Property category</Text>
        <View style={styles.categoryContainer}>
          {[
            { label: 'House', icon: <Home size={16} color="#fff" /> },
            { label: 'Land', icon: <Landmark size={16} color="#fff" /> },
            { label: 'Apartment', icon: <Warehouse size={16} color="#fff" /> },
            { label: 'Hotel', icon: <Hotel size={16} color="#fff" /> },
            { label: 'Villa', icon: <Landmark size={16} color="#fff" /> },
            { label: 'Cottage', icon: <Castle size={16} color="#fff" /> },
          ].map(({ label, icon }) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.category,
                propertyCategories.includes(label) && styles.categorySelected,
              ]}
              onPress={() =>
                toggleSelection(label, setPropertyCategories, label, true)
              }>
              {propertyCategories.includes(label) ? icon : null}
              <Text
                style={[
                  styles.categoryText,
                  propertyCategories.includes(label) &&
                    styles.categoryTextSelected,
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {propertyCategories.length > 0 && (
          <View style={{ marginBottom: 40 }}>
            <Text style={styles.sectionTitle}>Property Features</Text>
            {isLandSelected()
              ? ['Plot', 'Acre', 'Hectare'].map(renderFeatureBox)
              : ['Bedroom', 'Bathroom', 'Balcony'].map(renderFeatureBox)}
          </View>
        )}

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  greeting: {
    fontSize: 22,
    color: '#1D1D4E',
    marginBottom: 30,
  },
  highlight: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  inputBox: {
    backgroundColor: '#F6F5FA',
    padding: 15,
    paddingRight: 40,
    borderRadius: 20,
    marginBottom: 50,
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: '#1D1D4E',
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1D1D4E',
    fontWeight: '600',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  option: {
    backgroundColor: '#F6F5FA',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionSelected: { backgroundColor: '#8A2BE2' },
  optionText: {
    color: '#8A2BE2',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 60,
  },
  category: {
    backgroundColor: '#F6F5FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categorySelected: { backgroundColor: '#8A2BE2' },
  categoryText: {
    color: '#8A2BE2',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#fff',
  },
  featureBox: {
    backgroundColor: '#F6F5FA',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureLabel: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0DCF7',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  featureBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  featureBtnText: {
    color: '#1D1D4E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featureValue: {
    color: '#1D1D4E',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtn: {
    flex: 1,
    marginLeft: 20,
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
  },
});

export default AddListingScreen;