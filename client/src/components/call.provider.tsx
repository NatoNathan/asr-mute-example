
import { Invite } from "nexmo-client";
import { useState, useEffect, useCallback, useMemo } from "preact/hooks";
import { useAuth, useUser, useNexmoClient } from "../hooks";
import { CallContext, ICallContext } from "../hooks/useCall";
import { useNewSDK } from "../hooks/useNewSdk";

export const CallProvider = ({ children, token }: any) => {
    const { app } = useNewSDK(token);

    const [status, setStatus] = useState<string | null>(null);
    const [invite , setInvite ] = useState< Invite| null>(null);
    const [call, setCall] = useState<any>(null);
    const [muted, setMuted] = useState<boolean>(false);
    const [from, setFrom] = useState<any | null>(null);


    useEffect(() => {
        if (app) {
            app.on('callInvite', async (callInvite) => {
                // console.dir(callInvite);
                setInvite(callInvite);
            });

            app.on('connectionChange', (status, p) => {
                console.error(status);
                setStatus(status);

                if (status == 'completed') {
                    setInvite(null);
                    setFrom(null);
                }
            });
        }
    }, [app]);

    const onAnswer = useCallback(async ()=> {
        setCall(await invite?.answerCall());
    }, [invite]);
    const onReject = useCallback(async ()=> setInvite(await invite?.rejectCall()??null), [invite]);
    const onHangup = useCallback(async ()=> setCall(await call.hangup()??null), [call]);
    const onMute = useCallback(async ()=> setMuted(call.mute() && true), [call]);

    const value = useMemo(() => ({ onAnswer, from, onHangup, onMute, onReject, status, muted }), [onAnswer, from, onHangup, onMute, onReject, status, muted]);

    return (
        <CallContext.Provider value={value}>
            {invite && children}
        </CallContext.Provider>
    );
};

export default CallProvider;