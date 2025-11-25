// app/(tabs)/_data.ts

export const BRAND_COLOR = '#00A86B'; 
export const ACCENT_COLOR = '#FF9900'; 
export const DISCOUNT_COLOR = '#FF4500'; 

// === CẬP NHẬT INTERFACE ĐỂ KHỚP BACKEND ===
export interface CarListing {
  id: string;
  _id: string;          // ⚠️ Backend MongoDB dùng _id
  name: string;
  pricePerDay: number;  // ⚠️ Backend trả về số (Number)
  pricePerHour: number; // ⚠️ Backend trả về số (Number)
  discount: string;
  imageUri: string;     
  type: string;         // '4 chỗ', '7 chỗ', '9 chỗ'
  details: string;
  location: string;
  rating: number;
  trips: number;
  avatarUri: string;
}

