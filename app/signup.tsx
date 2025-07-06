import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect, useContext } from 'react';
import { ValidIndicator } from '@/components/ui/ValidIndicator';
import { router } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import { ID } from 'react-native-appwrite';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [auth, setAuth] = useState(null);

  const user = useContext(AuthContext);

  const register = async () => {
    try {
      await user.create(ID.unique(), email, password);
      const session = await user.createEmailPasswordSession(email, password);
      setAuth(session);
    } catch (error) {
      if (error instanceof Error) {
        alert('Sign up failed: ' + error.message);
      }
    }
  };

  useEffect(() => {
    if (auth) {
      router.replace('/(tabs)');
    }
  }, [auth]);

  useEffect(() => {
    setValidEmail(email.includes('@'));
  }, [email]);

  useEffect(() => {
    setValidPassword(password.length >= 8);
  }, [password]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.label}>
          <ThemedText>Email</ThemedText>
          <ValidIndicator valid={validEmail} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          onChangeText={setEmail}
          value={email}
        />

        <View style={styles.label}>
          <ThemedText>Password</ThemedText>
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
          style={(validEmail && validPassword) ? styles.button : styles.buttonDisabled}
          disabled={!(validEmail && validPassword)}
          onPress={register}
        >
          <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
        </Pressable>

        <Pressable onPress={() => router.push('/loginPage')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: {
    marginHorizontal: 50,
    padding: 15,
    marginTop: 100,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#dfe7f5',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#4CAF50',
  },
});
