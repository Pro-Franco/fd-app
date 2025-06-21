import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { InsertTables, UpdateTables } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived
    ? ['Entregue']
    : ['Nova', 'Preparando', 'Entregando'];

  return useQuery({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', statuses)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });
};

export const useMyOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['orders', { userId: id }],
    queryFn: async () => {
      // should not be null if accessing this page
      if (!id) {
        return null;
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });
};

export const useOrderDetails = (idString: string | string[]) => {
  const id = parseFloat(
    typeof idString === 'string' ? idString : idString?.[0]
  );
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        // .select('*')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();

  const { session } = useAuth();

  const userId = session?.user.id;
  console.log('User ID:', userId);

  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const { error, data: newOrder } = await supabase
        .from('orders')
        .insert({ ...data, user_id: userId })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return newOrder;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },

    onError(error) {
      console.log('error creating an order: ', error);
    }
  });
};

// god this mutation looks ugly as sin
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      idString,
      newFields
    }: {
      idString: string | string[];
      newFields: UpdateTables<'orders'>;
    }) {
      const id = parseFloat(
        typeof idString === 'string' ? idString : idString?.[0]
      );
      const { error, data: updatedOrder } = await supabase
        .from('orders')
        .update(newFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return updatedOrder;
    },

    async onSuccess(_, { idString }) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orders', idString] });
    },

    onError(error) {
      console.log('error updating: ', error);
    }
  });
};
