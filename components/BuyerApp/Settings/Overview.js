'use client';

import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  Platform,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  User,
  Bell,
  HelpCircle,
  Lock,
  FileText,
  LogOut,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { updateUserProfile, deleteUser, userLogout,getUserProfile } from '../../../services/api/userManagement/getUsers/users'

const { width, height } = Dimensions.get('window');

// Generate random circles for decoration
const decorativeCircles = Array(12)
  .fill(0)
  .map((_, i) => ({
    id: i,
    size: Math.random() * 120 + 40,
    top: Math.random() * height * 0.7,
    left: Math.random() * width,
    opacity: Math.random() * 0.15 + 0.05,
  }));

const ProfileSettingsScreen = () => {
  // Get navigation from hook instead of props
  const navigation = useNavigation();

  // Animation values
  const bottomContainerAnim = useRef(new Animated.Value(height)).current;
  const profileOpacityAnim = useRef(new Animated.Value(0)).current;
  const optionsOpacityAnim = useRef(new Animated.Value(1)).current;
  const profileFormOpacityAnim = useRef(new Animated.Value(0)).current;
  const deleteModalAnim = useRef(new Animated.Value(height)).current;
  const logoutModalAnim = useRef(new Animated.Value(height)).current;

  // State for user data
  const [profileImage, setProfileImage] = useState(
    'https://randomuser.me/api/portraits/men/32.jpg'
  );
  const [userData, setUserData] = useState({
    fullName: 'Mike Greenforest',
    username: 'mikeg',
    email: 'mike.greenforest@example.com',
    phone: 'password123',
    profile_picture: null
  });

  // State to control form visibility
  const [showProfileForm, setShowProfileForm] = useState(false);
  // State to track bottom container height
  const [bottomContainerHeight, setBottomContainerHeight] = useState(
    height * 0.55
  );
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Add state for delete modal visibility
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // Add state for logout modal visibility
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    // Start animations when component mounts
    Animated.sequence([
      // First slide up the bottom container
      Animated.timing(bottomContainerAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: (t) => --t * t * t + 1, // Ease out cubic
      }),
      // Then fade in the profile elements
      Animated.timing(profileOpacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: (t) => t * t, // Ease in quad
      }),
    ]).start();
  }, []);

  // Handle delete modal animation
  useEffect(() => {
    if (deleteModalVisible) {
      Animated.timing(deleteModalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(deleteModalAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [deleteModalVisible]);

  // Handle logout modal animation
  useEffect(() => {
    if (logoutModalVisible) {
      Animated.timing(logoutModalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(logoutModalAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [logoutModalVisible]);

  // Function to pick an image from gallery
  const pickImage = async () => {
    // Request permission first
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Function to show the profile form
  const showPersonalInfoForm = () => {
    // First fade out the options
    Animated.timing(optionsOpacityAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      // Then expand the container
      setShowProfileForm(true);
      setBottomContainerHeight(height * 0.95);

      // After container expands, fade in the profile form
      setTimeout(() => {
        Animated.timing(profileFormOpacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }, 100);
    });
  };

  // Function to hide the profile form
  const hideProfileForm = () => {
    // First fade out the profile form
    Animated.timing(profileFormOpacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Then shrink the container
      setBottomContainerHeight(height * 0.55);

      // After container shrinks, fade in the main options
      setTimeout(() => {
        setShowProfileForm(false);
        Animated.timing(optionsOpacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 100);
    });
  };

  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfile();
        console.log('Fetched user profile:', user);
        setUserData({
          fullName: user.firstName , // Use appropriate field from API
          email: user.email || '',
          phone: user.phone ,
          profile_picture: user.profile_picture || null
        });
        if (user.profile_picture) setProfileImage(user.profile_picture);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
console.log('Fetching user profile on mount');
    fetchUserProfile();
  }, []);

  // Function to save user data
  const saveUserData = async () => {
    // Filter out unchanged or empty fields
    const updates = {
      ...(userData.firstName !== 'Mike Greenforest' && { firstName: userData.fisrtName }),
      ...(userData.username !== 'mikeg' && { username: userData.username }),
      ...(userData.email !== 'mike.greenforest@example.com' && { email: userData.email }),
      // Don't send password unless it's being changed (and you should hash it first)
    };

    // Remove empty fields
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined || updates[key] === '') {
        delete updates[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      hideProfileForm();
      return;
    }

    try {
      setIsSaving(true);
      setProfileError('');

      const updatedUser = await updateUserProfile(updates);

      // Update local state with the returned user data
      setUserData(prev => ({
        ...prev,
        ...updatedUser
      }));

      hideProfileForm();
      Alert.alert('Success', 'Profile updated successfully!');

    } catch (error) {
      console.error('Profile update error:', error);

      let errorMessage = error.message;

      if (error.message.includes('Role modification not permitted')) {
        errorMessage = 'You cannot change your role';
      } else if (error.message.includes('Invalid update data')) {
        errorMessage = 'Please check your profile information';
      } else if (error.message === 'Network connection failed') {
        errorMessage = 'Unable to connect. Please check your internet';
      }

      setProfileError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Navigation functions with debug alerts
  const navigateToNotifications = () => {
    try {
      navigation.navigate('Notification');
    } catch (error) {
      Alert.alert('Navigation Error', error.message);
    }
  };

  const navigateToHelp = () => {
    try {
      navigation.navigate('Help');
    } catch (error) {
      Alert.alert('Navigation Error', error.message);
    }
  };

  const navigateToPrivacy = () => {
    try {
      navigation.navigate('Privacy');
    } catch (error) {
      Alert.alert('Navigation Error', error.message);
    }
  };

  const navigateToTerms = () => {
    try {
      navigation.navigate('TermsOfUsage');
    } catch (error) {
      Alert.alert('Navigation Error', error.message);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);
      setLoading(true); // Show loading indicator if you have one

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

      // 4. Navigate to UserType screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserType' }],
      });

    } catch (error) {
      console.error('Logout error:', error);

      // Even if logout failed, force local cleanup
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userData'
      ]);

      Alert.alert(
        'Logout Completed',
        'You have been logged out. ' +
        (error.message || 'Your session may still be active on other devices.')
      );

      navigation.reset({
        index: 0,
        routes: [{ name: 'UserType' }],
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle delete account
  const handleDeleteAccount = async () => {
    try {
      setDeleteModalVisible(false);
      setLoading(true); // Show loading indicator

      // Call the delete API with the current user's ID
      const success = await deleteUser(currentUserId); // You'll need to get the current user's ID

      if (success) {
        // Clear user data from storage
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);

        Alert.alert(
          'Account Deleted',
          'Your account has been permanently deleted.',
          [{ text: 'OK', onPress: () => navigation.navigate('UserType') }]
        );
      }

    } catch (error) {
      console.error('Account deletion failed:', error);

      let errorMessage = 'Failed to delete account. Please try again.';

      if (error.message === 'Admin authorization required') {
        errorMessage = 'You need admin privileges to perform this action';
      } else if (error.message === 'Your account lacks permissions') {
        errorMessage = 'You do not have permission to delete this account';
      } else if (error.message === 'User not found') {
        errorMessage = 'Account not found or already deleted';
      } else if (error.message === 'Network connection failed') {
        errorMessage = 'Unable to connect. Please check your internet connection';
      }

      Alert.alert('Deletion Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Decorative Circles */}
      {decorativeCircles.map((circle) => (
        <View
          key={circle.id}
          style={[
            styles.decorativeCircle,
            {
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              top: circle.top,
              left: circle.left,
              opacity: circle.opacity,
            },
          ]}
        />
      ))}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Setting Account</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Section - Animated */}
      <Animated.View
        style={[styles.profileSection, { opacity: profileOpacityAnim }]}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View style={styles.onlineIndicator} />
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{userData.fullName}</Text>
            <TouchableOpacity style={styles.editNameButton} onPress={pickImage}>
              <Edit size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.joinedText}>Joined 5 weeks ago</Text>
        </View>
      </Animated.View>

      {/* Bottom Container - Animated */}
      <Animated.View
        style={[
          styles.bottomContainer,
          {
            height: bottomContainerHeight,
            transform: [{ translateY: bottomContainerAnim }],
          },
        ]}>
        {/* Main Menu Items - Fade out when profile form is shown */}
        <Animated.View
          style={[
            styles.menuContainer,
            {
              opacity: optionsOpacityAnim,
              display: showProfileForm ? 'none' : 'flex',
            },
          ]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={showPersonalInfoForm}>
            <View style={styles.menuItemLeft}>
              <User size={22} color="#000" />
              <Text style={styles.menuItemText}>Personal Information</Text>
            </View>
            <ChevronRight size={20} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToNotifications}>
            <View style={styles.menuItemLeft}>
              <Bell size={22} color="#000" />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={navigateToHelp}>
            <View style={styles.menuItemLeft}>
              <HelpCircle size={22} color="#000" />
              <Text style={styles.menuItemText}>Help & Feedback</Text>
            </View>
            <ChevronRight size={20} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={navigateToPrivacy}>
            <View style={styles.menuItemLeft}>
              <Lock size={22} color="#000" />
              <Text style={styles.menuItemText}>Privacy Portal</Text>
            </View>
            <ChevronRight size={20} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={navigateToTerms}>
            <View style={styles.menuItemLeft}>
              <FileText size={22} color="#000" />
              <Text style={styles.menuItemText}>Terms of Use</Text>
            </View>
            <ChevronRight size={20} color="#333" />
          </TouchableOpacity>

          {/* Logout Button - Updated to show modal */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutModalVisible(true)}>
            <LogOut size={22} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Form - Fade in when shown */}
        <Animated.View
          style={[
            styles.profileFormContainer,
            {
              opacity: profileFormOpacityAnim,
              display: showProfileForm ? 'flex' : 'none',
            },
          ]}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.profileFormHeader}>
            <TouchableOpacity onPress={hideProfileForm}>
              <ChevronLeft color="#000" size={24} />
            </TouchableOpacity>
            <Text style={styles.profileFormTitle}>Personal Settings</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.profileFormScrollView}>
            {/* Personal Information Section */}
            <Text style={styles.sectionHeader}>Personal Information</Text>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Full name</Text>
              <TextInput
                style={styles.input}
                value={userData.fullName}
                onChangeText={(text) =>
                  setUserData({ ...userData, fullName: text })
                }
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={userData.phone}
                onChangeText={(text) =>
                  setUserData({ ...userData, username: text })
                }
                placeholder="Enter your username"
              />
            </View>

            {/* Sign In & Security Section */}
            <Text style={styles.sectionHeader}>Sign In & Security</Text>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={userData.email}
                onChangeText={(text) =>
                  setUserData({ ...userData, email: text })
                }
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            {/* <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={userData.password}
                  onChangeText={(text) =>
                    setUserData({ ...userData, password: text })
                  }
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#888" />
                  ) : (
                    <Eye size={20} color="#888" />
                  )}
                </TouchableOpacity>
              </View>
            </View> */}

            {/* Manage Account Section */}
            <Text style={styles.sectionHeader}>Manage Account</Text>

            {/* Update the deactivateButton onPress to show the modal */}
            <TouchableOpacity
              style={styles.deactivateButton}
              onPress={() => setDeleteModalVisible(true)}>
              <Text style={styles.deactivateText}>
                Deactivate or delete account
              </Text>
              <ChevronRight size={20} color="#CCCCCC" />
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={saveUserData}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Animated.View>

      {/* Delete Account Modal - Bottom Sheet Style */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              {
                transform: [{ translateY: deleteModalAnim }],
              },
            ]}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            <View style={styles.modalIconContainer}>
              <AlertTriangle size={30} color="#FF3B30" />
            </View>

            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalDescription}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Logout Modal - Bottom Sheet Style */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              {
                transform: [{ translateY: logoutModalAnim }],
              },
            ]}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            <View style={styles.modalIconContainer}>
              <AlertCircle size={30} color="#088a6a" />
            </View>

            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalDescription}>
              Are you sure you want to sign out? You'll need to sign in again to
              access your account.
            </Text>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.logoutConfirmButton]}
                onPress={handleLogout}>
                <Text style={styles.deleteButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: '#6B46C1',
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: 'rgba(107, 70, 193, 0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22C55E',
    borderRadius: 10,
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#121212',
  },
  profileInfo: {
    alignSelf: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  editNameButton: {
    padding: 6,
    backgroundColor: 'rgba(107, 70, 193, 0.2)',
    borderRadius: 12,
  },
  joinedText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    overflow: 'hidden',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 17,
    marginLeft: 18,
    color: '#333333',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#000',
    borderRadius: 30,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  profileFormContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileFormHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingTop: 80,
  },
  profileFormTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginLeft: 16,
  },
  profileFormScrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    color: '#888888',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: 'bold',
  },
  formField: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#F9F9F9',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  passwordToggle: {
    padding: 8,
    marginRight: 8,
  },
  deactivateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  deactivateText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 24,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F2F2F2',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  logoutConfirmButton: {
    backgroundColor: '#088a6a',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSettingsScreen;
