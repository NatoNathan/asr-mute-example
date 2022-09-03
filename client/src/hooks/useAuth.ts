import { useState } from "preact/hooks";


export const useAuth = () => {
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<string>();
  const [error, setError] = useState();

  const login = (username: string, phoneNumber: string) => {
    fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        phoneNumber: phoneNumber
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
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
