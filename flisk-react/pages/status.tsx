import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { getAccount } from '../components/api';
import Footer from '../components/footer';
import Header from '../components/header';
export default function Status() {
  useEffect(() => {
    getAccount('efc8d9b05c6e911fb38713c963eeb02a9989c036');
    getAccount('4c29eeab01aabed4b9260f7f0efd096c831c102c');
    getAccount('a4e48e7a9bbf0a90214273ae9deb1b8af44c2efa');
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Flisk App</title>
        <meta
          name="description"
          content="A Lisk based blockchain to manage financial assets, liabilities and reporting."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header></Header>
      <main className={styles.main}>
        <h1 className={styles.title}>Flisk App!</h1>

        <p className={styles.description}>
          <code className={styles.code}>
            A Lisk based blockchain to manage financial assets, liabilities and
            reporting.
          </code>
        </p>

        <div className={styles.grid}>
          <section className={styles.card}>
            <Link href="/accounts">
              <a>
                <h2>Show Accounts &rarr;</h2>
                <p>Show balances of accounts</p>
              </a>
            </Link>
          </section>

          <section className={styles.card}>
            <Link href="/accounts">
              <a>
                <h2>Show Accounts &rarr;</h2>
                <p>Show balances of accounts</p>
              </a>
            </Link>
          </section>
        </div>
      </main>

      <Footer></Footer>
    </div>
  );
}
