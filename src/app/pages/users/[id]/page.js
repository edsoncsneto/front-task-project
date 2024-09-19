"use client"

import styles from "../../../page.module.css";
import { useParams } from 'next/navigation';

export default async function Users() {
  const params = useParams();
  let get = await getData(params.id);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Detalhes do usuário de ID: {params.id}</h1>
        <ul>
          {
            <><li>{get.name}</li><li>{get.email}</li></>
          }
        </ul>
      </main>
    </div>
  );
}

async function getData(id) {
  return await (await fetch(`http://localhost:3000/appuser/${id}`)).json();
}
