import { useEffect, useRef, useState } from "preact/hooks";

export interface CallProps {
    caller: string,
    status: string,
    onMute?: () => void,
    onHangup?: () => void,
    onAnswer: () => void,
}

export const Call = ({caller, status, onAnswer, onHangup, onMute  }: CallProps) => {

    return (
    <div class="call">
        <h1>{caller}</h1>
        <h3>{status}</h3>
        <button onClick={onAnswer}>Answer</button>
        <button onClick={onHangup}>Hangup</button>
        <button onClick={onMute}>Mute</button> 
    </div>);

};