import { useEffect, useRef, useState } from "preact/hooks";
import useCall from "../hooks/useCall";

export const CallContainer = ({}) => {
    const {status, onAnswer, onHangup, onMute, from, muted} = useCall();

    if (status == 'answered') {
        return (
            <div class="call">
                <h1>{from?.display_name ?? 'test'}</h1>
                {muted && <h3>Muted</h3>}
                <button onClick={onHangup}>Hangup</button>
                <button class={muted?'muted':''} onClick={onMute}>Mute</button>
            </div>
        );
    }

    return (
        <div class="call">
            <h1>{from?.name}</h1>
            <button onClick={onAnswer}>Answer</button>
        </div>
    )

};