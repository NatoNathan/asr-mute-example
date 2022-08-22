import { useCallback, useEffect, useState } from 'preact/hooks';
import './app.css';
import NexmoClient from 'nexmo-client';
import vonageLogo from './assets/VonageLogo_Primary_White.svg';
import { useAuth, useNexmoClient, useUser } from './hooks';
import { Call } from './components/call';



interface LoginProps {
  onLogin: (username: string) => void
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState();

  const onClick = () => {
    if (username) {
      onLogin(username);
    }
  }

  return (
    <div class="card">
      <input class='input' type='text' placeholder='Enter a username' value={username} onInput={e => setUsername((e.target as any).value)} />
      <button class='btn' onClick={onClick}>Login as {username}</button>
    </div>
  );
};



export function App() {
  const { login, token, username, isLoginLoading } = useAuth();
  const { user } = useUser(username);
  const { app } = useNexmoClient(token);
  const [incommingCall, setIncommingCall] = useState<any>();

  useEffect(() => {
    if (app) {
      app.on('member:call', (member: any, call: any) => {
        console.log(member);
        setIncommingCall(call);
      })
    }
  }, [app])



  return (
    <>
      <img class='logo' src={vonageLogo} />
      <h2>Conversation API Example Preact and Vite </h2>
      {!token && <Login onLogin={login} />}
      {user && <h3>{user.name}</h3>}
      {incommingCall && 
      <Call caller='test' 
      onAnswer={() => incommingCall.answer()} 
      onHangup={async () => await incommingCall.hangUp()} status={incommingCall.status} />}
    </>
  )
}
