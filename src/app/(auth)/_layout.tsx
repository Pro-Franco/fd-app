import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {

  const { session } = useAuth();


  // use router to redirect to home 
  if (session) {
    return <Redirect href={'/'} />;
  }

  return <Stack />;
};