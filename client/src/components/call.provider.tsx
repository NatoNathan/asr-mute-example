
import { Vonage } from "@nexmoinc/voice-sdk/dist/kotlin/clientsdk-core_js";
import { useState, useEffect, useCallback, useMemo } from "preact/hooks";
import { Call, CallContext, ICallContext, Invite } from "../hooks/useCall";
import { useNewSDK } from "../hooks/useNewSdk";

export const CallProvider = ({ children, token }: any) => {
    const { app } = useNewSDK(token);
    const [invite, setInvite] = useState<Invite>();
    const [call, setCall] = useState<Call>();
    const [muted, setMuted] = useState<boolean>(false);

    const setNewCall = (newCall?:Vonage.VoiceCallJS) => newCall && setCall({
        mute: newCall.mute,
        unmute: newCall.unmute,
        say: newCall.say,
        async hangup(){
            await newCall.hangup();
            setCall(undefined);
        }
    });

    const startCall = async (to:string, type: 'app'| 'phone') => {
        const newCall = await app?.serverCall({
            to, type
        });
        setNewCall(newCall);
    };

    useEffect(() => {
        if (app) {
            app.on('callInvite', async (callInvite) => {
                // console.dir(callInvite);
                setInvite({
                    async answerCall() {
                        const newCall = await callInvite.answerCall();
                        setNewCall(newCall);
                        setInvite(undefined);
                    },
                    async rejectCall(){
                        await callInvite.rejectCall();
                        setInvite(undefined);
                    }
                });
            });
        }
    }, [app]);


    useEffect(() => {
        if (app && call) {
            app.on('mute', (legId: string, isMuted: boolean) => {
                // TODO: check if leg is local leg
                if (true) {
                    setMuted(isMuted);
                }
            })
        }
    }, [app, call]);

    return (
        <CallContext.Provider value={{ call: call, invite: invite, muted, startCall }}>
            { token && children}
        </CallContext.Provider>
    );
};

export default CallProvider;