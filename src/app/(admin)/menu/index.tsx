import { ActivityIndicator, FlatList, Text } from 'react-native';
import { View } from '@/components/Themed';
import ProductListItem from '@/components/ProductListItem';
import { useProductList } from '@/api/products';

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Falha ao carregar produtos.</Text>;
  }

  return (
    <View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductListItem product={item}></ProductListItem>
        )}
        // numcolumns funcionará (somente?) quando cada item tiver flex 1 no contêiner, o que significa que será dividido igualmente entre os irmãos.
        // se você combiná-lo com maxWidth, cada elemento não poderá ultrapassá-lo
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
}
