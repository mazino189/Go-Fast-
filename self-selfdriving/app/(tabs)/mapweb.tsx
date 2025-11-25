// app/map.tsx
import React from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';

// === CONDITIONAL MAP COMPONENT ===
const FullScreenMapView = () => {
  // Trên Web, luôn hiển thị placeholder
  if (Platform.OS === 'web') {
    return (
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>Màn hình Bản đồ không khả dụng trên Web</Text>
        <Text style={styles.placeholderTextSmall}>(Chỉ hiển thị trên iOS/Android)</Text>
      </View>
    );
  }

  // Chỉ import và sử dụng MapView trên native (iOS/Android)
  try {
    const { default: MapView, PROVIDER_GOOGLE } = require('react-native-maps');
    
    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 21.028511,
          longitude: 105.804817,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    );
  } catch (error) {
    console.warn('MapView could not be loaded:', error);
    return (
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>Không thể tải bản đồ</Text>
      </View>
    );
  }
};

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <FullScreenMapView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  placeholderTextSmall: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});