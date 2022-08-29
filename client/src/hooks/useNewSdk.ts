import { useEffect, useState } from "preact/hooks";
import NexmoClient from 'nexmo-client';

export const useNewSDK = (token?: string) => {
    const [app, setApp] = useState<NexmoClient>();
    const [error, setError] = useState<Error>();

    useEffect(() => {
        if (token) {
            try {
                const nexmo = new NexmoClient();
                nexmo.setConfig('https://api.nexmo.com', 'wss://ws.nexmo.com');
                nexmo.sessionLogin(token);
                setApp(nexmo);
            } catch (e: any) {
                setError(e);
            }
        }
    }, [setApp, setError, token]);

    useEffect(() => {
        if (app) {
            app.on('sessionNew', (id: string, user: string) => {
                console.log(`User: ${user}, has logged in`);
            })
        }
    }, [app]);

    return {
        app,
        appError: error,
        isAppLoading: !app || !error,
    };
};
