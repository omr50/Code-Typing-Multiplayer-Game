import { ReactNode, createContext, useEffect } from "react";
import { useContext} from "react";
import { useState } from "react";
import { apiClient } from "../../api/apiClient";
import { executeJwtAuthenticationService } from "./AuthenticationApiService";
// 1. create context
type IAuth = {
  isAuthenticated: boolean;
  successfulSignup: boolean;
  login:(username: String, password: String) => Promise<boolean>;
  setSignup: (value: boolean) => void;
  logout: () => void;
  username: String | null;
  token: String | null;
};
interface Props {
  children: ReactNode
}
const AuthContext = createContext<IAuth>(null!)

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: Props) {

    const [isAuthenticated, setAuthenticated] = useState(false)
    const [username, setUsername] = useState<String | null>(null)
    const [token, setToken] = useState<String | null>(null)
    const [myInterceptor, setMyInterceptor] = useState(null)
    const [successfulSignup, setSuccessfulSignup] = useState<boolean>(false)

    function setSignup(value: boolean) {
      setSuccessfulSignup(value);
  }

    async function login(username: String, password: String) {
        try {
        const response = await executeJwtAuthenticationService(username, password)
        if (response.status == 200){
            const jwtToken = 'Bearer ' + response.data.token;
            setAuthenticated(true)
            setUsername(username)
            setToken(jwtToken)
            console.log("Recieved the JWT Token:", jwtToken)

            // adds token to each subsequent request without having to
            // keep manually adding it.
            const myInterceptor = apiClient.interceptors.request.use(
                (config) => {
                    console.log('Intercepting and adding a token')
                    config.headers.Authorization=jwtToken
                    return config
                }
            )
            return true
        } else {
            logout()
            return false
        }
    } catch (error) {
        logout()
        return false

    }
    }

    function logout() {
        setAuthenticated(false);
        setToken(null)
        setUsername(null)
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout, username, token, successfulSignup, setSignup}}>
            {children}
        </AuthContext.Provider>
    )
}

// Use auth provider as a paraent and wrap all of the elements
// that you want your context to be able to give data to.