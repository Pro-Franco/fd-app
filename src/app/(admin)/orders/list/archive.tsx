import { ActivityIndicator, FlatList, Text } from 'react-native';
import { View } from '@/components/Themed';
import OrderListItem from '@/components/OrderListItem';
import { useRouter } from 'expo-router';
import { useAdminOrderList } from '@/api/orders';

export default function OrdersScreen() {
  const {
    data: orders,
    isLoading,
    error
  } = useAdminOrderList({ archived: true });

  if (isLoading) {
    return <ActivityIndicator></ActivityIndicator>;
  }

  if (error) {
    return <Text>Falha ao carregar</Text>;
  }

  return (
    <View>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item}></OrderListItem>}
        // numcolumns will (only?) work when each item has flex 1 in the container, which means it will split equally between siblings.
        // if you combine it with maxWidth, each element can not go over it
        // numColumns={1}
        // contentContainerStyle={{ gap: 10, padding: 10 }}
        // columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
}
