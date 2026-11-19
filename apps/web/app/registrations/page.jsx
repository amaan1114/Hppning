"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "../../lib/api/auth";
import { getEvents } from "../../lib/api/events";
import { getMyRegistrations, unregister } from "../../lib/api/registrations";
import { dateParts } from "../../lib/date";
import styles from "../events/events.module.css";

export default function MyRegistrationsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([getMe(), getEvents(), getMyRegistrations()])
      .then(([, eventsResponse, registrationsResponse]) => {
        if (!active) return;
        // Keep only the events this user has registered for
        const registeredIds = registrationsResponse.data.data.map((r) => r.eventId);
        setEvents(
          eventsResponse.data.data.filter((event) => registeredIds.includes(event.id)),
        );
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) router.replace("/");
        else setMessage("Unable to load your registrations. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function handleCancel(eventId) {
    setMessage("");
    try {
      await unregister(eventId);
      setEvents((current) => current.filter((event) => event.id !== eventId));
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to cancel the registration.");
    }
  }

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/events" className={styles.logo}>happning</Link>
        <Link href="/events" className={styles.backLink}>All events</Link>
      </nav>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>You&apos;re going</p>
          <h1>My registrations</h1>
        </div>
      </header>

      {message && <p className={styles.message}>{message}</p>}
      {loading ? (
        <p className={styles.emptyState}>Loading registrations...</p>
      ) : events.length > 0 ? (
        <section className={styles.grid}>
          {events.map((event) => {
            const when = dateParts(event.date);

            return (
              <div key={event.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.dateBlock}>
                    <span>{when.month}</span>
                    <strong>{when.day}</strong>
                  </div>
                  <p className={styles.eventDate}>{when.weekday} · {event.time.slice(0, 5)}</p>
                </div>
                <h2>
                  <Link href={`/events/${event.id}`}>{event.name}</Link>
                </h2>
                <p className={styles.location}>{event.location}</p>
                <button
                  type="button"
                  className={styles.signOutButton}
                  onClick={() => handleCancel(event.id)}
                >
                  Cancel registration
                </button>
              </div>
            );
          })}
        </section>
      ) : (
        <p className={styles.emptyState}>
          You haven&apos;t registered for anything yet. <Link href="/events">Browse events</Link>
        </p>
      )}
    </main>
  );
}
