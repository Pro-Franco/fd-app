/*import { supabase } from "@/lib/supabase";
import { InsertTables } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useInsertOrderItems = () => {

  return useMutation({
    async mutationFn(items: InsertTables<'order_items'>[]) {
      const { error, data: newOrder } = await supabase.from('order_items')
        .insert(items)
        .select()

      if (error) {
        throw new Error(error.message);
      }

      return newOrder;
    },

    onError(error) {
      console.log("error creating order items: ", error);
    }
  });
};*/

import { supabase } from '@/lib/supabase';
import { InsertTables } from '@/types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

// Definição do tipo correto para os itens do pedido
type OrderItem = InsertTables<'order_items'>;

export const useInsertOrderItems = (): UseMutationResult<
  OrderItem[], // Tipo do dado retornado na mutação (lista de OrderItems)
  Error, // Tipo de erro que pode ocorrer
  OrderItem[], // Tipo do dado esperado como input
  unknown // Contexto (não utilizado, então deixamos como unknown)
> => {
  return useMutation({
    mutationFn: async (items: OrderItem[]): Promise<OrderItem[]> => {
      const { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data ?? []; // Retorna um array vazio caso `data` seja `null`
    },

    onError: (error: Error) => {
      console.error('Erro ao criar itens do pedido:', error);
    }
  });
};
