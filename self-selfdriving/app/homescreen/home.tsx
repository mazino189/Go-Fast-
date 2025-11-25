// app/homescreen/home.tsx
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { styles, localStyles, BRAND_COLOR } from '../homescreen/_style'; 
import { API_URL } from '../(tabs)/api'; // Import API URL chuẩn

// === IMPORT GOOGLE MAPS ===
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn("react-native-maps could not be loaded.");
  }
}

// === SERVICE ICON ===
interface ServiceIconProps {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const ServiceIcon = React.memo<ServiceIconProps>(({ name, label, onPress }) => (
  <TouchableOpacity style={localStyles.iconWrapper} onPress={onPress}>
    <View style={localStyles.iconContainer}>
      <Ionicons name={name} size={30} color="#00A86B" />
    </View>
    <Text style={localStyles.iconLabel}>{label}</Text>
  </TouchableOpacity>
));

// === MAP VIEW COMPONENT ===
const ConditionalMapView = () => {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Sử dụng API_URL từ constants để dễ quản lý IP
        const response = await fetch(`${API_URL}/cars`);
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.log("Lỗi map home:", error);
      }
    };
    fetchCars();
  }, []);

  if (Platform.OS === 'web' || !MapView) {
    return (
      <View style={localStyles.mapViewPlaceholder}>
        <Text style={localStyles.mapPlaceholderText}>Bản đồ không khả dụng trên Web</Text>
      </View>
    );
  }

  return (
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: 10.7769,
        longitude: 106.7009,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      scrollEnabled={false}
      zoomEnabled={false}
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
            pinColor={BRAND_COLOR} 
          />
        );
      })}
    </MapView>
  );
};

// === HOME SCREEN ===
const HomeScreen = () => {
  const [userInfo, setUserInfo] = useState({ name: 'Khách', email: '' });
  
  const currentWeather = '27°C';
  const weatherIcon = 'cloud-outline';

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userInfo');
        if (jsonValue != null) {
          const user = JSON.parse(jsonValue);
          setUserInfo(user);
        }
      } catch (e) {
        console.error("Lỗi lấy thông tin user:", e);
      }
    };
    getUserInfo();
  }, []);

  const handleSelectCar = useCallback((type: string) => {
    router.push({
      pathname: '/(tabs)/carlistscreen', 
      params: { carType: type }
    });
  }, []);

  const handleSearchPress = useCallback(() => {
    router.push('../(tabs)/map');
  }, []);

  const handleSchedulePress = useCallback(() => {
    router.push('../(tabs)/schedule');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BRAND_COLOR} />

      {/* HEADER */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>Xin chào,</Text>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
          </View>
          <View style={styles.headerIcons}>
            <View style={styles.weatherPill}>
              <Ionicons name={weatherIcon as keyof typeof Ionicons.glyphMap} size={18} color="white" />
              <Text style={styles.weatherText}>{currentWeather}</Text>
            </View>
            <View style={styles.appLogoPill}>
              <Ionicons name="flash" size={20} color="#FFD700" />
              <Text style={styles.goFastText}>GoFast</Text>
            </View>
          </View>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.mainContent}>
        
        {/* 1. MAP VIEW */}
        <TouchableOpacity style={localStyles.mapView} onPress={handleSearchPress} activeOpacity={0.9}>
          <ConditionalMapView />
          <View style={{position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.8)', padding: 5, borderRadius: 5}}>
             <Text style={{fontSize: 10, fontWeight: 'bold', color: BRAND_COLOR}}>Chạm để xem toàn bộ xe</Text>
          </View>
        </TouchableOpacity>

        {/* 2. SEARCH BAR */}
        <View style={styles.searchBarContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <Ionicons name="location" size={24} color="#FF9900" />
            <Text style={styles.searchText}>Tìm vị trí xe gần nhất...</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedulePress}>
            <Ionicons name="time-outline" size={20} color={BRAND_COLOR} />
            <Text style={styles.scheduleText}>Hẹn Lịch</Text>
          </TouchableOpacity>
        </View>

        {/* 3. CAR SELECTION GRID */}
        <View style={localStyles.bottomPanel}>
          <Text style={styles.sectionTitle}>Chọn loại xe thuê:</Text>

          <View style={styles.coreServicesGrid}>
            <ServiceIcon name="car-sport-outline" label="Xe 4 Chỗ" onPress={() => handleSelectCar('Xe 4 chỗ')} />
            <ServiceIcon name="car-outline" label="Xe 7 Chỗ" onPress={() => handleSelectCar('Xe 7 chỗ')} />
            <ServiceIcon name="bus-outline" label="Xe 9 Chỗ" onPress={() => handleSelectCar('Xe 9 chỗ')} />
            <ServiceIcon name="calendar-outline" label="Thuê Theo Ngày" onPress={() => handleSelectCar('Xe thuê theo ngày')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;