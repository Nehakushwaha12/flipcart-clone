import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface CompareState {
  items: Product[];
}

const initialState: CompareState = {
  items: [],
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action: PayloadAction<Product>) => {
      if (state.items.length < 4 && !state.items.find(i => i.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFromCompare: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCompare: (state) => {
      state.items = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
