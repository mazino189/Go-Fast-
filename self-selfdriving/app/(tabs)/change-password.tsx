// app/homescreen/change-password.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BRAND_COLOR = '#00A86B';

export default function ChangePasswordScreen() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = () => {
    if (!oldPass || !newPass || !confirmPass) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp");
      return;
    }

    setLoading(true);
    // Giả lập gọi API đổi mật khẩu
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Thành công", "Đổi mật khẩu thành công!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.title}>Đổi Mật Khẩu</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Mật khẩu hiện tại</Text>
        <TextInput style={styles.input} secureTextEntry value={oldPass} onChangeText={setOldPass} />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput style={styles.input} secureTextEntry value={newPass} onChangeText={setNewPass} />

        <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
        <TextInput style={styles.input} secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Cập nhật</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: 'white', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#555' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  button: { backgroundColor: BRAND_COLOR, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});