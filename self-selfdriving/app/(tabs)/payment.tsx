// app/homescreen/payment.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BRAND_COLOR = '#00A86B';

export default function PaymentScreen() {
  const [cards, setCards] = useState([
    { id: '1', type: 'Visa', number: '**** **** **** 1234', icon: 'card' },
    { id: '2', type: 'Momo', number: '098 *** 789', icon: 'wallet' },
  ]);

  const handleAddCard = () => {
    Alert.alert("Thông báo", "Tính năng liên kết ngân hàng đang bảo trì.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.title}>Phương thức thanh toán</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Thẻ & Ví đã lưu</Text>
        
        {cards.map((item) => (
          <View key={item.id} style={styles.cardItem}>
            <View style={styles.cardLeft}>
                <Ionicons name={item.icon as any} size={24} color={BRAND_COLOR} />
                <View style={{marginLeft: 15}}>
                    <Text style={styles.cardType}>{item.type}</Text>
                    <Text style={styles.cardNumber}>{item.number}</Text>
                </View>
            </View>
            <Ionicons name="trash-outline" size={20} color="red" />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.addButtonText}>Thêm phương thức mới</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: 'white', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#555' },
  cardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  cardType: { fontWeight: 'bold', fontSize: 16 },
  cardNumber: { color: 'gray', fontSize: 13 },
  addButton: { flexDirection: 'row', backgroundColor: BRAND_COLOR, padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 10 }
});