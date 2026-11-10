"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "../lib/api/auth";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    getMe()
      .then(() => {
        if (active) router.replace("/events");
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>happning</Link>
        <div className={styles.navLinks}>
          <Link href="/signin">Sign in</Link>
          <Link href="/signup" className={styles.navButton}>Create account</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Find your next moment</p>
        <h1>Good things happen when we show up.</h1>
        <p className={styles.heroText}>
          Discover events, meet people, and make something worth remembering.
        </p>
        <Link href="/signup" className={styles.primaryButton}>Get started</Link>
      </section>

      <section className={styles.events}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>What&apos;s happening</p>
          <h2>Upcoming events</h2>
        </div>
        <p className={styles.emptyState}>
          Sign in to explore all upcoming events.
        </p>
      </section>
    </main>
  );
}
