import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BRAND_COLOR = '#00A86B';

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap; 
}

const AccountScreen = () => {
  const [userInfo, setUserInfo] = useState({ name: 'Khách', email: 'Chưa đăng nhập' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userInfo');
        if (jsonValue != null) {
          const user = JSON.parse(jsonValue);
          setUserInfo(user);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getUserInfo();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đồng ý", style: "destructive",
          onPress: async () => {
            setLoading(true);
            await AsyncStorage.removeItem('userInfo');
            router.replace('/(auth)/login'); 
            setLoading(false);
          }
        }
    ]);
  };

  const menuItems: MenuItem[] = [
    { id: '1', title: 'Thông tin cá nhân', icon: 'person-outline' },
    { id: '2', title: 'Phương thức thanh toán', icon: 'card-outline' },
    { id: '3', title: 'Lịch sử giao dịch', icon: 'receipt-outline' },
    { id: '4', title: 'Cài đặt ứng dụng', icon: 'settings-outline' },
    { id: '5', title: 'Trợ giúp & Hỗ trợ', icon: 'help-circle-outline' },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity 
        key={item.id} 
        style={styles.menuItem}
        onPress={() => {
            switch (item.id) {
                case '1': router.push('../(tabs)/profile'); break;
                case '2': router.push('../(tabs)/payment'); break;
                case '3': router.push('../(tabs)/history'); break; // <--- Link tới History
                case '4': router.push('../(tabs)/setting'); break;
                case '5': router.push('../(tabs)/help'); break;
            }
        }}
    >
      <Ionicons name={item.icon} size={24} color={BRAND_COLOR} />
      <Text style={styles.menuTitle}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.userInfoCard}>
          <View style={styles.avatarContainer}><Ionicons name="person" size={40} color="white" /></View>
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
          </View>
        </View>
        <View style={styles.menuContainer}>{menuItems.map(renderMenuItem)}</View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.logoutText}>Đăng xuất</Text>}
        </TouchableOpacity>
        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  content: { padding: 15 },
  userInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3 },
  avatarContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: BRAND_COLOR, justifyContent: 'center', alignItems: 'center' },
  userInfoText: { marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  userEmail: { fontSize: 14, color: 'gray' },
  menuContainer: { backgroundColor: 'white', borderRadius: 12, elevation: 3, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  menuTitle: { flex: 1, marginLeft: 15, fontSize: 16 },
  logoutButton: { backgroundColor: '#EF4444', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  versionText: { textAlign: 'center', color: 'gray', marginTop: 20 }
});