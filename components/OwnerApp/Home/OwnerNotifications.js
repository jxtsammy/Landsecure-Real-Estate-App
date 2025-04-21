import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Home,
  MessageSquare,
  DollarSign,
  ChevronLeft,
  ArrowRight,
  Tag,
  AlertCircle,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const NotificationsScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [groupedNotifications, setGroupedNotifications] = useState({});
  
  // Mock notifications data with different types
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'schedule',
      title: 'Upcoming Tour',
      message: 'You have a property tour with Emma Johnson tomorrow at 10:00 AM',
      property: 'Fairview Apartment',
      time: '10:00 AM',
      date: 'Apr 8, 2025',
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118',
      timestamp: '2 hours ago',
      createdAt: new Date(), // Today
      read: false,
    },
    {
      id: '2',
      type: 'property_listed',
      title: 'Property Listed',
      message: 'Your property "Lakeside Villa" has been successfully listed',
      property: 'Lakeside Villa',
      price: '$450,000',
      timestamp: '5 hours ago',
      createdAt: new Date(), // Today
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      read: true,
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'Michael Chen sent you a message about Shookview House',
      sender: 'Michael Chen',
      property: 'Shookview House',
      timestamp: '1 day ago',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      read: false,
    },
    {
      id: '4',
      type: 'schedule_completed',
      title: 'Tour Completed',
      message: 'Tour with Sarah Williams for Lakeside Land Plot has been marked as completed',
      property: 'Lakeside Land Plot',
      client: 'Sarah Williams',
      timestamp: '1 day ago',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      read: true,
    },
    {
      id: '5',
      type: 'property_sold',
      title: 'Property Sold',
      message: 'Congratulations! Highland Residence has been sold for $720,000',
      property: 'Highland Residence',
      price: '$720,000',
      timestamp: '5 days ago',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Older
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      read: true,
    },
    {
      id: '6',
      type: 'schedule',
      title: 'Upcoming Tour',
      message: 'You have a property tour with David Thompson on Friday at 4:00 PM',
      property: 'Highland Residence',
      time: '4:00 PM',
      date: 'Apr 12, 2025',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      timestamp: '1 week ago',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Older
      read: true,
    },
    {
      id: '7',
      type: 'message',
      title: 'New Message',
      message: 'Emma Johnson sent you a message about Fairview Apartment',
      sender: 'Emma Johnson',
      property: 'Fairview Apartment',
      timestamp: '1 week ago',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Older
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      read: true,
    },
  ]);

  // Decorative circles data
  const decorativeCircles = [
    { size: 180, top: -50, right: -90, color: "rgba(138, 63, 252, 0.08)" },
    { size: 140, top: 200, left: -70, color: "rgba(138, 63, 252, 0.05)" },
    { size: 200, bottom: 100, right: -100, color: "rgba(138, 63, 252, 0.07)" },
    { size: 120, bottom: -60, left: 20, color: "rgba(138, 63, 252, 0.06)" },
    { size: 80, top: 350, right: 30, color: "rgba(138, 63, 252, 0.04)" },
  ];

  // Function to mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Function to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'schedule':
        return <Calendar size={24} color="#8a3ffc" />;
      case 'property_listed':
        return <Tag size={24} color="#4CAF50" />;
      case 'message':
        return <MessageSquare size={24} color="#2196F3" />;
      case 'schedule_completed':
        return <CheckCircle size={24} color="#8a3ffc" />;
      case 'property_sold':
        return <DollarSign size={24} color="#FF9800" />;
      default:
        return <Bell size={24} color="#8a3ffc" />;
    }
  };

  // Function to get background color based on notification type
  const getNotificationBackground = (type, read) => {
    if (!read) {
      return { backgroundColor: '#f0e6ff' };
    }
    
    switch (type) {
      case 'schedule':
        return { backgroundColor: 'rgba(138, 63, 252, 0.05)' };
      case 'property_listed':
        return { backgroundColor: 'rgba(76, 175, 80, 0.05)' };
      case 'message':
        return { backgroundColor: 'rgba(33, 150, 243, 0.05)' };
      case 'schedule_completed':
        return { backgroundColor: 'rgba(138, 63, 252, 0.05)' };
      case 'property_sold':
        return { backgroundColor: 'rgba(255, 152, 0, 0.05)' };
      default:
        return { backgroundColor: '#fff' };
    }
  };

  // Filter notifications based on active filter
  const filterNotifications = () => {
    let filtered = [...notifications];
    
    switch (activeFilter) {
      case 'unread':
        filtered = notifications.filter(notification => !notification.read);
        break;
      case 'tours':
        filtered = notifications.filter(notification => 
          notification.type === 'schedule' || notification.type === 'schedule_completed'
        );
        break;
      case 'messages':
        filtered = notifications.filter(notification => notification.type === 'message');
        break;
      default:
        // 'all' filter - no filtering needed
        break;
    }
    
    return filtered;
  };

  // Group notifications by date
  const groupNotificationsByDate = (filteredNotifications) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const grouped = {
      today: [],
      yesterday: [],
      older: []
    };
    
    filteredNotifications.forEach(notification => {
      const notificationDate = new Date(notification.createdAt);
      notificationDate.setHours(0, 0, 0, 0);
      
      if (notificationDate.getTime() === today.getTime()) {
        grouped.today.push(notification);
      } else if (notificationDate.getTime() === yesterday.getTime()) {
        grouped.yesterday.push(notification);
      } else {
        grouped.older.push(notification);
      }
    });
    
    return grouped;
  };

  // Update grouped notifications when filter changes
  useEffect(() => {
    const filtered = filterNotifications();
    const grouped = groupNotificationsByDate(filtered);
    setGroupedNotifications(grouped);
  }, [activeFilter, notifications]);

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Notifications</Text>
        <View style={styles.headerRight}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
          <Bell size={24} color="#333" />
        </View>
      </View>

      {/* Notification filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={activeFilter === 'all' ? styles.activeFilterText : styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'unread' && styles.activeFilter]}
          onPress={() => setActiveFilter('unread')}
        >
          <Text style={activeFilter === 'unread' ? styles.activeFilterText : styles.filterText}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'tours' && styles.activeFilter]}
          onPress={() => setActiveFilter('tours')}
        >
          <Text style={activeFilter === 'tours' ? styles.activeFilterText : styles.filterText}>Tours</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'messages' && styles.activeFilter]}
          onPress={() => setActiveFilter('messages')}
        >
          <Text style={activeFilter === 'messages' ? styles.activeFilterText : styles.filterText}>Messages</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications list */}
      <ScrollView 
        style={styles.notificationsContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's notifications */}
        {groupedNotifications.today && groupedNotifications.today.length > 0 && (
          <>
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>Today</Text>
            </View>
            {groupedNotifications.today.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  getNotificationBackground(notification.type, notification.read)
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                {!notification.read && <View style={styles.unreadIndicator} />}
                
                <View style={styles.notificationIconContainer}>
                  {getNotificationIcon(notification.type)}
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                  </View>
                  
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  {notification.type === 'schedule' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.time}, {notification.date}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'property_listed' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <DollarSign size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.price}</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'message' && (
                    <View style={styles.messagePreview}>
                      <Image source={{ uri: notification.avatar }} style={styles.senderAvatar} />
                      <View style={styles.messageInfo}>
                        <Text style={styles.senderName}>{notification.sender}</Text>
                        <Text style={styles.propertyName}>Re: {notification.property}</Text>
                      </View>
                      <ArrowRight size={16} color="#8a3ffc" />
                    </View>
                  )}
                  
                  {notification.type === 'schedule_completed' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <CheckCircle size={14} color="#4CAF50" />
                        <Text style={[styles.detailText, { color: '#4CAF50' }]}>Completed</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'property_sold' && (
                    <View style={styles.soldBanner}>
                      <DollarSign size={14} color="#fff" />
                      <Text style={styles.soldText}>SOLD for {notification.price}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Yesterday's notifications */}
        {groupedNotifications.yesterday && groupedNotifications.yesterday.length > 0 && (
          <>
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>Yesterday</Text>
            </View>
            {groupedNotifications.yesterday.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  getNotificationBackground(notification.type, notification.read)
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                {!notification.read && <View style={styles.unreadIndicator} />}
                
                <View style={styles.notificationIconContainer}>
                  {getNotificationIcon(notification.type)}
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                  </View>
                  
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  {notification.type === 'schedule' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.time}, {notification.date}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'property_listed' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <DollarSign size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.price}</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'message' && (
                    <View style={styles.messagePreview}>
                      <Image source={{ uri: notification.avatar }} style={styles.senderAvatar} />
                      <View style={styles.messageInfo}>
                        <Text style={styles.senderName}>{notification.sender}</Text>
                        <Text style={styles.propertyName}>Re: {notification.property}</Text>
                      </View>
                      <ArrowRight size={16} color="#8a3ffc" />
                    </View>
                  )}
                  
                  {notification.type === 'schedule_completed' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <CheckCircle size={14} color="#4CAF50" />
                        <Text style={[styles.detailText, { color: '#4CAF50' }]}>Completed</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'property_sold' && (
                    <View style={styles.soldBanner}>
                      <DollarSign size={14} color="#fff" />
                      <Text style={styles.soldText}>SOLD for {notification.price}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Older notifications */}
        {groupedNotifications.older && groupedNotifications.older.length > 0 && (
          <>
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>Older</Text>
            </View>
            {groupedNotifications.older.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  getNotificationBackground(notification.type, notification.read)
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                {!notification.read && <View style={styles.unreadIndicator} />}
                
                <View style={styles.notificationIconContainer}>
                  {getNotificationIcon(notification.type)}
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                  </View>
                  
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  {notification.type === 'schedule' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.time}, {notification.date}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'property_listed' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <DollarSign size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.price}</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'message' && (
                    <View style={styles.messagePreview}>
                      <Image source={{ uri: notification.avatar }} style={styles.senderAvatar} />
                      <View style={styles.messageInfo}>
                        <Text style={styles.senderName}>{notification.sender}</Text>
                        <Text style={styles.propertyName}>Re: {notification.property}</Text>
                      </View>
                      <ArrowRight size={16} color="#8a3ffc" />
                    </View>
                  )}
                  
                  {notification.type === 'schedule_completed' && (
                    <View style={styles.notificationDetails}>
                      <View style={styles.detailItem}>
                        <Home size={14} color="#666" />
                        <Text style={styles.detailText}>{notification.property}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <CheckCircle size={14} color="#4CAF50" />
                        <Text style={[styles.detailText, { color: '#4CAF50' }]}>Completed</Text>
                      </View>
                    </View>
                  )}
                  
                  {notification.type === 'property_sold' && (
                    <View style={styles.soldBanner}>
                      <DollarSign size={14} color="#fff" />
                      <Text style={styles.soldText}>SOLD for {notification.price}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Empty state when no notifications match the filter */}
        {Object.values(groupedNotifications).every(group => group.length === 0) && (
          <View style={styles.emptyStateContainer}>
            <Bell size={60} color="#8a3ffc" />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateText}>
              {activeFilter === 'unread' 
                ? "You've read all your notifications" 
                : activeFilter === 'tours' 
                  ? "No tour notifications available" 
                  : activeFilter === 'messages' 
                    ? "No message notifications available"
                    : "You don't have any notifications yet"}
            </Text>
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    position: 'relative',
    padding: 5,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#8a3ffc',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#8a3ffc',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateHeader: {
    paddingVertical: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#8a3ffc',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  notificationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  notificationDetails: {
    marginTop: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  senderAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  propertyName: {
    fontSize: 12,
    color: '#666',
  },
  soldBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  soldText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  bottomPadding: {
    height: 30,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    minHeight: 300,
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
});

export default NotificationsScreen;