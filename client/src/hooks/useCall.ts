import { Application, Member } from "nexmo-client";
import { createContext } from "preact";
import { useContext } from "preact/hooks";


type cb = () => void;

export interface ICallContext {
    from: Member | null;
    status: string | null;
    muted: boolean;
    onAnswer: cb;
    onReject?: cb;
    onHangup?: cb;
    onMute?: cb;

}

export const CallContext = createContext<ICallContext>({
    from: null, status: null, muted:false, onAnswer: ()=> {}
});

export const useCall = () => useContext(CallContext);

export default useCall;

