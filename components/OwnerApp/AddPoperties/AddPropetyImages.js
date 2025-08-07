import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X, Plus, ArrowLeft } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AddListingPhotosScreen = () => {
  const [images, setImages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const previousData = route.params;

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // iOS 14+ and web only
      quality: 1,
      selectionLimit: 0, // ignored by Expo
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleAddImagePress = () =>{
    navigation.navigate('AdditionalPropertyInfo', { ...previousData, images })
  }

  const renderItem = ({ item, index }) =>
    item === 'add' ? (
      <TouchableOpacity style={styles.addBtn} onPress={pickImages}>
        <Plus size={28} color="#6b6b6b" />
      </TouchableOpacity>
    ) : (
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item }} style={styles.image} />
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeImage(index)}>
          <X size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Background Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Header */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <ArrowLeft size={20} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>
        Press the add button to add{' '}
        <Text style={styles.bold}>property images</Text> to your listing
      </Text>

      {/* Images Grid */}
      <FlatList
        data={[...images, 'add']}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            images.length === 0 && { backgroundColor: '#e0e0ff' },
          ]}
          disabled={images.length === 0}
          onPress={
            handleAddImagePress
          }>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddListingPhotosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: '#1c1c1c',
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  grid: {
    gap: 10,
    alignItems: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    width: '30%',
    aspectRatio: 1,
    margin: 6,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    left: 0,
    backgroundColor: '#8A2BE2',
    borderRadius: 12,
    padding: 4,
    zIndex: 10,
    elevation: 4,
  },
  addBtn: {
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderRadius: 12,
    margin: 6,
    backgroundColor: '#e0e0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextBtn: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 17,
    paddingHorizontal: 120,
    borderRadius: 16,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  circle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    backgroundColor: '#e0e0ff',
    borderRadius: 125,
    top: -100,
    left: -100,
  },
  circle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    backgroundColor: '#eaffea',
    borderRadius: 90,
    bottom: 100,
    right: -60,
  },
});
