import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

// Helper to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return { totalQuantity, totalPrice };
};

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  totalQuantity: 0,
  totalPrice: 0,
};

// Initial calculation
const totals = calculateTotals(initialState.items);
initialState.totalQuantity = totals.totalQuantity;
initialState.totalPrice = totals.totalPrice;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
