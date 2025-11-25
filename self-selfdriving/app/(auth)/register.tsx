// app/(auth)/register.tsx
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, 
  ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BRAND_COLOR = '#00A86B';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // 1. Ẩn bàn phím
    Keyboard.dismiss();

    // 2. Kiểm tra nhập liệu
    if (!name || !email || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Tên, Email và Mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      // 3. GỌI API ĐĂNG KÝ
      const response = await fetch('http://192.168.88.137:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email.toLowerCase().trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Đăng ký thành công
        Alert.alert(
          'Đăng ký thành công! 🎉', 
          `Tài khoản ${email} đã được tạo. Vui lòng đăng nhập.`,
          [
            { text: 'OK', onPress: () => router.back() } // Quay về màn hình Login
          ]
        );
      } else {
        // Lỗi từ Backend (ví dụ: Email đã tồn tại)
        Alert.alert('Đăng ký thất bại', data.message || 'Có lỗi xảy ra.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối Server. Kiểm tra lại Wifi/IP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            
            {/* Header */}
            <View style={styles.headerContainer}>
              <Ionicons name="person-add-outline" size={60} color="white" />
              <Text style={styles.title}>Tạo Tài Khoản</Text>
              <Text style={styles.subtitle}>Trở thành thành viên của GoFast</Text>
            </View>
            
            {/* Form */}
            <View style={styles.formContainer}>
              
              <Text style={styles.label}>Họ và Tên</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Ví dụ: Nguyễn Văn A" value={name} onChangeText={setName} />
              </View>

              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="email@domain.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
              </View>
              
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Tạo mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Đăng Ký Ngay</Text>}
              </TouchableOpacity>
            </View>

            {/* Nút quay lại */}
            <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
              <Text style={styles.loginText}>Đã có tài khoản? <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Đăng nhập</Text></Text>
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_COLOR },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginTop: 10 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 5 },
  formContainer: { backgroundColor: 'white', padding: 24, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  label: { color: '#333', marginBottom: 8, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, marginBottom: 16, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#333' },
  button: { backgroundColor: BRAND_COLOR, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginText: { color: 'white', fontSize: 15 },
});