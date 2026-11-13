"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "../../lib/api/auth";
import styles from "../auth.module.css";

export default function SignInPage() {
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await signIn({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      window.location.href = "/events";
    } catch {
      setMessage("Unable to sign in. Please check your details.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link href="/" className={styles.logo}>happning</Link>
        <h1>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to find your next moment.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit">Sign in</button>
        </form>
        {message && <p className={styles.messageError} role="alert">{message}</p>}
        <p className={styles.footer}>
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
