import { ValidIndicator } from '@/components/ui/ValidIndicator';
import { useUser } from '@/hooks/userContext'; 
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useUser();

  // Validate email and password
  useEffect(() => {
    setValidEmail(email.includes('@') && email.length > 3);
  }, [email]);

  useEffect(() => {
    setValidPassword(password.length >= 8);
  }, [password]);

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      
      await register(email, password);
      
     
      Alert.alert(
        'Success! 🎉', 
        'Account created and logged in successfully!',
        [{ text: 'Continue', onPress: () => router.replace('/(tabs)/Profile') }]
      );
      
    } catch (error: any) {
      console.error(' [2025-08-10 14:37:50] Registration failed:', error.message);
      Alert.alert('Sign Up Failed', error.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join as</Text>
            <Text style={styles.timestamp}>2025-08-10 14:37:50 UTC</Text>

            <View style={styles.labelRow}>
              <Text style={styles.label}>Email</Text>
              <ValidIndicator valid={validEmail} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
              editable={!isLoading}
            />

            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <ValidIndicator valid={validPassword} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Minimum 8 characters"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              editable={!isLoading}
            />

            <Pressable
              style={[
                styles.button,
                (!(validEmail && validPassword) || isLoading) && styles.buttonDisabled,
              ]}
              disabled={!(validEmail && validPassword) || isLoading}
              onPress={handleSignUp}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </Pressable>

           

            <Pressable onPress={() => router.push('/loginPage')}>
              <Text style={styles.link}>Already have an account? Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    color: '#333333',
  },
  input: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 54,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  testSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#0066FF',
    fontSize: 16,
  },
});