import { Vonage } from "@nexmoinc/voice-sdk/dist/kotlin/clientsdk-core_js";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

type cb = () => any | Promise<any>;

export type Invite = {
    answerCall:cb;
    rejectCall:cb;
}

export type Call = {
    mute: cb;
    unmute: cb;
    hangup: cb;
    say: (params: any) => any | Promise<any>;
}

export interface ICallContext {
    call?: Call;
    invite?: Invite;
    muted?: boolean;
    
    startCall?: (to:string, type: 'app'| 'phone')=>Promise<void>;
}

export const CallContext = createContext<ICallContext>({});

export const useCall = () => useContext(CallContext);

export default useCall;

