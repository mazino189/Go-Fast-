// app/homescreen/_layout.tsx

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home" // ← Mở tab Home đầu tiên
      screenOptions={{
        tabBarActiveTintColor: '#00A86B',
        tabBarInactiveTintColor: '#888888',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
      }}
    >
      {/* 1. Trang chủ */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Hoạt động */}
      <Tabs.Screen
        name="activity"
        options={{
          tabBarLabel: 'Hoạt động',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Khám phá */}
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Thông báo */}
      <Tabs.Screen
        name="information"
        options={{
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 5. Tài khoản */}
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>

    
  );
}