"use client"

import { useState } from 'react';
import Link from 'next/link';
import styles from "@/styles/Login.module.css";
import LoginCard from "@/components/loginCard/loginCard";
import Modal from "@/components/modal/modal"
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

  setCookie('authorization', 'unauthorized');
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('');

  const handleFormEdit = (event, name) => {
    setFormData({
      ...formData,
      [name]: event.target.value})
  }

  const handleForm = async (event) => {
    try {
      event.preventDefault();
      console.log(JSON.stringify(formData));
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const json = await response.json();
      console.log(response.status)

      if (response.status === 401) {
        setError('Usuário não encontrado');
      } else if (response.status ===201) {
        setCookie('authorization', json.token);
        router.push('./users');
      }
    } catch (e) {
      setError(e.message)
    }
    
  }

  return (
    <div className={styles.background}>
      <LoginCard title="Entre em sua conta">
        <form className={styles.form} onSubmit={handleForm}>
          <Input type="email" placeholder="seu email" required value={formData.email} onFocus={() => setError('')} onChange={(e) => {handleFormEdit(e, 'email')}} />
          <Input type="password" placeholder="sua senha" required value={formData.password} onChange={(e) => {handleFormEdit(e, 'password')}}/>
          <Button>ENTRAR</Button>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <Link href='./cadastro'>Não possui conta? Crie</Link>
        </form>
      </LoginCard>
    </div>
  );
}
