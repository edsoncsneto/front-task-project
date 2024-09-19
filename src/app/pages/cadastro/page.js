"use client"

import { useState } from 'react';
import Link from 'next/link';
import styles from "@/styles/Login.module.css";
import LoginCard from "@/components/loginCard/loginCard";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
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
      const response = await fetch('http://localhost:3000/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  // Adiciona o cabeçalho
        },
        body: JSON.stringify(formData)
      })
      const json = await response.json();
      console.log(json);

      if(response.status === 409) {
        setError('Email já registrado!');
      }
      setCookie('authorization', json);
      router.push('./users');
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <div className={styles.background}>
      <LoginCard title="Crie sua conta">
      <form onSubmit={handleForm} className={styles.form}>
          <Input type="text" placeholder="seu nome" required value={formData.name} onChange={(e) => {handleFormEdit(e, 'name')}}/>
          <Input type="email" placeholder="seu email" required value={formData.email} onChange={(e) => {handleFormEdit(e, 'email')}}/>
          <Input type="password" placeholder="sua senha" required value={formData.password} onChange={(e) => {handleFormEdit(e, 'password')}}/>
          <Button>CADASTRAR</Button>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <Link href='./login'>Já possui conta? LogIn</Link>
        </form>
      </LoginCard>
    </div>
  );
}
