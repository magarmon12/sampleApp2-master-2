// app/loginPage.tsx
import { ValidIndicator } from '@/components/ui/ValidIndicator';
import { AuthContext } from '@/contexts/AuthContext';
import type { Models } from 'appwrite';
import { Account } from 'appwrite';
import { router } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [auth, setAuth] = useState<Models.Session | null>(null);

  const user = useContext(AuthContext) as Account;

  const login = async () => {
    try {
      const session = await user.createEmailPasswordSession(email, password);
      setAuth(session);
    } catch (error) {
      if (error instanceof Error) {
        alert('Sign in failed: ' + error.message);
      }
    }
  };

  useEffect(() => {
    if (auth) {
      router.replace('/homeScreen');
    }
  }, [auth]);

  useEffect(() => {
    setValidEmail(email.includes('@'));
  }, [email]);

  useEffect(() => {
    setValidPassword(password.length >= 8);
  }, [password]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Sign In</Text>

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
              disabled={!(validEmail && validPassword)}
              onPress={login}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/signup')}>  
              <Text style={styles.link}>Don’t have an account? Sign Up</Text>
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