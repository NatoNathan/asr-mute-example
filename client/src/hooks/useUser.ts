import { useEffect, useState } from "preact/hooks";
import apiRequest from "../utils/apiClient";

type User = {
  name: string
}

export const useUser = (username?:string): {user?:User, userError?:Error} => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<Error>();

  useEffect( () => {
    if (username) {
      apiRequest(`api/user/${username}`)
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

