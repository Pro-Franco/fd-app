import { ActivityIndicator, FlatList, Text, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import ProductListItem from '@/components/ProductListItem';
import { useProductList } from '@/api/products';
import FancyLoading from '@/components/FancyLoading';

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();
  //<ActivityIndicator size="large" color="#6200ea" />

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <FancyLoading />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Falha ao carregar produtos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width: '100%',
    backgroundColor: '#f4f4f4',
    padding: 5
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  },
  listContainer: {
    gap: 10,
    padding: 10,
    borderRadius: 14
  },
  columnWrapper: {
    gap: 10
  }
});
