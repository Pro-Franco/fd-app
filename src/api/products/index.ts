import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useProductList = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });
};

export const useProduct = (idString: string | string[]) => {
  const id =
    parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } =
        await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });
};

export const useInsertProduct = () => {

  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newProduct } = await supabase.from('products').insert({
        name: data.name,
        image: data.image,
        price: data.price,
      }).single();

      if (error) {
        throw new Error(error.message);
      }

      return newProduct;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },

    onError(error) {
      console.log("error creating: ", error);
    }
  });
};

export const useUpdateProduct = () => {

  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: updatedProduct } = await supabase.from('products').update({
        name: data.name,
        image: data.image,
        price: parseFloat(data.price),
      }).eq('id', data.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return updatedProduct;
    },

    async onSuccess(_, data) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['products', data.id] });
    },

    onError(error) {
      console.log("error updating: ", error);
    }
  });
};

export const useDeleteProduct = () => {

  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(idString: string | string[]) {
      const id =
        parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};