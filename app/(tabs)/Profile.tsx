import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useUser } from '../../hooks/userContext';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';


export default function Profile() {
  const { current: user, loading, logout, refresh } = useUser();

  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
           
              refresh();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    // Add your change password logic here
    console.log('Change password pressed');
  };

  const handleSignIn = () => {
    console.log(' Navigating to login page...');
    router.push('/loginPage');
  };

  const handleSignUp = () => {
    console.log(' Navigating to signup page...');
    router.push('/signup');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Profile Icon for logged out state */}
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.loggedOutAvatar]}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          </View>

          {/* Message */}
          <Text style={styles.loggedOutMessage}>Sign in to access your profile</Text>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleSignUp}>
              <Text style={styles.actionButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Sign Out */}
      <View style={styles.header}>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
  <Feather name="log-out" size={20} color="#333" style={{ marginRight: 8 }} />
  <Text style={styles.signOutText}>Sign Out</Text>
</TouchableOpacity>

      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(user.name, user.email)}
            </Text>
          </View>
        </View>

        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Contact us pressed')}>
            <Text style={styles.actionButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3333',
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  signOutText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8AC5C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    marginBottom: 80,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 280,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  loggedOutAvatar: {
    backgroundColor: '#ddd',
  },
  loggedOutMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 80,
  },
  
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});