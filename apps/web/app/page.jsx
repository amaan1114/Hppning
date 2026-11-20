"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "../lib/api/auth";
import styles from "./page.module.css";

// Decorative only — illustrates what an event looks like, not real data.
const sampleTickets = [
  { month: "Fri", day: "21", name: "Rooftop listening session", place: "Terrace, 8th floor" },
  { month: "Sat", day: "22", name: "Sunrise run club", place: "Riverside trailhead" },
  { month: "Sun", day: "23", name: "Zine-making workshop", place: "The print room" },
];

const marqueeWords = [
  "Gigs", "Meetups", "Workshops", "Supper clubs", "Run clubs",
  "Open mics", "Game nights", "Pop-ups", "Screenings", "Hackathons",
];

const steps = [
  { title: "Discover", text: "Browse everything going on and search by name, vibe, or place." },
  { title: "Host", text: "Got an idea? Put it on the board in under a minute." },
  { title: "Show up", text: "Pick a moment, bring yourself, and meet the people who came too." },
];

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
          <Link href="/signin" className={styles.navLink}>Sign in</Link>
          <Link href="/signup" className={styles.navButton}>Create account</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Find your next moment</p>
          <h1>
            Good things happen when we <em>show up.</em>
          </h1>
          <p className={styles.heroText}>
            Discover events, meet people, and make something worth remembering.
          </p>
          <div className={styles.heroActions}>
            <Link href="/signup" className={styles.primaryButton}>Get started</Link>
            <Link href="/signin" className={styles.ghostButton}>I have an account</Link>
          </div>
        </div>

        <div className={styles.tickets} aria-hidden="true">
          {sampleTickets.map((ticket) => (
            <div key={ticket.name} className={styles.ticket}>
              <div className={styles.ticketDate}>
                <span>{ticket.month}</span>
                <strong>{ticket.day}</strong>
              </div>
              <div>
                <h3>{ticket.name}</h3>
                <p>{ticket.place}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...marqueeWords, ...marqueeWords].map((word, index) => (
            <span key={index}>{word}</span>
          ))}
        </div>
      </div>

      <section className={styles.steps}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>How it works</p>
          <h2>Three steps to a better weekend.</h2>
        </div>
        <ol className={styles.stepGrid}>
          {steps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.cta}>
        <h2>Something&apos;s happening. Be there.</h2>
        <p>Sign in to explore all upcoming events.</p>
        <Link href="/signup" className={styles.ctaButton}>Create your account</Link>
      </section>

      <footer className={styles.footer}>
        <span className={styles.logo}>happning</span>
        <span>Discover your next moment.</span>
      </footer>
    </main>
  );
}
