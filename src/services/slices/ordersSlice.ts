import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { TOrder, TOrdersData } from '@utils-types';
import { clearConstructor } from './constructorSlice';

type TOrdersState = {
  feed: TOrdersData;
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  orderModalData: TOrder | null;
  isFeedLoading: boolean;
  isUserOrdersLoading: boolean;
  isOrderLoading: boolean;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  userOrders: [],
  currentOrder: null,
  orderModalData: null,
  isFeedLoading: false,
  isUserOrdersLoading: false,
  isOrderLoading: false,
  orderRequest: false,
  error: null
};

export const fetchFeed = createAsyncThunk('orders/fetchFeed', getFeedsApi);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  getOrdersApi
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0] || null;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredientIds: string[], { dispatch }) => {
    const data = await orderBurgerApi(ingredientIds);
    dispatch(clearConstructor());
    dispatch(fetchFeed());
    dispatch(fetchUserOrders());
    return data.order;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isFeedLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.error = action.error.message || 'Не удалось загрузить ленту';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isUserOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isUserOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isUserOrdersLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = {
          ...action.payload,
          ingredients: []
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      });
  }
});

export const { clearOrderModal, clearCurrentOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
