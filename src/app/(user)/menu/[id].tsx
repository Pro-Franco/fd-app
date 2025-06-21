// [id] is a dynamic link, feeds in an id
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useState } from 'react';
import Button from '@components/Button';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { useProduct } from '@/api/products';
import RemoteImage from '@/components/RemoteImage';
import FancyLoading from '@/components/FancyLoading';
import { Platform } from 'react-native';

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];
//const { width } = useWindowDimensions();

const ProductDetailsScreen = () => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

  // idString could be a string | string[]
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const bgColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const { addItem } = useCart();
  const router = useRouter();

  const { data: product, error, isLoading } = useProduct(id);

  const addToCart = () => {
    console.log('Rodando em:', Platform.OS);
    if (!product) {
      return;
    }
    addItem(product, selectedSize);
    router.push('/cart');
  };

  if (isLoading) {
    //return <ActivityIndicator />;
    return <FancyLoading />;
  }

  if (error) {
    return <Text>Falha ao carregar id of: {id}.</Text>;
  }

  if (!product) {
    return <Text>Produto não encontrado!</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <RemoteImage
        path={product.image}
        fallback={defaultPizzaImage}
        style={styles.image}
      />

      <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
        Selecione o Tamanho
      </Text>

      <View style={styles.sizes}>
        {sizes.map((aSize, i) => (
          //{/* we can pass in conditional styles using [] inside style */}
          <Pressable
            onPress={() => {
              setSelectedSize(aSize);
            }}
            style={[
              styles.size,
              {
                backgroundColor: selectedSize === aSize ? 'gainsboro' : bgColor
              }
            ]}
            key={i}
          >
            <Text
              style={[
                styles.sizeText,
                {
                  color: selectedSize === aSize ? 'Blue Orchid' : textColor
                }
              ]}
            >
              {aSize}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>${product.price}</Text>

      <Button onPress={addToCart} text="Adicionar Carrinho" />
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
    flex: 1,
    padding: 10
  },
  selectSizeTitle: {},
  price: {
    color: Colors.light.tint,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto'
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    maxWidth: 500
  },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500'
  }
});
