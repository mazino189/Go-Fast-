import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, Keyboard, ActivityIndicator, Platform, Alert, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location'; // Thư viện định vị

// === IMPORT MAPS ===
let MapView: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn("react-native-maps could not be loaded.");
  }
}

const BRAND_COLOR = '#00A86B';

// ⚠️ DÁN API KEY CỦA BẠN VÀO ĐÂY
const GOOGLE_API_KEY = 'AIzaSyA6Q056BELUQAqOLuoNQwmnx89PsWf0m8Q'; 

interface GooglePlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isMapMoving, setIsMapMoving] = useState(false); // Trạng thái đang kéo map
  
  const mapRef = useRef<any>(null);

  // 1. Lấy vị trí hiện tại khi mở App
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền vị trí để sử dụng tính năng này.');
        return;
      }
      getCurrentLocation();
    })();
  }, []);

  // Hàm lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Di chuyển map về vị trí hiện tại
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);

      // Lấy địa chỉ của vị trí hiện tại
      fetchAddressFromCoords(latitude, longitude);
    } catch (error) {
      console.log("Lỗi lấy vị trí:", error);
    }
  };

  // 2. Tìm kiếm gợi ý (Autocomplete)
  const handleSearchTextChange = async (text: string) => {
    setSearchQuery(text);
    if (text.length < 2) {
      setPredictions([]);
      return;
    }
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${GOOGLE_API_KEY}&components=country:vn&language=vi`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.status === 'OK') setPredictions(data.predictions);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Chọn địa điểm từ danh sách gợi ý
  const onSelectPrediction = async (placeId: string, description: string) => {
    Keyboard.dismiss();
    setPredictions([]);
    setSearchQuery(description);

    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address&key=${GOOGLE_API_KEY}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.result.geometry.location;
        
        // Cập nhật state
        setSelectedPlace({
          name: data.result.name,
          address: data.result.formatted_address,
          lat, lng
        });

        // Di chuyển map
        mapRef.current?.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 4. Kỹ thuật Reverse Geocoding (Lấy địa chỉ từ tọa độ khi thả tay)
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=vi`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        // Cập nhật thông tin địa điểm đang chọn
        setSelectedPlace({
          name: "Vị trí đã ghim", // Hoặc lấy result.address_components[0].long_name
          address: result.formatted_address,
          lat, lng
        });
        // Cập nhật thanh tìm kiếm cho khớp
        setSearchQuery(result.formatted_address);
      }
    } catch (error) {
      console.error("Lỗi Geocoding:", error);
    }
  };

  // Sự kiện khi người dùng dừng kéo bản đồ
  const onRegionChangeComplete = (region: any) => {
    // Chỉ gọi API nếu không phải do chọn từ danh sách (để tránh call kép)
    // Ở đây ta gọi luôn để đồng bộ trải nghiệm "Thả ghim là lấy địa chỉ"
    setIsMapMoving(false);
    fetchAddressFromCoords(region.latitude, region.longitude);
  };

  const onRegionChange = () => {
    setIsMapMoving(true); // Đang kéo thì ẩn thông tin đi cho đỡ rối
  };

  // 5. Đặt xe
  const handleBookRide = () => {
    if (!selectedPlace) return;
    router.push({
      pathname: '/(tabs)/carlistscreen',
      params: { 
        destination: selectedPlace.address, // Lấy địa chỉ chính xác
        lat: selectedPlace.lat,
        lon: selectedPlace.lng
      }
    });
  };

  const renderMapView = () => {
    if (Platform.OS === 'web' || !MapView) return <Text>Map not supported on Web</Text>;

    return (
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 10.7769,
            longitude: 106.7009,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onRegionChange={onRegionChange}
          onRegionChangeComplete={onRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={false} // Tắt nút mặc định để dùng nút custom đẹp hơn
        />
        
        {/* === CÁI GHIM Ở GIỮA MÀN HÌNH (CENTER PIN) === */}
        <View style={styles.centerMarkerContainer} pointerEvents="none">
          <Ionicons name="location" size={40} color={BRAND_COLOR} style={{marginBottom: 40}} /> 
          {/* marginBottom để đầu kim nhọn chạm đúng tâm */}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* THANH TÌM KIẾM */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color="#333" style={{marginRight: 10}} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
             <TextInput
                style={styles.input}
                placeholder="Tìm địa điểm..."
                value={searchQuery}
                onChangeText={handleSearchTextChange}
                placeholderTextColor="#9CA3AF"
                selectTextOnFocus
              />
          </View>
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setPredictions([]); }}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* GỢI Ý TÌM KIẾM */}
        {predictions.length > 0 && (
          <View style={styles.resultsList}>
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity 
                    style={styles.resultItem} 
                    onPress={() => onSelectPrediction(item.place_id, item.structured_formatting.main_text)}
                >
                  <Ionicons name="location" size={20} color="#ccc" style={{marginRight: 10}} />
                  <View style={{flex: 1}}>
                    <Text style={styles.resultTitle}>{item.structured_formatting.main_text}</Text>
                    <Text style={styles.resultAddress} numberOfLines={1}>{item.structured_formatting.secondary_text}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* BẢN ĐỒ */}
      <View style={styles.mapContainer}>
        {renderMapView()}
      </View>

      {/* NÚT VỀ VỊ TRÍ CỦA TÔI */}
      <TouchableOpacity style={styles.myLocationButton} onPress={getCurrentLocation}>
        <Ionicons name="locate" size={24} color="#333" />
      </TouchableOpacity>

      {/* THẺ THÔNG TIN ĐỊA ĐIỂM (BOTTOM SHEET) */}
      {selectedPlace && !isMapMoving && (
        <View style={styles.bottomCard}>
          <View style={styles.placeInfo}>
            <Text style={styles.placeLabel}>Điểm đến của bạn:</Text>
            <Text style={styles.placeAddress} numberOfLines={2}>{selectedPlace.address}</Text>
          </View>
          
          <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
            <Text style={styles.bookButtonText}>Xác nhận điểm đến</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  searchContainer: { position: 'absolute', top: 10, left: 15, right: 15, zIndex: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  input: { fontSize: 16, color: '#333', height: 40 },
  
  resultsList: { backgroundColor: 'white', marginTop: 5, borderRadius: 10, maxHeight: 200, elevation: 5 },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  resultTitle: { fontWeight: 'bold', fontSize: 14 },
  resultAddress: { fontSize: 12, color: 'gray' },

  mapContainer: { flex: 1 },
  map: { width: '100%', height: '100%' },
  
  // Style cho cái ghim ở giữa
  centerMarkerContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },

  myLocationButton: { position: 'absolute', bottom: 180, right: 20, backgroundColor: 'white', padding: 12, borderRadius: 30, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2 },

  bottomCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  placeInfo: { marginBottom: 15 },
  placeLabel: { fontSize: 12, color: 'gray', fontWeight: 'bold', marginBottom: 5 },
  placeAddress: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  bookButton: { flexDirection: 'row', backgroundColor: BRAND_COLOR, paddingVertical: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bookButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginRight: 10 },
});