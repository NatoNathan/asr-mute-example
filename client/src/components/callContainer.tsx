import { useEffect, useRef, useState } from "preact/hooks";
import useCall from "../hooks/useCall";

export const CallContainer = ({}) => {
    const {call, invite, startCall, muted} = useCall();
    const [callTo, setCallTo] = useState<string>();

    if (invite) return (
        <div class="card">
            <h3>Incomming Call</h3>
            <button onClick={invite.answerCall}>Answer</button>
            <button onClick={invite.rejectCall}>Reject</button>
        </div>
    )

    if (call) return (
        <div class="card">
            <h3>Ongoing Call</h3>
            <button onClick={async() => await call.hangup()}>hangup</button>
            {!muted && <button onClick={async() => await call.mute}>Mute</button>}
            {muted && <button onClick={async() => await call.unmute}>Unmute</button>}

        </div>
    )

    const onStartAppCall = async () => {
        if (startCall && callTo) await startCall(callTo,'app');
    }

    return (
        <div class="card">
            <input class="input" type="text" value={callTo} onInput={(e: any)=>setCallTo(e.target.value)} />
            <button onClick={onStartAppCall }>Start Call</button>
        </div>
    )

};