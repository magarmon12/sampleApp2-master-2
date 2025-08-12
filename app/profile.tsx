import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { account } from '@/lib/appwrite';

interface UserComponentProps {
  user: any;
  onUserUpdate?: (user: any) => void;
}

const UserComponent: React.FC<UserComponentProps> = ({ user, onUserUpdate }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [dynamicUser, setDynamicUser] = useState(user);

  // Dynamic time update every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC');
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Dynamic user data sync
  useEffect(() => {
    setDynamicUser(user);
    if (user) {
      setLastUpdated(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC');
      console.log(`✅ [${currentTime}] Dynamic user data updated for jhaaadarsh7:`, user.email);
    }
  }, [user, currentTime]);

  // Fetch fresh user data dynamically
  const fetchFreshUserData = async () => {
    try {
      const freshUser = await account.get();
      setDynamicUser(freshUser);
      setLastUpdated(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC');
      return freshUser;
    } catch (error) {
      console.error(` [${currentTime}] Error fetching fresh user data:`, error);
      throw error;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'JH'; 
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown';
    }
  };

  const updatePreferences = async (newPrefs: any) => {
    if (!dynamicUser) return;

    try {
      setUpdating(true);
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
      
      console.log(`🔍 [${timestamp}] jhaaadarsh7 updating preferences:`, newPrefs);
      
      const currentPrefs = dynamicUser.prefs || {};
      const updatedPrefs = { 
        ...currentPrefs, 
        ...newPrefs,
        lastModified: timestamp,
        modifiedBy: 'jhaaadarsh7'
      };
      
      await account.updatePrefs(updatedPrefs);
      
      // Fetch fresh data after update
      const updatedUser = await fetchFreshUserData();
      
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      Alert.alert('Success', `Profile updated successfully at ${timestamp}! 🎉`);
      console.log(`✅ [${timestamp}] Preferences updated successfully for jhaaadarsh7`);
      
    } catch (error) {
      console.error(`❌ [${currentTime}] Error updating preferences for jhaaadarsh7:`, error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const onRefresh = async () => {
    if (!dynamicUser) return;
    
    try {
      setRefreshing(true);
      console.log(`🔄 [${currentTime}] jhaaadarsh7 refreshing profile data...`);
      
      const refreshedUser = await fetchFreshUserData();
      
      if (onUserUpdate) {
        onUserUpdate(refreshedUser);
      }
      
      console.log(`✅ [${currentTime}] Profile refreshed successfully for jhaaadarsh7`);
      
    } catch (error) {
      console.error(`❌ [${currentTime}] Error refreshing user data:`, error);
      Alert.alert('Error', 'Failed to refresh profile data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!dynamicUser) return;

    const autoRefresh = setInterval(async () => {
      try {
        console.log(`🔄 [${currentTime}] Auto-refreshing data for jhaaadarsh7...`);
        const freshUser = await fetchFreshUserData();
        if (onUserUpdate) {
          onUserUpdate(freshUser);
        }
      } catch (error) {
        console.log(`ℹ️ [${currentTime}] Auto-refresh failed (user may be logged out)`);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoRefresh);
  }, [dynamicUser, currentTime]);

  if (!dynamicUser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user data available</Text>
        <Text style={styles.subText}>Current time: {currentTime}</Text>
        <Text style={styles.subText}>Expected user: jhaaadarsh7</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Dynamic Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>🔴 LIVE • {currentTime}</Text>
        <Text style={styles.statusText}>👤 {dynamicUser.name || dynamicUser.email.split('@')[0]}</Text>
      </View>

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(dynamicUser.name || dynamicUser.email)}
            </Text>
          </View>
          <View style={[
            styles.statusDot,
            { backgroundColor: dynamicUser.status ? '#4CAF50' : '#FF5722' }
          ]} />
        </View>
        
        <Text style={styles.name}>
          {dynamicUser.name || dynamicUser.email.split('@')[0]}
        </Text>
        <Text style={styles.email}>{dynamicUser.email}</Text>
        <Text style={styles.userId}>ID: {dynamicUser.$id}</Text>
        
        {/* Dynamic Verification Badge */}
        <View style={[
          styles.verificationBadge,
          { backgroundColor: dynamicUser.emailVerification ? '#4CAF50' : '#FF9800' }
        ]}>
          <Text style={styles.verificationText}>
            {dynamicUser.emailVerification ? '✅ Verified' : '⚠️ Unverified'}
          </Text>
        </View>

        {/* Last Updated Info */}
        <Text style={styles.lastUpdated}>
          Last updated: {lastUpdated || 'Just now'}
        </Text>
      </View>

      {/* Profile Details */}
      <View style={styles.content}>
        
        {/* Dynamic Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.sectionContent}>
            {dynamicUser.prefs?.bio || `Travel enthusiast from ${dynamicUser.name || 'jhaaadarsh7'} 🌍📱`}
          </Text>
          {dynamicUser.prefs?.lastModified && (
            <Text style={styles.subText}>
              Last modified: {dynamicUser.prefs.lastModified} by {dynamicUser.prefs.modifiedBy || 'user'}
            </Text>
          )}
          <TouchableOpacity
            style={[styles.updateButton, updating && styles.updateButtonDisabled]}
            onPress={() => updatePreferences({
              bio: `Dynamic bio update from ${dynamicUser.name || dynamicUser.email.split('@')[0]} at ${currentTime} 🚀`
            })}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Bio (Live)</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.sectionContent}>
            {dynamicUser.prefs?.location || 'Location not set'}
          </Text>
          <TouchableOpacity
            style={[styles.updateButton, updating && styles.updateButtonDisabled]}
            onPress={() => updatePreferences({
              location: `Dynamic location: New York, USA - Updated at ${currentTime}`
            })}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Location (Live)</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Phone Section */}
        {dynamicUser.phone && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phone</Text>
            <Text style={styles.sectionContent}>{dynamicUser.phone}</Text>
            <Text style={styles.subText}>
              {dynamicUser.phoneVerification ? '✅ Verified' : '❌ Not Verified'}
            </Text>
          </View>
        )}

        {/* Dynamic Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member Since</Text>
          <Text style={styles.sectionContent}>
            {formatDate(dynamicUser.registration || dynamicUser.$createdAt)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>
          <Text style={[
            styles.sectionContent,
            { color: dynamicUser.status ? '#4CAF50' : '#FF5722' }
          ]}>
            {dynamicUser.status ? 'Active Account ✅' : 'Inactive Account ❌'}
          </Text>
          <Text style={styles.subText}>
            Status checked at: {currentTime}
          </Text>
        </View>

        {/* Dynamic Theme Preference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Theme</Text>
          <Text style={styles.sectionContent}>
            {dynamicUser.prefs?.theme || 'light'} mode 🎨
          </Text>
          <TouchableOpacity
            style={[styles.updateButton, updating && styles.updateButtonDisabled]}
            onPress={() => updatePreferences({
              theme: dynamicUser.prefs?.theme === 'light' ? 'dark' : 'light'
            })}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>
                Switch to {dynamicUser.prefs?.theme === 'light' ? 'Dark' : 'Light'} (Live)
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Session Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Session Info</Text>
          <Text style={styles.sectionContent}>
            Current Time: {currentTime}
          </Text>
          <Text style={styles.sectionContent}>
            Active User: {dynamicUser.name || dynamicUser.email.split('@')[0]}
          </Text>
          <Text style={styles.sectionContent}>
            Session ID: {dynamicUser.$id}
          </Text>
          <Text style={styles.sectionContent}>
            React Native • Expo Router • Appwrite (Live)
          </Text>
          <Text style={styles.subText}>
            Auto-refresh: Every 30 seconds
          </Text>
          <Text style={styles.subText}>
            Pull down to refresh manually
          </Text>
        </View>

        {/* Dynamic Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dynamic Stats</Text>
          <Text style={styles.sectionContent}>
            Profile views today: {Math.floor(Math.random() * 50) + 1}
          </Text>
          <Text style={styles.sectionContent}>
            Last login: {formatDate(dynamicUser.$updatedAt || dynamicUser.$createdAt)}
          </Text>
          <Text style={styles.sectionContent}>
            Data freshness: {refreshing ? 'Refreshing...' : 'Fresh'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statusBar: {
    backgroundColor: '#000',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff3333',
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  verificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 10,
  },
  verificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default UserComponent;
