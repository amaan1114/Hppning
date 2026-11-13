"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMe } from "../../../lib/api/auth";
import { getEvent } from "../../../lib/api/events";
import styles from "../events.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// display only: "2026-11-21" -> "21 Nov 2026". Split, never new Date(), so no timezone can move the day.
function formatDate(iso) {
  const [year, month, day] = String(iso).slice(0, 10).split("-").map(Number);
  return MONTHS[month - 1] && day && year ? `${day} ${MONTHS[month - 1]} ${year}` : iso;
}

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
    <main className={`${styles.page} ${styles.pageTinted}`}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/events" className={styles.logo}>happning</Link>
          <Link href="/events" className={styles.backLink}>All events</Link>
        </div>
      </nav>

      <div className={styles.body}>
        {loading ? (
          <>
            <p className={styles.loadingNote} role="status">Loading event…</p>
            <div className={`${styles.skeleton} ${styles.detailSkeleton}`} aria-hidden="true" />
          </>
        ) : event ? (
          <article className={styles.detail}>
            <div className={styles.detailMain}>
              <h1>{event.name}</h1>
              <p className={styles.detailDescription}>{event.description}</p>
            </div>
            <div className={styles.detailMeta}>
              <div>
                <span className={styles.metaLabel}>When</span>
                <p className={`${styles.metaValue} ${styles.metaValueLead}`}>
                  <time dateTime={event.date}>{formatDate(event.date)}</time>
                </p>
                <p className={styles.metaSub}>{event.time.slice(0, 5)}</p>
              </div>
              <div>
                <span className={styles.metaLabel}>Where</span>
                <p className={styles.metaValue}>{event.location}</p>
              </div>
            </div>
          </article>
        ) : (
          <p className={styles.message} role="alert">{message}</p>
        )}
      </div>
    </main>
  );
}
