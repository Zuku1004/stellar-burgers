import { RootState } from './store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectFeed = (state: RootState) => state.orders.feed;
export const selectFeedOrders = (state: RootState) => state.orders.feed.orders;
export const selectFeedLoading = (state: RootState) =>
  state.orders.isFeedLoading;
export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.orders.isUserOrdersLoading;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.user.user);
export const selectUserError = (state: RootState) => state.user.error;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateUserError;
