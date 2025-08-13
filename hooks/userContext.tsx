// import { ID } from "react-native-appwrite";
// import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
// import { account } from "@/lib/appwrite";

// const UserContext = createContext<null | any>(null)

// export function useUser() {
//   return useContext(UserContext);
// }

// // interface uProvider {
// //   value: {
// //     current: {
// //       user: any
// //       register: any
// //       logout: any
// //       login: any
// //     }
// //   }
// // }

// export function UserProvider(props:uProvider) {
//   const [user, setUser] = useState< null|any>(null);

//   async function login(email:string, password:string) {
//     const loggedIn = await account.createEmailPasswordSession(email, password);
//     setUser(loggedIn);
//   }

//   async function logout() {
//     await account.deleteSession("current");
//     setUser(null);
    
//   }

//   async function register(email:string, password:string) {
//     await account.create(ID.unique(), email, password);
//     await login(email, password);
//   }

//   async function init() {
//     try {
//       const loggedIn = await account.get();
//       setUser(loggedIn);
//     } catch (err) {
//       setUser(null);
//     }
//   }

//   useEffect(() => {
//     init();
//   }, []);

//   return (
//     <UserContext.Provider value={{current: user, login, logout, register }}>
//       {props.children}
//     </UserContext.Provider>
//   )
// }

import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";

const UserContext = createContext<null | any>(null);

export function useUser() {
  return useContext(UserContext);
}

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  const getCurrentTime = () => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
  };

  async function login(email: string, password: string) {
    try {
      const timestamp = getCurrentTime();
      console.log(` [${timestamp}] Attempting login with email:`, email);
      
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      
      setUser(userData);
      console.log(` [${timestamp}] Login successful for:`, userData.email);
      console.log(` [${timestamp}] User data set in context:`, userData.$id);
      
      return userData;
    } catch (error: any) {
      const timestamp = getCurrentTime();
      console.error(` [${timestamp}] Login error:`, error.message || error);
      throw error;
    }
  }

  async function logout() {
    try {
      const timestamp = getCurrentTime();
      await account.deleteSession("current");
      setUser(null);
      console.log(`[${timestamp}] Logout successful`);
    } catch (error: any) {
      const timestamp = getCurrentTime();
      console.error(` [${timestamp}] Logout error:`, error.message || error);
      throw error;
    }
  }

  async function register(email: string, password: string) {
    try {
      const timestamp = getCurrentTime();
      console.log(` [${timestamp}] Attempting registration with:`, email);
      
      await account.create(ID.unique(), email, password);
      return await login(email, password);
    } catch (error: any) {
      const timestamp = getCurrentTime();
      console.error(` [${timestamp}] Register error:`, error.message || error);
      throw error;
    }
  }

  async function init() {
    try {
      const timestamp = getCurrentTime();
      console.log(` [${timestamp}] Checking for existing user session...`);
      
      setLoading(true);
      
      // Check if there's an existing session
      const loggedIn = await account.get();
      setUser(loggedIn);
      
      console.log(` [${timestamp}] Existing session found for:`, loggedIn.email);
      console.log(` [${timestamp}] User ID:`, loggedIn.$id);
      
    } catch (err: any) {
      const timestamp = getCurrentTime();
      console.log(` [${timestamp}] No existing session found`);
      console.log(` [${timestamp}] Next step: User needs to log in`);
      setUser(null);
    } finally {
      setLoading(false);
      console.log(` [${getCurrentTime()}] UserContext initialization complete`);
    }
  }

  useEffect(() => {
    console.log(` [${getCurrentTime()}] UserProvider mounted - starting initialization...`);
    init();
  }, []);

  // Log user state changes
  useEffect(() => {
    const timestamp = getCurrentTime();
    if (user) {
      console.log(` [${timestamp}] User state updated - logged in:`, user.email);
    } else {
      console.log(` [${timestamp}] User state updated - not logged in`);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{
      current: user,
      login,
      logout,
      register,
      loading,
      refresh: init
    }}>
      {children}
    </UserContext.Provider>
  );
}