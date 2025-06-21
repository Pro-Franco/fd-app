import {
  StyleSheet,
  Image,
  Pressable,
  View,
  ImageResolvedAssetSource
} from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Tables } from '../types';
import { Link } from 'expo-router';
import RemoteImage from './RemoteImage';

export const defaultPizzaImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

//export const defaultPizzaImage = require('assets/images/default.png');

type ProductListItemProps = {
  product: Tables<'products'>;
};

const localImage = require('assets/images/default.png');

console.log(localImage); // Veja as dimensões reais

const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link href={`./menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.imageContainer}>
          <RemoteImage
            path={product.image}
            fallback={defaultPizzaImage}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Organiza a imagem e o texto lado a lado
    maxWidth: '100%',
    padding: 5,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10, // Espaço entre os itens
    backgroundColor: '#fff' // Fundo branco para o item
  },
  imageContainer: {
    width: 100, // Define a largura fixa da imagem
    height: 100, // A altura deve ser igual à largura para manter o aspecto quadrado
    marginRight: 10, // Espaço entre a imagem e o texto
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee' // Fundo neutro enquanto a imagem carrega
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  detailsContainer: {
    justifyContent: 'center',
    flex: 1 // Faz o texto ocupar o restante do espaço disponível
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5 // Espaço entre o nome e o preço
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold'
  }
});
