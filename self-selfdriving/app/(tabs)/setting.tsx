// app/homescreen/settings.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.title}>Cài đặt ứng dụng</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
            <Text style={styles.label}>Thông báo</Text>
            <Switch value={notifEnabled} onValueChange={setNotifEnabled} trackColor={{false: "#767577", true: "#00A86B"}}/>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Dịch vụ định vị</Text>
            <Switch value={locationEnabled} onValueChange={setLocationEnabled} trackColor={{false: "#767577", true: "#00A86B"}}/>
        </View>
        
        {/* Đổi mật khẩu */}
        <TouchableOpacity 
            style={styles.linkRow}
            onPress={() => router.push('../(tabs)/change-password')}
        >
            <Text style={styles.linkText}>Đổi mật khẩu</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        {/* Điều khoản sử dụng */}
        <TouchableOpacity 
            style={styles.linkRow}
            onPress={() => router.push('../(tabs)/term-of-service')}
        >
            <Text style={styles.linkText}>Điều khoản sử dụng</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  label: { fontSize: 16 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, marginTop: 10 },
  linkText: { fontSize: 16, color: '#333' }
});