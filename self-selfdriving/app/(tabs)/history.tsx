import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, Image, 
  TouchableOpacity, RefreshControl, Modal, ScrollView, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router'; 
import QRCode from 'react-native-qrcode-svg'; // Nhớ đã cài thư viện này
import { API_URL } from './api'; // Import API cùng thư mục (tabs)

const BRAND_COLOR = '#00A86B';

export default function HistoryScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- STATE CHO MODAL VÉ ĐIỆN TỬ ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  // 1. Lấy danh sách lịch sử
  const fetchHistory = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (!userInfoStr) { setLoading(false); return; }
      const userInfo = JSON.parse(userInfoStr);
      
      const response = await fetch(`${API_URL}/bookings/mybookings`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      
      const data = await response.json();
      if (response.ok) setBookings(data);
    } catch (error) {
      console.error("Lỗi lịch sử:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 2. Hàm mở Modal và lấy chi tiết đơn hàng (để có thông tin User)
  const openTicket = async (bookingId: string) => {
    setModalVisible(true);
    setLoadingDetail(true);
    try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoStr || '{}');

        // Gọi API chi tiết để lấy đầy đủ thông tin người đặt
        const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        const data = await response.json();
        if (response.ok) {
            setSelectedBooking(data);
        } else {
            Alert.alert("Lỗi", "Không tải được chi tiết vé");
            setModalVisible(false);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingDetail(false);
    }
  };

  // 3. Render từng dòng lịch sử
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => openTicket(item._id)} // <--- Bấm vào thì mở Modal
    >
      <View style={styles.row}>
        <Image source={{ uri: item.car?.imageUri }} style={styles.carImage} />
        <View style={styles.info}>
          <Text style={styles.carName}>{item.car?.name || 'Xe không xác định'}</Text>
          <Text style={styles.text}>Ngày: {new Date(item.startTime).toLocaleDateString('vi-VN')}</Text>
          <Text style={styles.price}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalCost)}</Text>
          <View style={[styles.badge, { backgroundColor: item.status === 'Completed' ? '#E6FFFA' : '#FFF5F5' }]}>
             <Text style={{ color: item.status === 'Completed' ? 'green' : 'orange', fontSize: 12 }}>{item.status}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  // 4. Render nội dung Modal (Vé điện tử)
  const renderTicketModal = () => {
    if (!selectedBooking) return null;

    const qrData = JSON.stringify({
        id: selectedBooking._id,
        user: selectedBooking.user?.email,
        car: selectedBooking.car?.licensePlate
    });

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <SafeAreaView style={{flex: 1, backgroundColor: BRAND_COLOR}}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Vé Điện Tử</Text>
                    <View style={{width: 40}} />
                </View>

                {loadingDetail ? (
                    <ActivityIndicator size="large" color="white" style={{marginTop: 50}} />
                ) : (
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={styles.ticketCard}>
                            <Text style={styles.ticketLabel}>MÃ XÁC NHẬN</Text>
                            <View style={{alignItems: 'center', marginVertical: 20}}>
                                <QRCode value={qrData} size={180} />
                            </View>
                            <Text style={styles.codeText}>{selectedBooking._id.slice(-8).toUpperCase()}</Text>
                            
                            <View style={styles.dashedLine} />

                            {/* Thông tin khách hàng */}
                            <View style={styles.infoSection}>
                                <Text style={styles.sectionTitle}>KHÁCH HÀNG</Text>
                                <Text style={styles.valueText}>{selectedBooking.user?.name}</Text>
                                <Text style={styles.subValueText}>{selectedBooking.user?.email}</Text>
                            </View>

                            {/* Thông tin xe */}
                            <View style={styles.infoSection}>
                                <Text style={styles.sectionTitle}>XE THUÊ</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={{ uri: selectedBooking.car?.imageUri }} style={styles.modalCarImage} />
                                    <View>
                                        <Text style={styles.valueText}>{selectedBooking.car?.name}</Text>
                                        <Text style={styles.plateText}>{selectedBooking.car?.licensePlate}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Trạng thái thanh toán */}
                            <View style={styles.infoSection}>
                                <Text style={styles.sectionTitle}>THANH TOÁN</Text>
                                <Text style={{color: selectedBooking.isPaid ? 'green' : 'red', fontWeight: 'bold'}}>
                                    {selectedBooking.isPaid ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'} ({selectedBooking.paymentMethod})
                                </Text>
                                <Text style={[styles.valueText, {color: BRAND_COLOR, marginTop: 5}]}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBooking.totalCost)}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch sử giao dịch</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={BRAND_COLOR} style={{marginTop: 50}} />
      ) : (
        <FlatList 
            data={bookings} 
            renderItem={renderItem} 
            keyExtractor={item => item._id} 
            contentContainerStyle={{padding: 15}}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); fetchHistory()}} />}
            ListEmptyComponent={<View style={styles.empty}><Text>Chưa có đơn hàng nào.</Text></View>}
        />
      )}

      {/* Nhúng Modal vào đây */}
      {renderTicketModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 15, backgroundColor: 'white', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  carImage: { width: 70, height: 70, borderRadius: 8, marginRight: 15, backgroundColor: '#eee' },
  info: { flex: 1, justifyContent: 'space-between' },
  carName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  text: { color: 'gray', fontSize: 12, marginBottom: 2 },
  price: { color: BRAND_COLOR, fontWeight: 'bold', marginTop: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 5 },
  empty: { alignItems: 'center', marginTop: 100 },

  // Styles cho Modal
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  closeButton: { backgroundColor: 'white', padding: 5, borderRadius: 20 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  modalContent: { padding: 20 },
  ticketCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, paddingBottom: 30 },
  ticketLabel: { textAlign: 'center', fontWeight: 'bold', color: '#666', marginTop: 10, letterSpacing: 1 },
  codeText: { textAlign: 'center', fontSize: 24, fontWeight: 'bold', letterSpacing: 4, color: '#333' },
  dashedLine: { height: 1, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', marginVertical: 20 },
  infoSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 5 },
  valueText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subValueText: { fontSize: 14, color: '#666' },
  modalCarImage: { width: 80, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#eee' },
  plateText: { fontSize: 13, color: '#555', backgroundColor: '#f0f0f0', alignSelf: 'flex-start', paddingHorizontal: 5, borderRadius: 4, marginTop: 4 }
});