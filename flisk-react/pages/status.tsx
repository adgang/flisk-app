import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react'
import { getAccount } from '../components/api'
export default function Status() {

  useEffect(() => {
    getAccount('efc8d9b05c6e911fb38713c963eeb02a9989c036')
    getAccount('4c29eeab01aabed4b9260f7f0efd096c831c102c')
    getAccount('a4e48e7a9bbf0a90214273ae9deb1b8af44c2efa')
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>Flisk App</title>
        <meta name="description" content="A Lisk based blockchain to manage financial assets, liabilities and reporting." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Flisk App!
        </h1>

        <p className={styles.description}>
          <code className={styles.code}>A Lisk based blockchain to manage financial assets, liabilities and reporting.</code>
        </p>

        <div className={styles.grid}>
          <span className={styles.card}>
            <h2>Get Accounts &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </span>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div >
  )
}
