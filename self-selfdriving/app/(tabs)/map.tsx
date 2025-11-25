// app/(tabs)/map.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Platform, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  StatusBar, 
  Alert // <--- ĐÃ THÊM IMPORT ALERT Ở ĐÂY
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image'; 
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// === IMPORT GOOGLE MAPS ===
let MapView: any;
let Marker: any;
let Callout: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Callout = Maps.Callout;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn("react-native-maps could not be loaded.");
  }
}

interface CarLocation {
  _id: string;
  name: string;
  licensePlate: string;
  imageUri: string;
  pricePerDay: number;
  currentLocation: {
    coordinates: number[]; 
  };
}

const FullScreenMapView = () => {
  // === KHAI BÁO STATE (QUAN TRỌNG ĐỂ KHÔNG BỊ LỖI setCars, setLoading) ===
  const [cars, setCars] = useState<CarLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  // === HÀM LẤY DỮ LIỆU (ĐÃ SỬA LỖI DEBUG) ===
  const fetchCarLocations = async () => {
    setLoading(true);
    console.log("1. Bắt đầu ấn nút cập nhật...");

    try {
      //thay đổi địa chỉ ip máy
      const url = 'http://192.168.88.137:3000/api/cars'; 
      console.log("2. Đang gọi đến:", url);

      // Timeout sau 5 giây nếu mạng lag
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      console.log("3. Kết nối Server thành công! Status:", response.status);

      if (!response.ok) {
        throw new Error(`Server báo lỗi: ${response.status}`);
      }

      const data = await response.json();
      console.log("4. Đã lấy được dữ liệu:", data.length, "xe");
      
      setCars(data); // <--- Hết lỗi setCars
      
      // Thông báo thành công
      Alert.alert("Thành công", `Đã tìm thấy ${data.length} xe xung quanh bạn!`); // <--- Hết lỗi Alert

    } catch (error: any) {
      console.error("LỖI:", error);
      
      let errorMessage = "Lỗi không xác định";
      if (error.name === 'AbortError') {
        errorMessage = "Kết nối quá lâu (Timeout). Kiểm tra lại IP hoặc Mạng.";
      } else if (error.message && error.message.includes('Network request failed')) {
        errorMessage = "Không tìm thấy Server! \n1. Kiểm tra IP máy tính.\n2. Tắt tường lửa.\n3. Đảm bảo chung Wifi.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert("Lỗi Cập Nhật", errorMessage);
    } finally {
      setLoading(false); // <--- Hết lỗi setLoading
    }
  };

  useEffect(() => {
    fetchCarLocations();
  }, []);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  if (Platform.OS === 'web' || !MapView) {
    return (
      <View style={styles.placeholder}>
        <Text>Bản đồ không hỗ trợ trên Web</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.webBackButton}>
            <Text>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 10.7769,
          longitude: 106.7009,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {cars.map((car) => {
          if (!car.currentLocation || !car.currentLocation.coordinates) return null;

          return (
            <Marker
              key={car._id}
              coordinate={{
                latitude: car.currentLocation.coordinates[1],
                longitude: car.currentLocation.coordinates[0],
              }}
              title={car.name}
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerImageWrapper}>
                  <Image source={{ uri: car.imageUri }} style={styles.markerImage} contentFit="cover"/>
                </View>
                <View style={styles.markerArrow} />
              </View>

              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{car.name}</Text>
                  <Text style={styles.calloutText}>BS: {car.licensePlate}</Text>
                  <Text style={styles.calloutPrice}>{formatCurrency(car.pricePerDay)}/ngày</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* === THANH CÔNG CỤ NỔI === */}
      <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.refreshButton} onPress={fetchCarLocations} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="refresh" size={18} color="white" />
              <Text style={styles.refreshText}>Cập nhật xe</Text>
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default function MapScreen() {
  return <FullScreenMapView />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  webBackButton: { marginTop: 20, padding: 10, backgroundColor: '#ddd' },
  overlayContainer: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  iconButton: {
    width: 45, height: 45, backgroundColor: 'white', borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  refreshButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#00A86B',
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 25, height: 45,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  refreshText: { color: 'white', fontWeight: '600', marginLeft: 6, fontSize: 13 },
  markerContainer: { alignItems: 'center', width: 60, height: 60 },
  markerImageWrapper: {
    width: 48, height: 48, borderRadius: 24, 
    borderWidth: 2, borderColor: '#00A86B', backgroundColor: 'white',
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center'
  },
  markerImage: { width: '100%', height: '100%' },
  markerArrow: {
    width: 0, height: 0, 
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderStyle: 'solid', backgroundColor: 'transparent', 
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#00A86B',
    marginTop: -2
  },
  calloutContainer: {
    backgroundColor: 'white', padding: 10, borderRadius: 8, width: 180,
    shadowColor: '#000', shadowOpacity: 0.2, elevation: 5, marginBottom: 5
  },
  calloutTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  calloutText: { fontSize: 12, color: '#555' },
  calloutPrice: { fontSize: 12, color: '#00A86B', fontWeight: 'bold', marginTop: 2 },
});