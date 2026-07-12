import { FC } from 'react';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';
import { CustomScrollbar } from '../custom-scrollbar';

export const OrdersListUI: FC<OrdersListUIProps> = ({ orderByDate }) => (
  <CustomScrollbar className={styles.content} wrapperClassName={styles.wrapper}>
    {orderByDate.map((order) => (
      <OrderCard order={order} key={order._id} />
    ))}
  </CustomScrollbar>
);
