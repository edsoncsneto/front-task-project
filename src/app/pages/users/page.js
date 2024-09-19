import styles from "../../page.module.css";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from "next/server";

async function getData() {
  const response = await fetch('http://localhost:3000/appuser');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export default async function Users() {

  let bodyReqValidate = {"token": "void"};
  const cookieStore = cookies()
  const authToken = cookieStore.get('authorization')
  let redirectPath = ''
  if (authToken) {
    bodyReqValidate = {"token": authToken.value}
  }
  
  try{
    const responseAuth = await fetch('http://localhost:3000/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyReqValidate)
    })
    
    if (responseAuth.status === 401 || responseAuth.status === 400) {
      console.log('negado');
      redirectPath = './login'
    } else if (responseAuth.status === 201) {
      let users = [];
      try {
        users = await getData();
      } catch (error) {
        console.error('Error fetching users:', error);
        return (
          <div className={styles.page}>
            <main className={styles.main}>
              <h1>Erro ao carregar os usuários.</h1>
            </main>
          </div>
        );
      }

      return (
        <div className={styles.page}>
          <main className={styles.main}>
            <h1>Detalhes dos usuários</h1>
            <ul>
              {
                users.length > 0
                  ? users.map(u => (
                    <li key={u.id}>
                      <div>{u.id}</div>
                      <div>{u.name}</div>
                      <div>{u.email}</div>
                    </li>
                  ))
                  : <p>Nenhum usuário encontrado.</p>
              }
            </ul>
          </main>
        </div>
      );
      
    }
  } catch (e) {
    console.log(e.message)
  } finally {
    if (redirectPath === './login')
      redirect(redirectPath)
}

}
