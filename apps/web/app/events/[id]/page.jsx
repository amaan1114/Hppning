"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMe } from "../../../lib/api/auth";
import { getEvent } from "../../../lib/api/events";
import styles from "../events.module.css";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return undefined;

    let active = true;

    getMe()
      .then(() => getEvent(id))
      .then((response) => {
        if (active) setEvent(response.data.data);
      })
      .catch((error) => {
        if (active && error.response?.status === 401) {
          router.replace("/");
          return;
        }

        if (active) {
          setMessage(
            error.response?.data?.message || "Unable to load this event.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, router]);

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/events" className={styles.logo}>happning</Link>
        <Link href="/events" className={styles.backLink}>All events</Link>
      </nav>

      {loading ? (
        <p className={styles.emptyState}>Loading event...</p>
      ) : event ? (
        <article className={styles.detail}>
          <p className={styles.eyebrow}>Event details</p>
          <h1>{event.name}</h1>
          <p className={styles.detailDescription}>{event.description}</p>
          <div className={styles.detailMeta}>
            <div>
              <span className={styles.metaLabel}>When</span>
              <p>{event.date} · {event.time.slice(0, 5)}</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Where</span>
              <p>{event.location}</p>
            </div>
          </div>
        </article>
      ) : (
        <p className={styles.message}>{message}</p>
      )}
    </main>
  );
}
