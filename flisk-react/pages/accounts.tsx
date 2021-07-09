import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { getAccount } from '../components/api';
import Footer from '../components/footer';
import Header from '../components/header';
export default function Accounts() {
  const addresses = [
    'efc8d9b05c6e911fb38713c963eeb02a9989c036',
    '4c29eeab01aabed4b9260f7f0efd096c831c102c',
    'a4e48e7a9bbf0a90214273ae9deb1b8af44c2efa',
  ];

  const [accountsState, setAccountsState] = useState<unknown[]>([]);
  const [mountedState, setMountedState] = useState(false);
  useEffect(() => {
    if (!mountedState) {
      getAccounts();
    }
  }, [mountedState]);

  async function getAccounts() {
    const promises = Promise.all(addresses.map((a) => getAccount(a)));
    const accounts = await promises;
    setMountedState(true);
    setAccountsState(accounts);
  }

  function AccountsView(accounts: any) {
    return (
      <div className={styles.grid}>
        {accountsState.map((acc, i) => (
          <AccountCard
            key={addresses[i] + '-card'}
            account={{ rawAddress: addresses[i], ...(acc as Object) }}
          ></AccountCard>
        ))}
      </div>
    );
  }

  function AccountCard({ account }: any) {
    console.log(account);
    return (
      <section className={styles.card}>
        <Link href="/accounts">
          <a>
            <h5>{account.rawAddress} &rarr;</h5>
            <p>Balance: {account.token.balance.toString()}</p>
            <p>Nonce: {account.sequence.nonce.toString()}</p>
            <p>Delegate: {account.dpos.delegate?.username.toString()}</p>
          </a>
        </Link>
      </section>
    );
  }

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
          <code className={styles.code}>All accounts</code>
        </p>
        <AccountsView></AccountsView>
      </main>

      <Footer></Footer>
    </div>
  );
}
