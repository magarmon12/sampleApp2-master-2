/*import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useState, useEffect, useContext } from 'react'
import { ValidIndicator } from '@/components/ui/ValidIndicator'
import { router } from 'expo-router'
import { AuthContext } from '@/contexts/AuthContext'
import { ID } from 'react-native-appwrite'

export default function SignUp(props: any) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [auth, setAuth] = useState<null | any>(null)

    const user = useContext(AuthContext)

    const register = async () => {
        try {
            await user.create(ID.unique(), email, password)
            const session = await user.createEmailPasswordSession(email, password)
            setAuth(session)
        } catch (error: any) {
            alert("Sign up failed: " + error.message)
        }
    }

    useEffect(() => {
        if (auth) {
            router.navigate("/loginPage") // Or "/(tabs)" if you prefer
        }
    }, [auth])

    useEffect(() => {
        setValidEmail(email.includes('@'))
    }, [email])

    useEffect(() => {
        setValidPassword(password.length >= 8)
    }, [password])

    return (
        <ThemedView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Sign Up</Text> {// ✅ Corrected here }
                
                <View style={styles.label}>
                    <ThemedText>Email</ThemedText>
                    <ValidIndicator valid={validEmail} />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    value={email}
                    onChangeText={setEmail}
                />

                <View style={styles.label}>
                    <ThemedText>Password</ThemedText>
                    <ValidIndicator valid={validPassword} />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="minimum 8 characters"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Pressable
                    style={(validEmail && validPassword) ? styles.button : styles.buttondisabled}
                    disabled={!(validEmail && validPassword)}
                    onPress={register}
                >
                    <ThemedText
                        style={(validEmail && validPassword) ? styles.buttonText : styles.buttonTextDisabled}
                    >
                        Sign Up
                    </ThemedText>
                </Pressable>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        marginHorizontal: 50,
        padding: 15,
        marginTop: 100,
    },
    title: {
        fontSize: 32,
        textAlign: "center",
        marginBottom: 20,
    },
    label: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    input: {
        backgroundColor: "#dfe7f5",
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
    buttondisabled: {
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
    },
    buttonText: {
        textAlign: "center",
        color: "#fff",
        fontWeight: 'bold'
    },
    buttonTextDisabled: {
        textAlign: "center",
        color: "#666"
    },
})
*/


// app/index.tsx

// app/index.tsx

// app/index.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const go = () => router.replace('/(tabs)/homeScreen');
    if (Platform.OS === 'web') {
      window.requestAnimationFrame(go);
    } else {
      const t = setTimeout(go, 100);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}