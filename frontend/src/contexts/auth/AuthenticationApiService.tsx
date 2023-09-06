import { apiClient } from "../../api/apiClient"
// export const executeBasicAuthenticationService = (token)=> apiClient.get(`/login`, {
//     headers: {
//         Authorization: token
//     }
// })

export const executeJwtAuthenticationService = async (username: String, password: String)=> {
  console.log('sending request with:', {username, password})
  return await apiClient.post(`/user/login`, {username, password})
}

export const signUpService = (username: string, email: string, password: string)=> apiClient.post(`/user/signup`, {email, username, password})