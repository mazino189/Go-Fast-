import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { API_URL } from '../(tabs)/api'; // Import API URL

const BRAND_COLOR = '#00A86B';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'PROMOTION' | 'ORDER';
  createdAt: string;
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Tự động tải lại khi vào màn hình
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (!userInfoStr) { setLoading(false); return; }
      const userInfo = JSON.parse(userInfoStr);

      const response = await fetch(`${API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Hàm chọn icon và màu sắc dựa trên loại thông báo
  const getIconInfo = (type: string) => {
    switch (type) {
      case 'ORDER': return { icon: 'checkmark-circle', color: '#00A86B' };
      case 'PROMOTION': return { icon: 'pricetag', color: '#FF4500' };
      case 'SYSTEM': default: return { icon: 'information-circle', color: '#3B82F6' };
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const { icon, color } = getIconInfo(item.type);
    
    // Format thời gian (Ví dụ: 10:30 - 25/11)
    const date = new Date(item.createdAt);
    const timeString = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} - ${date.getDate()}/${date.getMonth() + 1}`;

    return (
      <View style={styles.notificationCard}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}> 
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <View style={styles.notificationDetails}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationDate}>{timeString}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={BRAND_COLOR} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 15 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchNotifications()}} />}
          ListEmptyComponent={
            <View style={styles.empty}>
                <Ionicons name="notifications-off-outline" size={50} color="#ccc" />
                <Text style={styles.noNewText}>Không có thông báo mới nào.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  notificationCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  iconContainer: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  notificationDetails: { flex: 1 },
  notificationTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  notificationMessage: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  notificationDate: { fontSize: 12, color: '#9CA3AF', marginTop: 6, textAlign: 'right' },
  empty: { alignItems: 'center', marginTop: 100 },
  noNewText: { textAlign: 'center', marginTop: 10, color: '#9CA3AF' }
});