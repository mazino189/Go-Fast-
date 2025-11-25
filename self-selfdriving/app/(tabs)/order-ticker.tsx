import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../(tabs)/api'; // Import API URL

// IMPORT HOOK
import { useCancelBooking } from '../../hooks/useCancelBooking';

const BRAND_COLOR = '#00A86B';

export default function OrderTicketScreen() {
  const { bookingId } = useLocalSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // SỬ DỤNG HOOK
  const { cancelBooking, isCancelling } = useCancelBooking();

  useEffect(() => {
    if (bookingId) fetchBookingDetail();
  }, [bookingId]);

  const fetchBookingDetail = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (!userInfoStr) return;
      const userInfo = JSON.parse(userInfoStr);

      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      
      const data = await response.json();
      if (response.ok) {
        setBooking(data);
      } else {
        Alert.alert("Lỗi", "Không tải được vé");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi bấm nút Hủy
  const onCancelPress = () => {
    cancelBooking(bookingId as string, () => {
        fetchBookingDetail(); // Reload lại trang sau khi hủy thành công
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
        <Text style={{marginTop: 10}}>Đang tải vé...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centerContainer}>
        <Text>Không tìm thấy thông tin đơn hàng.</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={{color: 'blue', marginTop: 10}}>Quay lại</Text></TouchableOpacity>
      </View>
    );
  }

  const qrData = JSON.stringify({
    id: booking._id,
    user: booking.user?.email,
    car: booking.car?.licensePlate,
    status: booking.status
  });

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Scheduled': return '#FF9900';
        case 'Active': return '#3B82F6';
        case 'Completed': return '#10B981';
        case 'Cancelled': return '#EF4444';
        default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
        case 'Scheduled': return 'SẮP DIỄN RA';
        case 'Active': return 'ĐANG HOẠT ĐỘNG';
        case 'Completed': return 'HOÀN THÀNH';
        case 'Cancelled': return 'ĐÃ HỦY';
        default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vé Điện Tử</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.ticketCard}>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                    {getStatusText(booking.status)}
                </Text>
            </View>

            <Text style={styles.ticketHeader}>MÃ XÁC NHẬN</Text>
            
            <View style={[styles.qrContainer, {opacity: booking.status === 'Cancelled' ? 0.3 : 1}]}>
                <QRCode value={qrData} size={180} />
            </View>
            
            <Text style={[styles.code, {textDecorationLine: booking.status === 'Cancelled' ? 'line-through' : 'none'}]}>
                {booking._id.slice(-8).toUpperCase()}
            </Text>
            
            <View style={styles.dashedLine} />

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>KHÁCH HÀNG</Text>
                <Text style={styles.value}>{booking.user?.name}</Text>
                <Text style={styles.subValue}>{booking.user?.email}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>XE THUÊ</Text>
                <View style={styles.carRow}>
                    <Image source={{ uri: booking.car?.imageUri }} style={styles.carImage} contentFit="cover" />
                    <View>
                        <Text style={styles.carName}>{booking.car?.name}</Text>
                        <Text style={styles.plate}>{booking.car?.licensePlate}</Text>
                    </View>
                </View>
            </View>

            {/* NÚT HỦY ĐƠN (Sử dụng Hook) */}
            {booking.status === 'Scheduled' && (
                <>
                    <View style={styles.dashedLine} />
                    <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={onCancelPress}
                        disabled={isCancelling}
                    >
                        {isCancelling ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="trash-outline" size={20} color="white" />
                                <Text style={styles.cancelButtonText}>Hủy Đơn Hàng</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </>
            )}
        </View>
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00A86B' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  backButton: { backgroundColor: 'white', padding: 5, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  content: { padding: 20 },
  ticketCard: { backgroundColor: 'white', borderRadius: 20, paddingBottom: 20, alignItems: 'center' },
  statusBadge: { marginTop: 20, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontWeight: 'bold', fontSize: 14 },
  ticketHeader: { textAlign: 'center', fontWeight: 'bold', color: '#666', marginTop: 15, letterSpacing: 1 },
  qrContainer: { alignItems: 'center', marginVertical: 20 },
  code: { textAlign: 'center', fontSize: 24, fontWeight: 'bold', letterSpacing: 4 },
  dashedLine: { width: '90%', height: 1, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', marginVertical: 15 },
  infoSection: { width: '100%', paddingHorizontal: 20, marginBottom: 15, alignItems: 'flex-start' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 5 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subValue: { fontSize: 14, color: '#666' },
  carRow: { flexDirection: 'row', alignItems: 'center' },
  carImage: { width: 70, height: 50, borderRadius: 8, marginRight: 15, backgroundColor: '#eee' },
  carName: { fontWeight: 'bold', fontSize: 16 },
  plate: { fontSize: 13, color: '#555', backgroundColor: '#f0f0f0', alignSelf: 'flex-start', paddingHorizontal: 5, borderRadius: 4, marginTop: 4 },
  cancelButton: { flexDirection: 'row', backgroundColor: '#EF4444', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', marginTop: 10, width: '90%', justifyContent: 'center' },
  cancelButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }
});