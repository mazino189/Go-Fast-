// app/homescreen/profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BRAND_COLOR = '#00A86B';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userInfoStr = await AsyncStorage.getItem('userInfo');
    if (userInfoStr) {
      const user = JSON.parse(userInfoStr);
      setName(user.name);
      setEmail(user.email);
    }
  };

  const handleUpdate = () => {
    // Ở đây bạn có thể gọi API PUT /api/users/profile để cập nhật tên
    Alert.alert("Thông báo", "Tính năng cập nhật đang được phát triển!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin cá nhân</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color="white" />
        </View>

        <Text style={styles.label}>Họ và Tên</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email (Không thể đổi)</Text>
        <TextInput style={[styles.input, {backgroundColor: '#eee'}]} value={email} editable={false} />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: BRAND_COLOR, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  label: { fontWeight: 'bold', marginBottom: 5, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: BRAND_COLOR, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});