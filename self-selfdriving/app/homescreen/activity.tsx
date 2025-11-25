// app/(tabs)/activity.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { API_URL } from '../(tabs)/api';

const BRAND_COLOR = '#00A86B';

export default function ActivityScreen() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchActiveBookings();
    }, [])
  );

  const fetchActiveBookings = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (!userInfoStr) { setLoading(false); return; }
      const userInfo = JSON.parse(userInfoStr);
      
      const response = await fetch(`${API_URL}/bookings/mybookings`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      const data = await response.json();
      
      // Lọc chỉ lấy các đơn "Scheduled" hoặc "Active"
      const active = data.filter((b: any) => b.status === 'Scheduled' || b.status === 'Active');
      setActiveBookings(active);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({
            pathname: '/homescreen/activity',
            params: { bookingId: item._id }
        })}
    >
      <View style={styles.row}>
        <Image source={{ uri: item.car?.imageUri }} style={styles.carImage} />
        <View style={styles.info}>
          <Text style={styles.statusText}>● {item.status === 'Scheduled' ? 'Sắp diễn ra' : 'Đang chạy'}</Text>
          <Text style={styles.carName}>{item.car?.name}</Text>
          <Text style={styles.date}>Nhận xe: {new Date(item.startTime).toLocaleDateString('vi-VN')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoạt động</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={BRAND_COLOR} style={{marginTop: 50}} />
      ) : (
        <FlatList 
            data={activeBookings} 
            renderItem={renderItem} 
            keyExtractor={item => item._id}
            contentContainerStyle={{padding: 15}}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchActiveBookings()}} />}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Text style={{color: 'gray'}}>Không có chuyến đi nào sắp tới.</Text>
                </View>
            }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  carImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#eee' },
  info: { flex: 1 },
  statusText: { color: BRAND_COLOR, fontWeight: 'bold', fontSize: 12, marginBottom: 2 },
  carName: { fontWeight: 'bold', fontSize: 16 },
  date: { color: 'gray', fontSize: 12 },
  empty: { alignItems: 'center', marginTop: 100 }
});