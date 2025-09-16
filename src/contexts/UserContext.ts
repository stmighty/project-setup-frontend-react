import { createContext } from 'react';
import { User } from 'firebase/auth';
import { UserData } from '@/types/user';

interface userContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
}

export const UserContext = createContext<userContextType>({
  user: null,
  userData: null,
  isLoading: true,
  error: null,
});