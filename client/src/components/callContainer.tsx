import { useEffect, useRef, useState } from "preact/hooks";

export interface CallProps {
    caller: string,
    status: string,
    onMute?: () => void,
    onHangup?: () => void,
    onAnswer: () => void,
}

export const CallContainer = ({ caller, status, onAnswer, onHangup, onMute }: CallProps) => {

    if (status == 'answered') {
        return (
            <div class="call">
                <h1>{caller}</h1>
                <button onClick={onHangup}>Hangup</button>
                <button onClick={onMute}>Mute</button>
            </div>
        );
    }

    return (
        <div class="call">
            <h1>{caller}</h1>
            <button onClick={onAnswer}>Answer</button>
        </div>
    )

};