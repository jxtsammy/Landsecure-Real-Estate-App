'use client';

import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import {
  User,
  KeyRound,
  HelpCircle,
  ShieldCheck,
  FileText,
  Trash2,
  LogOut,
  ChevronRight,
  Edit,
  BadgeCheck,
  ArrowLeft,
  Pencil,
  AlertTriangle,
  X,
  AlertCircle,
  Check,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { deleteUser, userLogout, getUserProfile } from '../../../services/api/userManagement/getUsers'

const { width, height } = Dimensions.get('window');

const SettingsScreen = () => {
  // Use the navigation hook instead of props
  const navigation = useNavigation();

  // State for modals
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Animation values for modal slides
  const deleteSlideAnim = useRef(new Animated.Value(height)).current;
  const logoutSlideAnim = useRef(new Animated.Value(height)).current;

  // User data state
  const [userData, setUserData] = useState({
    name: 'Mike Greenforest',
    email: 'mike.green@example.com',
    phone: '555-123-4567',
    nationalId: 'ID12345678',
    joinedDate: '5 weeks ago',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();

        setUserData({
          name: profile.name || profile.fullName || '', // Handle different API field names
          email: profile.email || '',
          phone: profile.phone || profile.phoneNumber || '',
          nationalId: profile.nationalId || profile.idNumber || '',
          joinedDate: profile.createdAt ? formatJoinedDate(profile.createdAt) : 'Recently',
          avatar: profile.avatar || profile.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'
        });

      } catch (error) {
        console.error('Failed to load profile:', error);
        Alert.alert('Error', error.message);

        // Optional: Clear user data if unauthorized
        if (error.message.includes('expired') || error.message.includes('401')) {
          await AsyncStorage.removeItem('accessToken');
          navigation.navigate('Login');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const formatJoinedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffWeeks = Math.floor((now - date) / (1000 * 60 * 60 * 24 * 7));
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  };

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    avatar: '',
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (profileModalVisible) {
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        nationalId: userData.nationalId,
        avatar: userData.avatar,
      });
    }
  }, [profileModalVisible]);

  // Handle delete modal animation
  useEffect(() => {
    if (deleteModalVisible) {
      Animated.timing(deleteSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(deleteSlideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [deleteModalVisible, deleteSlideAnim]);

  // Handle logout modal animation
  useEffect(() => {
    if (logoutModalVisible) {
      Animated.timing(logoutSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(logoutSlideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [logoutModalVisible, logoutSlideAnim]);

  const handleDelete = async () => {
    setIsDeleting(true); // Start loading
    setDeleteModalVisible(false);

    try {
      const userId = await AsyncStorage.getItem('@current_user_id');
      if (!userId) throw new Error('User not identified');

      await deleteUser(userId); // This will throw on failure

      // Clear all user data
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userData',
        '@current_user_id'
      ]);

      navigation.reset({
        index: 0,
        routes: [{ name: 'UserType' }],
      });

    } catch (error) {
      console.error('Delete failed:', error);
      Alert.alert(
        'Deletion Error',
        error.message || 'Could not delete account. Please try again.'
      );
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);

      // 1. Get refresh token from storage
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      // 2. Attempt API logout if token exists
      if (refreshToken) {
        await userLogout(refreshToken);
      }

      // 3. Clear all local authentication data
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userData'
      ]);

      // 4. Navigate to UserType screen with reset
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserType' }],
      });

    } catch (error) {
      console.error('Logout error:', error);

      // Even if API logout fails, force local cleanup
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userData'
      ]);

      // Navigate to UserType screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserType' }],
      });

      // Show error if it wasn't about expired tokens
      if (!error.message.includes('expired')) {
        Alert.alert(
          'Logout Notice',
          'You were logged out, but the session may still be active elsewhere.'
        );
      }
    }
  };

  // Function to pick image from gallery
  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Sorry, we need camera roll permissions to make this work!'
        );
        return;
      }

      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFormData({
          ...formData,
          avatar: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Function to handle form submission
  const handleUpdateProfile = async () => {
  // Validate form data
  if (!formData.name || !formData.email || !formData.phone) {
    Alert.alert('Missing Information', 'Please fill in all required fields.');
    return;
  }

  try {
    // Prepare updates (only changed fields)
    const updates = {
      ...(formData.name !== userData.name && { name: formData.name }),
      ...(formData.email !== userData.email && { email: formData.email }),
      ...(formData.phone !== userData.phone && { phone: formData.phone }),
      ...(formData.nationalId !== userData.nationalId && { nationalId: formData.nationalId }),
      // Avatar would typically be handled via separate endpoint
    };

    // Call API
    const updatedUser = await updateUserProfile(updates);

    // Update local state with API response
    setUserData(prev => ({
      ...prev,
      ...updatedUser
    }));

    // Close modal
    setProfileModalVisible(false);

    // Show success
    Alert.alert('Success', 'Profile updated successfully!');

  } catch (error) {
    console.error('Update error:', error);

    let errorMessage = 'Failed to update profile. Please try again.';

    if (error.message.includes('Invalid update data')) {
      errorMessage = 'Please check your profile information';
    } else if (error.message === 'Network connection failed') {
      errorMessage = 'Unable to connect. Please check your internet';
    } else if (error.message.includes('Role modification')) {
      errorMessage = 'You cannot change your account type';
    }

    Alert.alert('Update Failed', errorMessage);
  }
};


  // Settings menu items
  const menuItems = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: <User size={20} color="#000" />,
      onPress: () => setProfileModalVisible(true),
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: <KeyRound size={20} color="#000" />,
      onPress: () => navigation.navigate('SecuritySettings'),
    },
    {
      id: 'help',
      title: 'Help and Feedback',
      icon: <HelpCircle size={20} color="#000" />,
      onPress: () => navigation.navigate('Help'),
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: <ShieldCheck size={20} color="#000" />,
      onPress: () => navigation.navigate('Privacy'),
    },
    {
      id: 'terms',
      title: 'Terms of Usage',
      icon: <FileText size={20} color="#000" />,
      onPress: () => navigation.navigate('TermsOfUsage'),
    },
    {
      id: 'delete',
      title: 'Delete Account',
      icon: <Trash2 size={20} color="#ff3b30" />,
      onPress: () => setDeleteModalVisible(true),
      danger: true,
    },
    {
      id: 'signout',
      title: 'Sign out',
      icon: <LogOut size={20} color="#000" />,
      onPress: () => setLogoutModalVisible(true),
    },
  ];

  // Decorative circles data
  const decorativeCircles = [
    { size: 100, top: 120, right: -30, color: 'rgba(138, 63, 252, 0.1)' },
    { size: 150, top: 300, left: -70, color: 'rgba(138, 63, 252, 0.07)' },
    { size: 80, bottom: 100, right: 20, color: 'rgba(138, 63, 252, 0.05)' },
    { size: 60, top: 450, left: 30, color: 'rgba(138, 63, 252, 0.05)' },
    { size: 40, bottom: 200, right: 50, color: 'rgba(138, 63, 252, 0.08)' },
    { size: 120, bottom: -40, left: -40, color: 'rgba(138, 63, 252, 0.06)' },
    { size: 70, top: 200, right: width / 2, color: 'rgba(138, 63, 252, 0.04)' },
    {
      size: 90,
      top: height / 2,
      left: width / 3,
      color: 'rgba(138, 63, 252, 0.03)',
    },
    {
      size: 55,
      bottom: height / 3,
      left: width / 2,
      color: 'rgba(138, 63, 252, 0.07)',
    },
    {
      size: 45,
      top: height / 4,
      right: width / 4,
      color: 'rgba(138, 63, 252, 0.05)',
    },
  ];

  // Modal decorative circles data
  const modalDecorativeCircles = [
    { size: 80, top: 50, right: -30, color: 'rgba(138, 63, 252, 0.08)' },
    { size: 120, top: 200, left: -60, color: 'rgba(138, 63, 252, 0.05)' },
    { size: 60, bottom: 150, right: 20, color: 'rgba(138, 63, 252, 0.06)' },
    { size: 40, top: 350, left: 30, color: 'rgba(138, 63, 252, 0.07)' },
    { size: 30, bottom: 100, right: 40, color: 'rgba(138, 63, 252, 0.09)' },
    { size: 90, bottom: -30, left: -30, color: 'rgba(138, 63, 252, 0.04)' },
    { size: 50, top: 150, right: width / 2, color: 'rgba(138, 63, 252, 0.03)' },
  ];

  // Delete modal decorative circles
  const deleteModalCircles = [
    { size: 60, bottom: 20, right: 20, color: 'rgba(138, 43, 226, 0.1)' },
    { size: 40, bottom: 60, left: 30, color: 'rgba(138, 43, 226, 0.15)' },
    { size: 25, bottom: 30, right: 80, color: 'rgba(138, 43, 226, 0.2)' },
    { size: 35, bottom: 70, right: 140, color: 'rgba(138, 43, 226, 0.12)' },
    { size: 20, bottom: 100, left: 60, color: 'rgba(138, 43, 226, 0.18)' },
    { size: 15, bottom: 40, left: 120, color: 'rgba(138, 43, 226, 0.25)' },
  ];

  // Logout modal decorative circles
  const logoutModalCircles = [
    { size: 50, bottom: 15, right: 25, color: 'rgba(138, 43, 226, 0.12)' },
    { size: 35, bottom: 55, left: 35, color: 'rgba(138, 43, 226, 0.17)' },
    { size: 20, bottom: 35, right: 85, color: 'rgba(138, 43, 226, 0.22)' },
    { size: 30, bottom: 75, right: 145, color: 'rgba(138, 43, 226, 0.14)' },
    { size: 25, bottom: 95, left: 65, color: 'rgba(138, 43, 226, 0.2)' },
    { size: 18, bottom: 45, left: 125, color: 'rgba(138, 43, 226, 0.27)' },
  ];

  // Profile Edit Modal
  const renderProfileModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal decorative circles */}
          {modalDecorativeCircles.map((circle, index) => (
            <View
              key={`modal-circle-${index}`}
              style={[
                styles.decorativeCircle,
                {
                  width: circle.size,
                  height: circle.size,
                  borderRadius: circle.size / 2,
                  backgroundColor: circle.color,
                  top: circle.top,
                  left: circle.left,
                  right: circle.right,
                  bottom: circle.bottom,
                  zIndex: 0,
                },
              ]}
            />
          ))}

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalBackButton}
                onPress={() => setProfileModalVisible(false)}>
                <ArrowLeft size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Your Profile</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Profile Image */}
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: formData.avatar }}
                  style={styles.profileImage}
                />
                <TouchableOpacity
                  style={styles.editImageButton}
                  onPress={pickImage}>
                  <Pencil size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>National ID</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.nationalId}
                  onChangeText={(text) =>
                    setFormData({ ...formData, nationalId: text })
                  }
                  placeholder="Enter your national ID"
                />
              </View>

              {/* Update Button */}
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateProfile}>
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  };

  // Delete Account Modal
  const renderDeleteModal = () => {
    return (
      <Modal
        transparent={true}
        visible={deleteModalVisible}
        animationType="none"
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.deleteModalOverlay}>
          <Animated.View
            style={[
              styles.deleteModalContainer,
              { transform: [{ translateY: deleteSlideAnim }] },
            ]}>
            <View style={styles.deleteModalContent}>
              <View style={styles.deleteIconContainer}>
                <AlertTriangle size={40} color="#8A2BE2" />
              </View>

              <Text style={styles.deleteModalTitle}>Delete Account</Text>
              <Text style={styles.deleteModalDescription}>
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </Text>

              <View style={styles.deleteButtonContainer}>
                {/* Decorative circles */}
                {deleteModalCircles.map((circle, index) => (
                  <View
                    key={`delete-circle-${index}`}
                    style={[
                      styles.decorativeCircle,
                      {
                        width: circle.size,
                        height: circle.size,
                        borderRadius: circle.size / 2,
                        backgroundColor: circle.color,
                        bottom: circle.bottom,
                        left: circle.left,
                        right: circle.right,
                      },
                    ]}
                  />
                ))}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setDeleteModalVisible(false)}>
                  <X size={20} color="#666" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}>
                  <Trash2 size={20} color="#fff" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  // Logout Modal
  const renderLogoutModal = () => {
    return (
      <Modal
        transparent={true}
        visible={logoutModalVisible}
        animationType="none"
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.deleteModalOverlay}>
          <Animated.View
            style={[
              styles.deleteModalContainer,
              { transform: [{ translateY: logoutSlideAnim }] },
            ]}>
            <View style={styles.deleteModalContent}>
              <View
                style={[
                  styles.deleteIconContainer,
                  styles.logoutIconContainer,
                ]}>
                <AlertCircle size={40} color="#8A2BE2" />
              </View>

              <Text style={styles.deleteModalTitle}>Sign Out</Text>
              <Text style={styles.deleteModalDescription}>
                Are you sure you want to sign out? You'll need to sign in again
                to access your account.
              </Text>

              <View style={styles.deleteButtonContainer}>
                {/* Decorative circles */}
                {logoutModalCircles.map((circle, index) => (
                  <View
                    key={`logout-circle-${index}`}
                    style={[
                      styles.decorativeCircle,
                      {
                        width: circle.size,
                        height: circle.size,
                        borderRadius: circle.size / 2,
                        backgroundColor: circle.color,
                        bottom: circle.bottom,
                        left: circle.left,
                        right: circle.right,
                      },
                    ]}
                  />
                ))}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setLogoutModalVisible(false)}>
                  <X size={20} color="#666" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteButton, styles.logoutButton]}
                  onPress={handleLogout}>
                  <Check size={20} color="#fff" />
                  <Text style={styles.deleteButtonText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative circles */}
      {decorativeCircles.map((circle, index) => (
        <View
          key={`circle-${index}`}
          style={[
            styles.decorativeCircle,
            {
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              backgroundColor: circle.color,
              top: circle.top,
              left: circle.left,
              right: circle.right,
              bottom: circle.bottom,
            },
          ]}
        />
      ))}

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <View style={styles.verifiedIconContainer}>
              <BadgeCheck size={14} color="#fff" />
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{userData.name}</Text>
              <TouchableOpacity
                style={styles.editNameButton}
                onPress={() => setProfileModalVisible(true)}>
                <Edit size={16} color="#8A2BE2" />
              </TouchableOpacity>
            </View>
            <Text style={styles.joinedDate}>Joined {userData.joinedDate}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text
                  style={[
                    styles.menuItemText,
                    item.danger && styles.dangerText,
                  ]}>
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={20} color="#000" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Add some bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Profile Edit Modal */}
      {renderProfileModal()}

      {/* Delete Account Modal */}
      {renderDeleteModal()}

      {/* Logout Modal */}
      {renderLogoutModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  decorativeCircle: {
    position: 'absolute',
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
  },
  verifiedIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8A2BE2',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    marginTop: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 8,
  },
  editNameButton: {
    padding: 4,
  },
  joinedDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.082,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  dangerText: {
    color: '#ff3b30',
  },
  bottomPadding: {
    height: 30,
  },

  // Profile Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
  },
  modalBackButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: width / 2 - 70,
    backgroundColor: '#8A2BE2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  formInput: {
    backgroundColor: '#f7f7f9',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Delete/Logout Modal styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  deleteModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 10,
  },
  deleteModalContent: {
    alignItems: 'center',
  },
  deleteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutIconContainer: {
    backgroundColor: 'rgba(138, 43, 226, 0.08)',
  },
  deleteModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  deleteModalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    paddingVertical: 10,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A2BE2',
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#8A2BE2',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;
