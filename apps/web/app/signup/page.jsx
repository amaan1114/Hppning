"use client";

import Link from "next/link";
import { useState } from "react";
import { signUp } from "../../lib/api/auth";
import styles from "../auth.module.css";

export default function SignUpPage() {
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await signUp({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      setMessage("Account created. Check your email to verify it.");
      event.currentTarget.reset();
    } catch {
      setMessage("Unable to create your account. Please try again.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link href="/" className={styles.logo}>happning</Link>
        <h1>Create your account</h1>
        <p className={styles.subtitle}>Make room for something good.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" minLength={8} required />
          </label>
          <button type="submit">Create account</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        <p className={styles.footer}>
          Already have an account? <Link href="/signin">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
