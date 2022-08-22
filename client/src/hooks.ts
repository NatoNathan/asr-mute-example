import { useEffect, useState } from "preact/hooks";
import NexmoClient, { Application } from "nexmo-client";

export const useAuth = () => {
    const [token, setToken] = useState<string>();
    const [user, setUser] = useState<string>();
    const [error, setError] = useState();
  
    const login = (username: string) => {
      fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: username
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
    }
};

export const useUser = (username?:string) => {
  const [user, setUser] = useState();
  const [error, setError] = useState();

  useEffect( () => {
    if (username) {
      fetch(`http://localhost:5001/api/user/${username}`)
        .then(res=> res.json().then(data=> {
          setUser(data);
        }))
        .catch(err => setError(err));
    }
  },[username, setUser, setError]);

  return {
    user,
    userError: error
  }
};

export const useNexmoClient = (token?:string) => {
    const [app, setApp] = useState<Application>();
    const [error, setError] = useState<Error>();

    useEffect(() => {
        if (token) {
            const nexmo = new NexmoClient().createSession(token)
                .then(app=>{
                    setApp(app);
                })
                .catch(err => setError(err));
        }
    }, [setApp, setError, token]);

    return {
        app,
        appError: error,
        isAppLoading: !app || !error,
    }
}