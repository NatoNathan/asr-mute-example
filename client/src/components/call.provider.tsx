import { Member, NXMCall, NXMEvent } from "nexmo-client";
import { useState, useEffect, useCallback, useMemo } from "preact/hooks";
import { useAuth, useUser, useNexmoClient } from "../hooks";
import { CallContext, ICallContext } from "../hooks/useCall";

export const CallProvider = ({ children, token }: any) => {
    const { app } = useNexmoClient(token);

    const [status, setStatus] = useState<string | null>(null);
    const [call, setCall] = useState<NXMCall | null>(null);
    const [muted, setMuted] = useState<boolean>(false);
    const [from, setFrom] = useState<Member|null>(null);


    useEffect(() => {
        if (app) {
            app.on('member:call', (member: Member, call: NXMCall) => {
                setCall(call);
                setFrom(member);
            });

            app.on('call:status:changed', (call: NXMCall) => {
                setStatus(call.status);

                if (call.status == 'completed') {
                    setCall(null);
                    setFrom(null);
                }
            });
        }
    }, [app]);

    useEffect(()=>{
        if (call) {
            call.conversation.on('audio:mute:on', (member:Member, event:NXMEvent ) => {
                if (call.conversation.me == member) {
                    setMuted(true);
                }
            });

            call.conversation.on('audio:mute:off', (member:Member, event:NXMEvent ) => {
                console.log(member, event);
                if (call.conversation.me == member) {
                    setMuted(false);
                }
            });
        }
    }, [call]);

    const onAnswer = useCallback(()=>{
        if (call) {
            call.answer();
        }
    }, [call]);

    const onHangup = useCallback(() => {
        if (call) {
            call.hangUp();
        }
    }, [call]);

    const onMute = useCallback(()=> {
        if (call) {
            call.conversation.me.mute(!muted);
        }
    }, [call, muted]);

    const onReject = useCallback(()=> {
        if (call) {
            call.reject();
        }
    }, [call]);

    const value = useMemo(()=> ({onAnswer, from, onHangup, onMute, onReject, status, muted }),[onAnswer, from, onHangup, onMute, onReject, status, muted]);

    return (
        <CallContext.Provider value={value}>
            {call && children}
        </CallContext.Provider>
    );
};

export default CallProvider;