import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectCurrentOrder,
  selectFeedOrders,
  selectIngredients,
  selectUserOrders
} from '../../services/selectors';
import { fetchOrderByNumber } from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const currentOrder = useSelector(selectCurrentOrder);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const ingredients = useSelector(selectIngredients);

  const foundOrder =
    [...feedOrders, ...userOrders].find(
      (order) => order.number === orderNumber
    ) || currentOrder;

  useEffect(() => {
    if (!foundOrder && orderNumber) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, foundOrder, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!foundOrder || !ingredients.length) {
      return null;
    }

    const date = new Date(foundOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = foundOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...foundOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [foundOrder, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
