import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useInsertOrderSubscription = () => {
  const queryClient = useQueryClient();

  // This allows for 'real-time changes to appear on the screen if an order is placed behind the scenes.
  useEffect(() => {
    const orderSub = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Change received!', payload);

          // invalidated queries will refetch
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe();

    // unsub to prevent memory leak
    return () => {
      orderSub.unsubscribe();
    };
  }, []);
};

export const useUpdateOrderSubscription = (idString: string | string[]) => {
  const id =
    parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
  const queryClient = useQueryClient();
  useEffect(() => {
    const orders = supabase
      .channel('custom-filter-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        (_payload) => {
          queryClient.invalidateQueries({ queryKey: ['orders', id] });
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);
};