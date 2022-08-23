import { useState } from 'preact/hooks';

interface LoginProps {
  onLogin: (username: string) => void;
}
export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState();

  const onClick = () => {
    if (username) {
      onLogin(username);
    }
  };

  return (
    <div class="card">
      <input class='input' type='text' placeholder='Enter a username' value={username} onInput={e => setUsername((e.target as any).value)} />
      <button class='btn' onClick={onClick}>Login as {username}</button>
    </div>
  );
};
