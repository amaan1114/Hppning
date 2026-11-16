"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMe } from "../../../lib/api/auth";
import { getEvent } from "../../../lib/api/events";
import { dateParts } from "../../../lib/date";
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

  const when = event ? dateParts(event.date) : null;

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
          <div>
            <p className={styles.eyebrow}>Event details</p>
            <h1>{event.name}</h1>
            <p className={styles.detailDescription}>{event.description}</p>
          </div>
          <aside className={styles.detailMeta}>
            <div className={styles.detailDate}>
              <span>{when.month}</span>
              <strong>{when.day}</strong>
            </div>
            <div>
              <span className={styles.metaLabel}>When</span>
              <p>{when.full}</p>
              <p className={styles.metaSub}>{event.time.slice(0, 5)}</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Where</span>
              <p>{event.location}</p>
            </div>
          </aside>
        </article>
      ) : (
        <p className={styles.message}>{message}</p>
      )}
    </main>
  );
}
