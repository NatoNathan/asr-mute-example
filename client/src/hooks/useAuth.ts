import { useState } from "preact/hooks";
import apiRequest from "../utils/apiClient";


export const useAuth = () => {
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<string>();
  const [error, setError] = useState();

  const login = (username: string, phoneNumber: string) => {
    apiRequest('api/auth/login', 'POST', {
      username: username,
      phoneNumber: phoneNumber
    })
      .then(res => res.json().then(data => {
        setToken(data.token);
        setUser(data.user);
      }))
      .catch(err => setError(err));
  };

  return {
    token,
    username: user,
    authError: error,
    isLoginLoading: !token || !error,
    login
  };
};
