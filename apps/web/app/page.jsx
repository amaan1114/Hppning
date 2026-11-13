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
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>happning</Link>
          <div className={styles.navLinks}>
            <Link href="/signin" className={styles.navLink}>Sign in</Link>
            <Link href="/signup" className={styles.navButton}>Create account</Link>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div>
          <h1>Good things happen when we show up.</h1>
          <p className={styles.heroText}>
            Discover events, meet people, and make something worth remembering.
          </p>
          <Link href="/signup" className={styles.primaryButton}>Get started</Link>
        </div>
        <ul className={styles.kindList} aria-label="Kinds of events">
          <li>Fests</li>
          <li>Club events</li>
          <li>Workshops</li>
          <li>Hackathons</li>
        </ul>
      </section>

      <section className={styles.sides}>
        <h2>What you can do</h2>
        <div className={styles.sidesGrid}>
          <div>
            <h3>For colleges</h3>
            <p>
              Post an event with its name, description, location, date and
              time. It joins the listing straight away.
            </p>
          </div>
          <div>
            <h3>For students</h3>
            <p>
              Search everything that&apos;s on by name, description or place,
              and open any event for the full details.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.events}>
        <div className={styles.band}>
          <div className={styles.sectionHeading}>
            <h2>Upcoming events</h2>
            <p className={styles.emptyState}>
              Sign in to explore all upcoming events.
            </p>
          </div>
          <Link href="/signin" className={styles.bandButton}>Sign in</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>happning</span>
      </footer>
    </main>
  );
}
