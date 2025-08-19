import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();   
  const [loading, setisloading] = useState(false)
  const handleRegister = ()=> {
    setisloading(true)
    fetch('https://httpsflaskexample-frei2y7aaa-uc.a.run.app/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username:username,
        password:password,
      })
    })
    .then(()=>{
        setisloading(false)
        router.push({ pathname: './login' as any})
    })
    .catch(err => console.error(err));
  };
  if (loading) {
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
          {isLoading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* Test bilgileri */}
      <Text style={{ marginTop: 20, color: 'gray', textAlign: 'center' }}>
        Test kullanıcısı: test@test.com / 123456
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})