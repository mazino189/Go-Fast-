import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../(tabs)/api'; // Import API URL

const BRAND_COLOR = '#00A86B';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập Email và Mật khẩu');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data));
        router.replace('../(tabs)/term-of-service');
      } else {
        Alert.alert('Đăng nhập thất bại', data.message || 'Thông tin không chính xác');
      }
    } catch (error) {
      Alert.alert('Lỗi kết nối', 'Không thể kết nối Server. Kiểm tra IP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={{alignItems: 'center', marginBottom: 40}}>
                <Ionicons name="car-sport" size={80} color="white" />
                <Text style={styles.title}>GoFast</Text>
            </View>
            
            <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight: 10}}/>
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
            </View>
            
            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={{marginRight: 10}}/>
                <TextInput style={styles.input} placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
            </TouchableOpacity>

            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
              <Text style={{color: 'white'}}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={{color: 'white', fontWeight: 'bold', textDecorationLine: 'underline'}}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_COLOR },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 40, fontWeight: 'bold', color: 'white', marginTop: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 15, borderRadius: 12, marginBottom: 15, height: 55 },
  input: { flex: 1, fontSize: 16 },
  button: { backgroundColor: '#00663D', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});