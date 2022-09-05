import './app.css';
import vonageLogo from './assets/VonageLogo_Primary_White.svg';
import CallProvider from './components/call.provider';
import { CallContainer } from './components/callContainer';
import { Login } from './components/login';
import { useAuth, useUser, useNexmoClient } from './hooks';

export function App() {
  const { login, token, username, isLoginLoading } = useAuth();
  const { user } = useUser(username);


  return (
    <>
      <img class='logo' src={vonageLogo} />
      <h2>Conversation API Example Preact and Vite </h2>
      {!token && <Login onLogin={login} />}
      {user && <h3>{user.name}</h3>}
      <CallProvider token={token}>
        <CallContainer />
      </CallProvider>
    </>
  )
}
