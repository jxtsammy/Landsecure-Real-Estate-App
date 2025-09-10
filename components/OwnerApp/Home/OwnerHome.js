import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {
  User,
  Grid,
  List,
  Plus,
  Heart,
  Calendar,
  MessageSquare,
  DollarSign,
  BarChart3,
  Home,
  Clock,
  Star,
  MapPin,
  Check,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Animation values
  const notificationAnim = useRef(new Animated.Value(0)).current;
  const bubble1Anim = useRef(new Animated.Value(0)).current;
  const bubble2Anim = useRef(new Animated.Value(0)).current;
  const bubble3Anim = useRef(new Animated.Value(0)).current;

  // Mock user data
  const user = {
    name: 'Jonathan Anderson',
    email: 'jonathan@email.com',
    avatar: '', // Set this to a user image URL or leave it empty for the default icon
    stats: [
      { label: 'Listings', value: 30 },
      { label: 'Sold', value: 12 },
      { label: 'Consultations', value: 28 },
    ],
  };

  // Mock overview data
  const overviewData = [
    {
      id: 'properties',
      title: 'Listed Properties',
      value: 30,
      icon: <Home size={20} color="#8A2BE2" />,
    },
    {
      id: 'inquiries',
      title: 'Pending Inquiries',
      value: 15,
      icon: <MessageSquare size={20} color="#8A2BE2" />,
    },
    {
      id: 'tours',
      title: 'Scheduled Tours',
      value: 8,
      icon: <Calendar size={20} color="#8A2BE2" />,
    },
    {
      id: 'offers',
      title: 'Recent Offers',
      value: 5,
      icon: <DollarSign size={20} color="#8A2BE2" />,
    },
  ];

  // Mock property listings
  const [propertyListings, setPropertyListings] = useState([
    {
      id: '1',
      name: 'Fairview Apartment',
      price: 370000,
      pricePerMonth: 370,
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118',
      rating: 4.5,
      location: 'Seattle, Downtown',
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Shookview House',
      price: 320000,
      pricePerMonth: 320,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      rating: 4.8,
      location: 'Bellevue, Washington',
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Lakeside Land Plot',
      price: 250000,
      pricePerMonth: null,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      rating: 4.2,
      location: 'Lake Washington',
      isFavorite: false,
    },
  ]);

  // Mock scheduled tours data
  const [scheduledTours, setScheduledTours] = useState([
    {
      id: '1',
      propertyName: 'Fairview Apartment',
      clientName: 'Emma Johnson',
      date: 'Apr 8, 2025',
      time: '10:00 AM',
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118',
      clientAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '2',
      propertyName: 'Shookview House',
      clientName: 'Michael Chen',
      date: 'Apr 9, 2025',
      time: '2:30 PM',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      clientAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    {
      id: '3',
      propertyName: 'Lakeside Land Plot',
      clientName: 'Sarah Williams',
      date: 'Apr 10, 2025',
      time: '11:15 AM',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      clientAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    {
      id: '4',
      propertyName: 'Highland Residence',
      clientName: 'David Thompson',
      date: 'Apr 12, 2025',
      time: '4:00 PM',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      clientAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
  ]);

  // Chart data
  const propertyViewsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: () => '#8A2BE2',
        strokeWidth: 2,
      },
    ],
  };

  const transactionStatusData = {
    labels: ['Listed', 'Viewed', 'Offered', 'Sold'],
    datasets: [
      {
        data: [30, 22, 15, 12],
      },
    ],
  };

  // Decorative circles data
  const decorativeCircles = [
    { size: 100, top: 120, right: -30, color: 'rgba(138, 63, 252, 0.1)' },
    { size: 150, top: 300, left: -70, color: 'rgba(138, 63, 252, 0.07)' },
    { size: 80, bottom: 100, right: 20, color: 'rgba(138, 63, 252, 0.05)' },
    { size: 60, top: 450, left: 30, color: 'rgba(138, 63, 252, 0.05)' },
    { size: 40, bottom: 200, right: 50, color: 'rgba(138, 63, 252, 0.08)' },
    { size: 120, bottom: -40, left: -40, color: 'rgba(138, 63, 252, 0.06)' },
  ];

  // Function to show notification
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);

    // Animate notification
    Animated.sequence([
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.delay(2400),
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowNotification(false);
    });

    // Animate bubbles
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(bubble1Anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bubble2Anim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          delay: 200,
        }),
        Animated.timing(bubble3Anim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
          delay: 400,
        }),
      ]),
    ]).start(() => {
      bubble1Anim.setValue(0);
      bubble2Anim.setValue(0);
      bubble3Anim.setValue(0);
    });
  };

  // Function to mark a tour as completed
  const markTourCompleted = (tourId) => {
    const tour = scheduledTours.find((t) => t.id === tourId);
    setScheduledTours(scheduledTours.filter((tour) => tour.id !== tourId));
    showNotificationMessage(`Tour with ${tour.clientName} Completed`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Overview Cards */}
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.overviewContainer}>
              {overviewData.map((item) => (
                <View key={item.id} style={styles.overviewCard}>
                  <View style={styles.overviewIconContainer}>{item.icon}</View>
                  <Text style={styles.overviewValue}>{item.value}</Text>
                  <Text style={styles.overviewTitle}>{item.title}</Text>
                </View>
              ))}
            </View>

            {/* Charts */}
            <Text style={styles.sectionTitle}>Analytics</Text>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Property Views</Text>
              <LineChart
                data={propertyViewsData}
                width={width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(138, 63, 252, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#8A2BE2',
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Transaction Status</Text>
              <BarChart
                data={transactionStatusData}
                width={width - 40}
                height={220}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(138, 63, 252, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  barPercentage: 0.5,
                }}
                style={styles.chart}
              />
            </View>
            <View style={styles.bottomPadding} />
          </ScrollView>
        );
      case 'listings':
        return (
          <>
            <View style={styles.listingsHeader}>
              <Text style={styles.listingsTitle}>
                {user.stats[0].value} listings
              </Text>
              <View style={styles.listingsActions}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate('AddProperty')}>
                  <Plus size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {propertyListings.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Property Listings */}
                <View style={styles.propertiesContainer}>
                  {propertyListings.map((property) => (
                    <View key={property.id} style={styles.propertyCard}>
                      <Image
                        source={{ uri: property.image }}
                        style={styles.propertyImage}
                      />

                      <View style={styles.propertyDetails}>
                        <Text style={styles.propertyPrice}>
                          ${' '}
                          {property.pricePerMonth
                            ? `${property.pricePerMonth}/month`
                            : property.price.toLocaleString()}
                        </Text>
                        <Text style={styles.propertyName}>{property.name}</Text>
                        <View style={styles.propertyMeta}>
                          <View style={styles.ratingContainer}>
                            <Star size={14} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.ratingText}>
                              {property.rating}
                            </Text>
                          </View>
                          <View style={styles.locationContainer}>
                            <MapPin size={14} color="#666" />
                            <Text style={styles.locationText}>
                              {property.location}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.bottomPadding} />
              </ScrollView>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Home size={60} color="#8A2BE2" />
                <Text style={styles.emptyStateTitle}>No Properties Listed</Text>
                <Text style={styles.emptyStateText}>
                  You don't have any properties listed yet
                </Text>
                <TouchableOpacity style={styles.emptyStateButton}>
                  <Plus size={16} color="#fff" />
                  <Text style={styles.emptyStateButtonText}>Add Property</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        );
      case 'schedules':
        return (
          <>
            <Text style={styles.sectionTitle}>Upcoming Tours</Text>
            {scheduledTours.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {scheduledTours.map((tour) => (
                  <View key={tour.id} style={styles.scheduleCard}>
                    <Image
                      source={{ uri: tour.image }}
                      style={styles.schedulePropertyImage}
                    />
                    <View style={styles.scheduleContent}>
                      <View style={styles.scheduleHeader}>
                        <Text style={styles.schedulePropertyName}>
                          {tour.propertyName}
                        </Text>
                        <View style={styles.scheduleTimeContainer}>
                          <Calendar size={14} color="#8A2BE2" />
                          <Text style={styles.scheduleTime}>{tour.date}</Text>
                        </View>
                      </View>

                      <View style={styles.scheduleClientContainer}>
                        <Image
                          source={{ uri: tour.clientAvatar }}
                          style={styles.clientAvatar}
                        />
                        <View style={styles.scheduleClientInfo}>
                          <Text style={styles.clientName}>
                            {tour.clientName}
                          </Text>
                          <View style={styles.scheduleTimeContainer}>
                            <Clock size={14} color="#666" />
                            <Text style={styles.scheduleTimeText}>
                              {tour.time}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.completeButton}
                        onPress={() => markTourCompleted(tour.id)}>
                        <Check size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <View style={styles.bottomPadding} />
              </ScrollView>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Calendar size={60} color="#8A2BE2" />
                <Text style={styles.emptyStateTitle}>No Upcoming Tours</Text>
                <Text style={styles.emptyStateText}>
                  You have no scheduled tours at the moment
                </Text>
              </View>
            )}
          </>
        );
      case 'tours':
        return (
          <View style={styles.emptyStateContainer}>
            <MessageSquare size={60} color="#8A2BE2" />
            <Text style={styles.emptyStateTitle}>No Inquiries</Text>
            <Text style={styles.emptyStateText}>
              You don't have any pending inquiries
            </Text>
          </View>
        );
      default:
        return null;
    }
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

      {/* Notification */}
      {showNotification && (
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [
                {
                  translateY: notificationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
                {
                  scale: notificationAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.8, 1.1, 1],
                  }),
                },
              ],
              opacity: notificationAnim,
            },
          ]}>
          <View style={styles.notificationContent}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.notificationText}>{notificationMessage}</Text>
          </View>

          {/* Animated bubbles */}
          <Animated.View
            style={[
              styles.bubble,
              styles.bubble1,
              {
                transform: [
                  {
                    translateY: bubble1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                  {
                    translateX: bubble1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                  {
                    scale: bubble1Anim.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0, 1, 0],
                    }),
                  },
                ],
                opacity: bubble1Anim.interpolate({
                  inputRange: [0, 0.2, 0.8, 1],
                  outputRange: [0, 1, 1, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.bubble,
              styles.bubble2,
              {
                transform: [
                  {
                    translateY: bubble2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -30],
                    }),
                  },
                  {
                    translateX: bubble2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 5],
                    }),
                  },
                  {
                    scale: bubble2Anim.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0, 1, 0],
                    }),
                  },
                ],
                opacity: bubble2Anim.interpolate({
                  inputRange: [0, 0.2, 0.8, 1],
                  outputRange: [0, 1, 1, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.bubble,
              styles.bubble3,
              {
                transform: [
                  {
                    translateY: bubble3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -25],
                    }),
                  },
                  {
                    translateX: bubble3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 20],
                    }),
                  },
                  {
                    scale: bubble3Anim.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0, 1, 0],
                    }),
                  },
                ],
                opacity: bubble3Anim.interpolate({
                  inputRange: [0, 0.2, 0.8, 1],
                  outputRange: [0, 1, 1, 0],
                }),
              },
            ]}
          />
        </Animated.View>
      )}

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <User size={40} color="#000" />
              </View>
            )}
            <TouchableOpacity style={styles.editButton}>
              <User size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {user.stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollView}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
            onPress={() => setActiveTab('dashboard')}>
            <BarChart3
              size={16}
              color={activeTab === 'dashboard' ? '#8A2BE2' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'dashboard' && styles.activeTabText,
              ]}>
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'listings' && styles.activeTab]}
            onPress={() => setActiveTab('listings')}>
            <Home
              size={16}
              color={activeTab === 'listings' ? '#8A2BE2' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'listings' && styles.activeTabText,
              ]}>
              Listings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'schedules' && styles.activeTab]}
            onPress={() => setActiveTab('schedules')}>
            <Calendar
              size={16}
              color={activeTab === 'schedules' ? '#8A2BE2' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'schedules' && styles.activeTabText,
              ]}>
              Schedules
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tours' && styles.activeTab]}
            onPress={() => setActiveTab('tours')}>
            <MessageSquare
              size={16}
              color={activeTab === 'tours' ? '#8A2BE2' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'tours' && styles.activeTabText,
              ]}>
              Inquiries
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>{renderTabContent()}</View>
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
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  defaultAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8A2BE2',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tabsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tabsScrollView: {
    paddingRight: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#f0e6ff',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#8A2BE2',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  overviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  overviewCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewIconContainer: {
    marginBottom: 10,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  overviewTitle: {
    fontSize: 14,
    color: '#666',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listingsActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewToggle: {
    padding: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#8A2BE2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  propertyCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  propertyDetails: {
    padding: 12,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  propertyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  // Schedule card styles
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  schedulePropertyImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  scheduleContent: {
    padding: 15,
    position: 'relative',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  schedulePropertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#8A2BE2',
    marginLeft: 5,
    fontWeight: '500',
  },
  scheduleClientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  scheduleClientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  scheduleTimeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  completeButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#8A2BE2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomPadding: {
    height: 30,
  },
  // Notification styles
  notificationContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  bubble: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(138, 63, 252, 0.3)',
  },
  bubble1: {
    top: '50%',
    left: '20%',
    width: 10,
    height: 10,
  },
  bubble2: {
    top: '30%',
    left: '50%',
    width: 14,
    height: 14,
  },
  bubble3: {
    top: '60%',
    right: '25%',
    width: 8,
    height: 8,
  },
});

export default HomeScreen;