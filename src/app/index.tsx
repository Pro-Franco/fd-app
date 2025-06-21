import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import Button from '../components/Button';
import { Link, Redirect, router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import FancyLoading from '@/components/FancyLoading';

const index = () => {
  const { session, sessionLoading, isAdmin } = useAuth();

  console.log('isAdmin', isAdmin);

  if (sessionLoading) {
    //return <ActivityIndicator />;
    return <FancyLoading />;
  }

  if (!session) {
    return <Redirect href={'/sign-in'} />;
  }

  if (!isAdmin) {
    return <Redirect href={'/(user)'} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href={'/(user)'} asChild>
        <Button text="User" />
      </Link>
      <Link href={'/(admin)'} asChild>
        <Button text="Admin" />
      </Link>

      <Button onPress={() => supabase.auth.signOut()} text="Sign Out" />
    </View>
  );
};

export default index;
