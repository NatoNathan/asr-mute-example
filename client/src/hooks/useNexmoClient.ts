import { useEffect, useState } from "preact/hooks";
import NexmoClient from "nexmo-client";


export const useNexmoClient = (token?: string) => {
  const [app, setApp] = useState<Application>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (token) {
      const nexmo = new NexmoClient().createSession(token)
        .then(app => {
          setApp(app);
        })
        .catch(err => setError(err));
    }
  }, [setApp, setError, token]);

  return {
    app,
    appError: error,
    isAppLoading: !app || !error,
  };
};
