import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

interface Profile {
  id: string;
  group: 'ADMIN' | 'USER';
}

type AuthData = {
  session: Session | null;
  profile: Profile | null;
  sessionLoading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  sessionLoading: true,
  isAdmin: false
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data || null);
      }
      console.log('profile', profile); // Verifique o que é retornado
      console.log('group', profile?.group);

      setSessionLoading(false);
    };

    fetchSession();

    // ao montar o aplicativo, inscreva-se uma vez para que o supabase altere a sessão.
    // quando um estado de autenticação muda, defina a sessão
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        sessionLoading,
        profile,
        isAdmin: profile?.group === 'ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
