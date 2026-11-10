"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { verifyEmail } from "../../lib/api/auth";
import styles from "../auth.module.css";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    let active = true;

    verifyEmail(token)
      .then(() => {
        if (active) {
          setStatus("success");
          setMessage("Your email has been verified successfully.");
        }
      })
      .catch(() => {
        if (active) {
          setStatus("error");
          setMessage(
            "This verification link is invalid or has expired. Please request a new one.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link href="/" className={styles.logo}>happning</Link>
        <h1>
          {status === "verifying"
            ? "Verifying your email"
            : status === "success"
              ? "You're all set"
              : "Verification failed"}
        </h1>
        <p className={styles.subtitle}>
          {status === "verifying"
            ? "Just a moment while we confirm your account."
            : message}
        </p>
        {status !== "verifying" && (
          <Link
            href={status === "success" ? "/signin" : "/signup"}
            className={styles.actionLink}
          >
            {status === "success" ? "Sign in to your account" : "Create a new account"}
          </Link>
        )}
      </section>
    </main>
  );
}
