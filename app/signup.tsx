// app/signup.tsx
import { ValidIndicator } from '@/components/ui/ValidIndicator';
import { account } from '@/lib/appwrite';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';

async function ensureSignedOut() {
  try { await account.deleteSession('current'); } catch {}
}

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); }, [email]);
  useEffect(() => { setValidPassword(password.length >= 8); }, [password]);

  const handleSignUp = async () => {
    if (!validEmail || !validPassword || isLoading) return;
    setIsLoading(true);

    const em = email.trim().toLowerCase();
    const pw = password;
    const nm = name.trim() || undefined;

    try {
      // Make sure no previous session is active
      await ensureSignedOut();

      // Create the user ONLY — no session creation here
      await account.create('unique()', em, pw, nm);

      Alert.alert(
        'Account created',
        'Your account was created successfully. Please sign in.',
        [{ text: 'Go to Sign In', onPress: () => router.replace('/loginPage') }]
      );
    } catch (err: any) {
      if (err?.code === 409) {
        // User already exists: send them to Login
        Alert.alert(
          'Account already exists',
          'Please sign in with your email and password.',
          [{ text: 'Go to Sign In', onPress: () => router.replace('/loginPage') }]
        );
      } else {
        Alert.alert('Sign Up Failed', err?.message ?? 'Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.label}>Name (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />

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
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            <Pressable
              style={[styles.button, (!(validEmail && validPassword) || isLoading) && styles.buttonDisabled]}
              disabled={!(validEmail && validPassword) || isLoading}
              onPress={handleSignUp}
            >
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
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
  safeArea: { flex: 1, backgroundColor: '#f2f2f7' },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: {
    width: '100%', maxWidth: 450, backgroundColor: '#fff', borderRadius: 12, padding: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  title: { fontSize: 32, fontWeight: '700', color: '#333', marginBottom: 16, textAlign: 'center' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 18, color: '#333' },
  input: {
    width: '100%', backgroundColor: '#f9f9f9', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 20,
    fontSize: 18, marginBottom: 20, borderWidth: 1, borderColor: '#e5e5e5',
  },
  button: {
    backgroundColor: '#0066FF', borderRadius: 8, paddingVertical: 18, alignItems: 'center', justifyContent: 'center',
    marginTop: 12, shadowColor: '#0066FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4,
    elevation: 2, minHeight: 54,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 18, color: '#fff', fontWeight: '700' },
  link: { marginTop: 20, textAlign: 'center', color: '#0066FF', fontSize: 16 },
});