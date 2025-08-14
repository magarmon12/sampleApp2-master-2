// app/loginPage.tsx
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
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
import { ValidIndicator } from '@/components/ui/ValidIndicator';
import { account } from '@/lib/appwrite';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    if (!validEmail || !validPassword) return;
    setBusy(true);
    try {
      await account.createEmailPasswordSession(email.trim(), password);
      router.replace('/homeScreen');
    } catch (err: any) {
      const code = err?.code ?? err?.response?.code;
      const msg =
        code === 401
          ? 'Incorrect email or password.'
          : err?.message ?? 'Login failed';
      if (Platform.OS === 'web') window.alert(`Sign in failed: ${msg}`);
      else Alert.alert('Sign in failed', msg);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    setValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
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
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!busy}
            />

            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <ValidIndicator valid={validPassword} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Minimum 8 characters"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!busy}
            />

            <Pressable
              style={[styles.button, (!validEmail || !validPassword || busy) && styles.buttonDisabled]}
              disabled={!validEmail || !validPassword || busy}
              onPress={onLogin}
            >
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
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
  safeArea: { flex: 1, backgroundColor: '#f2f2f7' },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
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
  title: { fontSize: 32, fontWeight: '700', color: '#333333', marginBottom: 32, textAlign: 'center' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 18, color: '#333333' },
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
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 18, color: '#ffffff', fontWeight: '700' },
  link: { marginTop: 20, textAlign: 'center', color: '#0066FF', fontSize: 16 },
});