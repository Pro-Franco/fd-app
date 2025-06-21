import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Order, Tables } from '../types';
import { Link, useSegments } from 'expo-router';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { useColorScheme } from '@/components/useColorScheme';

// Estenda dayjs com o plugin relativeTime
dayjs.extend(relativeTime);

type OrderListItemProps = {
  order: Tables<'orders'>;
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const segments = useSegments();
  type ValidRoute = '(user)' | '(admin)';

  let seg = segments[0] as ValidRoute;

  // const colorScheme = useColorScheme();
  // const bgColor = Colors[colorScheme ?? 'light'].background;
  const bgColor = '#263744';
  // const textColor = Colors[colorScheme ?? 'light'].text;
  const time = dayjs(order.created_at).fromNow();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor
        }
      ]}
    >
      {/* <Link href={`/${segments[0]}/orders/${orderId}`} asChild>  */}
      <Link href={`/${seg}/orders/${order.id}`} asChild>
        {/* <Link href={{ pathname: "/[segment]/orders/[orderId]", params: { orderId: order.id, segment: segments[0] } }} asChild/> */}
        <Pressable style={styles.orderContainer}>
          <View style={styles.orderIdAndTimeContainer}>
            <Text style={styles.title}>{`Order #${order.id}`}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.status}>{order.status}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default OrderListItem;

const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 5,
    marginHorizontal: 5
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: ''
  },
  orderIdAndTimeContainer: {
    marginRight: 'auto',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  status: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 10,
    alignSelf: 'auto',
    color: 'white'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 3,
    alignSelf: 'auto',
    color: 'white'
  },
  time: {
    fontSize: 15,
    fontWeight: '300',
    marginVertical: 3,
    alignSelf: 'auto',
    color: 'white'
  }
});
