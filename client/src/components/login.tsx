import { useState } from 'preact/hooks';

interface LoginProps {
  onLogin: (username: string, phoneNumber:string) => void;
}
export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState<string>();
  const [number, setNumber] = useState<string>();

  const onClick = () => {
    if (username && number) {
      onLogin(username, number);
    }
  };

  return (
    <div class="card">
      <input class='input' type='text' placeholder='Enter a username' value={username} onInput={e => setUsername((e.target as any).value)} />
      <input class='input' type='text' placeholder='Enter a phone number' value={number} onInput={e => setNumber((e.target as any).value)} />
      <button class='btn' onClick={onClick}>Login as {username} answering calls from {number} </button>
    </div>
  );
};
