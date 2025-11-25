import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../app/(tabs)/api' // Đảm bảo đường dẫn đúng

export const useCancelBooking = () => {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelBooking = (bookingId: string, onSuccess: () => void) => {
    Alert.alert(
      "Xác nhận hủy",
      "Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
      [
        { text: "Không", style: "cancel" },
        { 
          text: "Hủy đơn", 
          style: "destructive", 
          onPress: async () => {
            setIsCancelling(true);
            try {
              const userInfoStr = await AsyncStorage.getItem('userInfo');
              const userInfo = JSON.parse(userInfoStr || '{}');

              const response = await fetch(`${API_URL}/bookings/cancel`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookingId }) 
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Thành công", "Đã hủy đơn hàng.");
                onSuccess(); // Gọi callback để reload dữ liệu
              } else {
                Alert.alert("Lỗi", data.message || "Không thể hủy đơn.");
              }
            } catch (error) {
              Alert.alert("Lỗi mạng", "Vui lòng kiểm tra kết nối.");
            } finally {
              setIsCancelling(false);
            }
          }
        }
      ]
    );
  };

  return { cancelBooking, isCancelling };
};