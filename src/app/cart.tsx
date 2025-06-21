// import { StatusBar } from 'expo-status-bar';
import { View, Text, Platform, FlatList } from 'react-native';
import { useCart } from '@/providers/CartProvider';
import CartListItem from '@/components/CartListItem';
import Button from '@/components/Button';

const CartScreen = () => {
  const { items, total, checkout } = useCart();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
      />

      <Text style={{ color: 'white' }}>Cart item length: {items?.length}</Text>
      {/* Use uma barra de status clara no iOS para compensar o espaço preto acima do modal. Muito instável no Android. */}
      {/* <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} /> */}

      <Text style={{ color: 'white', marginTop: 'auto' }}>Total: ${total}</Text>
      <Button onPress={checkout} text="Checkout"></Button>
    </View>
  );
};

export default CartScreen;
