// app/(tabs)/carlistscreen.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import Component và Data
import CarListingCard from '../(tabs)/carcard'; 
import { BRAND_COLOR, CarListing } from '../../constants/_data'; 

const CarListScreen = () => {
  const { carType } = useLocalSearchParams();
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);

  // === GỌI API LẤY DANH SÁCH XE ===
  useEffect(() => {
    const fetchCars = async () => {
      try {
        // ⚠️⚠️⚠️ QUAN TRỌNG: THAY IP MÁY TÍNH CỦA BẠN VÀO ĐÂY
        const response = await fetch('http://192.168.88.137:3000/api/cars');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu xe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // === LOGIC LỌC XE (ĐÃ SỬA LỖI THUÊ THEO NGÀY) ===
  const filteredCars = useMemo(() => {
    if (loading || cars.length === 0) return [];

    const typeString = Array.isArray(carType) ? carType[0] : carType;
    const normalizedType = typeString ? typeString.toLowerCase().replace(/\s/g, '') : '';

    // Nếu là "Thuê theo ngày" -> Trả về tất cả xe
    if (!normalizedType || normalizedType.includes('thuêtheongày')) {
      return cars;
    }
    
    // Nếu là loại khác (4 chỗ, 7 chỗ...) -> Lọc theo type
    return cars.filter((car: CarListing) => {
      const normalizedCarType = car.type.toLowerCase().replace(/\s/g, '');
      return normalizedCarType.includes(normalizedType) || normalizedType.includes(normalizedCarType);
    });

  }, [carType, cars, loading]);

  const renderCarItem = ({ item }: { item: CarListing }) => (
    <View style={{ paddingHorizontal: 16 }}>
      <CarListingCard item={item} /> 
    </View>
  );

  // Hiển thị Loading
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
        <Text style={{ marginTop: 10, color: '#666' }}>Đang tải danh sách xe...</Text>
      </SafeAreaView>
    );
  }

  const displayType = carType ? (Array.isArray(carType) ? carType[0] : carType) : 'Danh sách Xe';

  // Hiển thị khi không tìm thấy xe
  if (!filteredCars || filteredCars.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={listStyles.header}>
          <TouchableOpacity onPress={() => router.back()} style={listStyles.headerIcon}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={listStyles.title}>{displayType}</Text>
          <View style={{width: 24}} />
        </View>
        <View style={listStyles.emptyContainer}>
          <Ionicons name="car-sport-outline" size={50} color="#9CA3AF" />
          <Text style={listStyles.emptyText}>Không tìm thấy {displayType} nào.</Text>
          <Text style={listStyles.emptySubText}>Vui lòng kiểm tra kết nối mạng.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={listStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={listStyles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={listStyles.title}>{displayType}</Text>
        <TouchableOpacity style={listStyles.headerIcon}>
          <Ionicons name="options-outline" size={24} color={BRAND_COLOR} />
        </TouchableOpacity>
      </View>

      {/* Danh sách xe */}
      <FlatList
        data={filteredCars} 
        renderItem={renderCarItem}
        keyExtractor={(item) => item._id || item.id} 
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      />
    </SafeAreaView>
  );
};

export default CarListScreen;

const listStyles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', textTransform: 'capitalize' },
  headerIcon: { padding: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#4B5563', marginTop: 10 },
  emptySubText: { fontSize: 14, color: '#9CA3AF', marginTop: 5 },
});