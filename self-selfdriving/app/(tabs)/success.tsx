// app/homescreen/success.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

const BRAND_COLOR = '#00A86B';

export default function SuccessScreen() {
  // Nhận dữ liệu từ màn hình đặt lịch
  const { bookingId, carName, totalCost, startTime, endTime } = useLocalSearchParams();

  // Dữ liệu để mã hóa vào QR (Ví dụ: ID đơn hàng)
  const qrValue = JSON.stringify({
    id: bookingId,
    car: carName,
    cost: totalCost
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color={BRAND_COLOR} />
        </View>

        <Text style={styles.title}>Đặt xe thành công!</Text>
        <Text style={styles.subtitle}>Cảm ơn bạn đã sử dụng dịch vụ của GoFast.</Text>

        {/* THẺ VÉ ĐIỆN TỬ (QR CODE) */}
        <View style={styles.ticketCard}>
          <Text style={styles.ticketTitle}>VÉ ĐIỆN TỬ</Text>
          <View style={styles.dashedLine} />
          
          <View style={styles.row}>
            <Text style={styles.label}>Xe:</Text>
            <Text style={styles.value}>{carName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tổng tiền:</Text>
            <Text style={[styles.value, {color: BRAND_COLOR}]}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(totalCost))}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nhận xe:</Text>
            <Text style={styles.value}>{new Date(startTime as string).toLocaleDateString('vi-VN')}</Text>
          </View>

          <View style={styles.qrContainer}>
            <QRCode value={qrValue} size={150} />
          </View>
          <Text style={styles.qrNote}>Đưa mã này cho nhân viên khi nhận xe</Text>
        </View>

        {/* NÚT ĐIỀU HƯỚNG */}
        <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => router.replace('/homescreen/home')}
        >
            <Text style={styles.buttonText}>Về Trang Chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.historyButton} 
            onPress={() => router.replace('../(tabs)/history')}
        >
            <Text style={[styles.buttonText, {color: '#555'}]}>Xem Lịch Sử</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, alignItems: 'center' },
  iconContainer: { marginBottom: 20, marginTop: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 30 },
  
  ticketCard: { backgroundColor: 'white', width: '100%', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, marginBottom: 30 },
  ticketTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  dashedLine: { width: '100%', height: 1, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  label: { color: '#666' },
  value: { fontWeight: 'bold', color: '#333' },
  
  qrContainer: { marginTop: 20, padding: 10, backgroundColor: 'white', borderRadius: 10 },
  qrNote: { fontSize: 12, color: '#999', marginTop: 10 },

  homeButton: { backgroundColor: BRAND_COLOR, width: '100%', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  historyButton: { backgroundColor: '#E5E7EB', width: '100%', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});