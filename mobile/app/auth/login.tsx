import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/AuthContext';

export default function LoginScreen() {
  const [username, setUsernme] = useState('Yunuseakkaya');
  const [password, setPassword] = useState('Yunus1emre!');
  const { login, isLoading } = useAuth();
  const [isloding, setisloding] = useState(false)
  const [Error, setError] = useState("")
  const router = useRouter();   
  const handleLogin = async () => {
    try {
      setisloding(true)
      await login(username, password);
    } catch (error:any) {
      Alert.alert('Login Failed', error.error);
      setError(error.error)
    }finally{
      setisloding(false)
    }
  };
  if (isloding) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Login</Text>
      
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }}
        placeholder="Username"
        value={username}
        onChangeText={setUsernme}
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
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isLoading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 5,margin:10 }}
        onPress={() =>
            router.push({ pathname: '/auth/register' as any})
          }
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Register
        </Text>
      </TouchableOpacity>

      {/* Test bilgileri */}
      <Text style={{ marginTop: 20, color: 'gray', textAlign: 'center' }}>
        Test kullanıcısı: test@test.com / 123456
      </Text>
      {Error ? <Text style={styles.error}>{Error}</Text> : null}
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