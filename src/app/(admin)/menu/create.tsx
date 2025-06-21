import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import { useColorScheme } from '@/components/useColorScheme';
import { defaultPizzaImage } from '@/components/ProductListItem';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct
} from '@/api/products';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

const CreateProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { id } = useLocalSearchParams();
  const isUpdating = !!id;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  // na montagem, carregue as informações iniciais do produto para edição
  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64'
    });

    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }

    if (error) {
      Alert.alert(error.message);
      return;
    }
  };

  const pickImage = async () => {
    // Nenhuma solicitação de permissão é necessária para iniciar a biblioteca de imagens
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const resetFields = () => {
    setPrice('');
    setName('');
  };

  const validateInput = () => {
    setErrors('');

    if (!name) {
      setErrors('Nome obrigatório.');
      return false;
    }

    if (!price) {
      setErrors('Valor obrigatório.');
      return false;
    }

    if (isNaN(parseFloat(price))) {
      setErrors('O valor deve ser numérico.');
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
      return;
    }

    // adiciona
    onCreate();
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    //Atualiza no banco
    const updatedProduct = {
      id,
      name,
      price: parseFloat(price),
      image: imagePath
    };

    updateProduct(updatedProduct, {
      onSuccess: () => {
        resetFields();
        router.back();
      }
    });
  };

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    //Salva no banco
    const newProduct = {
      name,
      price: parseFloat(price),
      image: imagePath
    };

    insertProduct(newProduct, {
      onSuccess: () => {
        resetFields();
        router.back();
      }
    });
    resetFields();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja excluir este produto?',
      [
        {
          text: 'Cancelar'
        },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: onDelete
        }
      ]
    );
  };

  const onDelete = () => {
    // loading
    setIsDeleting(true);

    deleteProduct(id, {
      onSuccess: () => {
        resetFields();

        //não redefinimos setIsDeleting porque ele navegará para algum lugar
        console.warn('roteamento para (admin) após exclusão!');
        router.replace('/(admin)');
      },
      onError: () => {
        setIsDeleting(false);
        Alert.alert('Erro ao excluir item.');
      }
    });
  };

  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text;
  const bgColor = Colors[colorScheme ?? 'light'].text;

  if (isDeleting) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: 'center' }}
      ></ActivityIndicator>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? 'Atualizar' : 'Adicionar' }}
      />

      {/* Pizza Image and select txt */}
      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text
        onPress={pickImage}
        style={[styles.textButton, { color: textColor }]}
      >
        Selecione a Imagem
      </Text>

      {/* Name */}
      <Text style={[styles.label, { color: textColor }]}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: bgColor }]}
        placeholder="Nome"
      ></TextInput>

      {/* Name */}
      <Text style={[styles.label, { color: textColor }]}>Preço</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={[styles.input, { backgroundColor: bgColor }]}
        placeholder="$14.00"
        keyboardType="numeric"
      ></TextInput>

      <Text style={{ color: 'red', borderRadius: 14 }}>{errors}</Text>
      <Button
        onPress={onSubmit}
        text={isUpdating ? 'Atualizar' : 'Adicionar'}
      />
      {isUpdating ? (
        <Text
          style={[styles.textButton, { color: 'red' }]}
          onPress={confirmDelete}
        >
          Deletar Produto
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  label: {
    fontSize: 16
  },
  input: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    color: 'white'
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginVertical: 10
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center'
  }
});

export default CreateProductScreen;
