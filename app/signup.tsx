// app/signup.tsx
import { ValidIndicator } from '@/components/ui/ValidIndicator';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';
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
} from 'react-native';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate email and password
  useEffect(() => {
    setValidEmail(email.includes('@'));
  }, [email]);

  useEffect(() => {
    setValidPassword(password.length >= 8);
  }, [password]);

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      await account.create(ID.unique(), email, password);
      // Ensure no existing session
      await account.deleteSession('current');
      alert('Account created! Please log in.');
      router.replace('/loginPage');
    } catch (error: any) {
      alert('Sign up failed: ' + error.message);
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

            <View style={styles.labelRow}>
              <Text style={styles.label}>Email</Text>
              <ValidIndicator valid={validEmail} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
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
            />

            <Pressable
              style={[
                styles.button,
                !(validEmail && validPassword) && styles.buttonDisabled,
              ]}
              disabled={!(validEmail && validPassword) || isLoading}
              onPress={handleSignUp}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Text>
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
    marginBottom: 32,
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
    marginTop: 12,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#0066FF',
    fontSize: 16,
  },
});