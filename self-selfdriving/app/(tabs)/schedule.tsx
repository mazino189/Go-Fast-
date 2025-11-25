import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../(tabs)/api';

const BRAND_COLOR = '#00A86B';

const ScheduleScreen = () => {
  const { carId, carName, pricePerDay } = useLocalSearchParams();
  
  // State cho Ngày Bắt đầu và Ngày Kết thúc
  const [startDate, setStartDate] = useState(new Date());
  // Mặc định ngày kết thúc là ngày mai (sau 24h)
  const [endDate, setEndDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  
  // Quản lý hiển thị Picker
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentField, setCurrentField] = useState<'start' | 'end'>('start');

  const [isScheduling, setIsScheduling] = useState(false);

  // === TÍNH TOÁN TỔNG TIỀN TỰ ĐỘNG ===
  const { totalCost, durationHours } = useMemo(() => {
    const diffMs = endDate.getTime() - startDate.getTime();
    // Làm tròn lên số giờ (ví dụ 1h15p tính là 2h)
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    // Giá mỗi giờ = Giá ngày / 24
    const pricePerHour = Number(pricePerDay) / 24;
    
    // Nếu giờ âm (chọn ngày trả trước ngày nhận) -> Tiền = 0
    const cost = hours > 0 ? hours * pricePerHour : 0;
    
    return { totalCost: cost, durationHours: hours };
  }, [startDate, endDate, pricePerDay]);

  // === XỬ LÝ CHỌN NGÀY GIỜ ===
  const showDateTimePicker = (field: 'start' | 'end', mode: 'date' | 'time') => {
    setCurrentField(field);
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onDateTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (!selectedDate) return;

    if (currentField === 'start') {
      // Nếu chọn ngày bắt đầu, cập nhật startDate
      // Nếu startDate lớn hơn endDate hiện tại, tự đẩy endDate lên
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
      }
    } else {
      // Nếu chọn ngày kết thúc
      if (selectedDate < startDate) {
        Alert.alert("Lỗi thời gian", "Giờ trả xe phải sau giờ nhận xe!");
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  // === XỬ LÝ ĐẶT XE ===
  const handlePreBooking = () => {
    if (durationHours <= 0) {
      Alert.alert("Lỗi", "Thời gian thuê không hợp lệ.");
      return;
    }

    Alert.alert(
      "Xác nhận thanh toán",
      `Xe: ${carName}\nThời gian: ${durationHours} giờ\nTổng tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCost)}`,
      [
        { text: "Tiền mặt", onPress: () => submitBooking('Tiền mặt') },
        { text: "Ví Momo", onPress: () => submitBooking('Momo') },
        { text: "Thẻ Visa", onPress: () => submitBooking('Visa') },
        { text: "Quay lại", style: "cancel" }
      ]
    );
  };

  // Gửi yêu cầu đặt xe lên server và xuất ra mã qr đặt xe
  // Đảm bảo bạn đã import API_URL ở trên cùng file
  // import { API_URL } from '../../constants/api'; 

  const submitBooking = async (paymentMethod: string) => {
    setIsScheduling(true);
    try {
      // 1. Lấy Token
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (!userInfoStr) {
        Alert.alert("Yêu cầu", "Vui lòng đăng nhập để đặt xe.");
        router.push('/(auth)/login');
        return;
      }
      const userInfo = JSON.parse(userInfoStr);

      // 2. Gọi API (Sử dụng biến API_URL)
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          carId: carId,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          paymentMethod: paymentMethod,
          totalCost: Math.round(totalCost)
        })
      });

      const data = await response.json();

      // 3. Xử lý kết quả
      if (response.ok) {
        // --- THÀNH CÔNG: Chuyển sang màn hình Mã QR (Success) ---
        router.replace({
            pathname: '../(tabs)/success',
            params: {
                bookingId: data._id,       // ID đơn hàng để tạo QR
                carName: carName,          // Tên xe
                totalCost: Math.round(totalCost), // Tổng tiền
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString()
            }
        });
      } else {
        Alert.alert("Thất bại", data.message || "Lỗi server");
      }

    } catch (error) {
      console.error("Lỗi đặt xe:", error);
      Alert.alert("Lỗi kết nối", "Không thể kết nối Server. Vui lòng kiểm tra lại mạng.");
    } finally {
      setIsScheduling(false);
    }
  };

  // === XỬ LÝ HỦY (THOÁT) ===
  const handleCancel = () => {
    Alert.alert(
        "Hủy đặt xe",
        "Bạn có chắc muốn hủy quá trình đặt xe này không?",
        [
            { text: "Không", style: "cancel" },
            { text: "Có, hủy ngay", style: "destructive", onPress: () => router.back() }
        ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Tùy Chọn Lịch Trình</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        {/* Thông tin xe */}
        <View style={styles.carInfoCard}>
          <Text style={styles.carName}>{carName}</Text>
          <Text style={styles.carPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(pricePerDay))}/ngày</Text>
        </View>

        {/* CHỌN NGÀY NHẬN */}
        <View style={styles.section}>
            <Text style={styles.label}>📅 Thời gian nhận xe:</Text>
            <View style={styles.row}>
                <TouchableOpacity style={styles.picker} onPress={() => showDateTimePicker('start', 'date')}>
                    <Text>{startDate.toLocaleDateString('vi-VN')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.picker} onPress={() => showDateTimePicker('start', 'time')}>
                    <Text>{startDate.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* CHỌN NGÀY TRẢ */}
        <View style={styles.section}>
            <Text style={styles.label}>🏁 Thời gian trả xe:</Text>
            <View style={styles.row}>
                <TouchableOpacity style={styles.picker} onPress={() => showDateTimePicker('end', 'date')}>
                    <Text>{endDate.toLocaleDateString('vi-VN')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.picker} onPress={() => showDateTimePicker('end', 'time')}>
                    <Text>{endDate.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* TỔNG KẾT */}
        <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
                <Text>Thời gian thuê:</Text>
                <Text style={{fontWeight: 'bold'}}>{durationHours} giờ</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Tạm tính:</Text>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: BRAND_COLOR}}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCost)}
                </Text>
            </View>
            <Text style={styles.policyText}>✅ Miễn phí hủy đơn bất cứ lúc nào trước khi nhận xe.</Text>
        </View>

        {/* DateTimePicker Component (Ẩn/Hiện) */}
        {showPicker && (
          <DateTimePicker
            value={currentField === 'start' ? startDate : endDate}
            mode={pickerMode}
            display="default"
            onChange={onDateTimeChange}
            minimumDate={new Date()}
          />
        )}
      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={[styles.confirmButton, isScheduling && {opacity: 0.7}]} 
            onPress={handlePreBooking}
            disabled={isScheduling}
        >
            {isScheduling ? <ActivityIndicator color="white"/> : <Text style={styles.confirmButtonText}>Đặt Xe Ngay</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: 'white', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  
  carInfoCard: { marginBottom: 20, alignItems: 'center' },
  carName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  carPrice: { fontSize: 16, color: BRAND_COLOR, fontWeight: '600' },

  section: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#555' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  picker: { flex: 0.48, backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },

  summaryCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, elevation: 2, marginBottom: 100 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  policyText: { fontSize: 12, color: 'green', marginTop: 10, fontStyle: 'italic', textAlign: 'center' },

  footer: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', padding: 15, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee' },
  cancelButton: { flex: 1, backgroundColor: '#F3F4F6', padding: 15, borderRadius: 10, alignItems: 'center', marginRight: 10 },
  cancelButtonText: { color: '#333', fontWeight: 'bold' },
  confirmButton: { flex: 2, backgroundColor: BRAND_COLOR, padding: 15, borderRadius: 10, alignItems: 'center' },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});