import { createContext, useEffect, useReducer, useCallback } from 'react';
import axios1 from 'axios';
// utils
import axios from '../utils/axios';
//
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';
import { User } from 'src/utils/types';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialize = useCallback(async () => {
    try {
      const accessToken =  localStorage.getItem('accessToken') ;

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        
        const response = await axios.get('/api/user/profile', {headers: {Authorization: 'Bearer ' + accessToken}});
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user: response.data,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = async (username: string, password: string) => {

    const response = await axios.post('api/login', {
      username,
      password,
    },{headers:{ "Content-Type": "application/x-www-form-urlencoded" }}
    );
   
    const { access_token ,user} = response.data;

    setSession(access_token);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  };

  // REGISTER
  const register = async (email: string, password: string, name: string, username: string) => {
  
    const response = await axios.post('/api/user/save', {
      email,
      password,
      name,
      username,
    });

    const {user} = response.data;

    dispatch({
      type: Types.REGISTER,
      payload: {
        user,
      },
    });
   
  };

  // LOGOUT
  const logout = async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  };


  const resetPassword =  async (email:String)=>{
     await axios.post('/api/user/resetPassword?clientLink=http://localhost:3000', { email });
  }
  const newPassword = async(password: string,token: string)=>{
    await axios.post('/api/user/savePassword?token='+token , { newPassword :password });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        register,
        resetPassword,
        newPassword,
        loginWithGoogle: () => {},
        loginWithGithub: () => {},
        loginWithTwitter: () => {},
        logout,
       
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
