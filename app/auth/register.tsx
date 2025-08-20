import { BASE_URL } from "@env";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/AuthContext';
export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState('');
  const { isLoading } = useAuth();
  const router = useRouter();   
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleRegister = () => {
    setIsLoading(true);
    setError(""); // önceki hatayı sıfırla

    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          // sunucudan hata mesajı varsa onu yakala
          const data = await res.json().catch(() => ({}));
          console.log(data.error||data.message)
          throw new Error(data.error||data.message || "Kayıt başarısız oldu");
        }
        return res.json();
      })
      .then(() => {
        router.push("./login");
      })
      .catch((err) => {
        setError(err.error||err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  if (isloading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Register</Text>
      
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 5 }}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isLoading ? 'Loading...' : 'Register'}
        </Text>
      </TouchableOpacity>

      {/* Test bilgileri */}
      <Text style={{ marginTop: 20, color: 'gray', textAlign: 'center' }}>
        Test kullanıcısı: test@test.com / 123456
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({

loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: { marginTop: 10, color: "red", fontSize: 16 },
})