import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <Link href="/">Home</Link>
      <Link href="/home">Home</Link>
      <Link href="/status">Status</Link>
    </footer>
  );
}
