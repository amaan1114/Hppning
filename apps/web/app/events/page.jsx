"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, signOut } from "../../lib/api/auth";
import { createEvent, getEvents } from "../../lib/api/events";
import { dateParts } from "../../lib/date";
import styles from "./events.module.css";

const emptyForm = {
  name: "",
  description: "",
  location: "",
  date: "",
  time: "",
};

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    getMe()
      .then(() => getEvents())
      .then((response) => {
        if (active) setEvents(response.data.data || []);
      })
      .catch((error) => {
        if (active && error.response?.status === 401) router.replace("/");
        else if (active) setMessage("Unable to load events. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return events;

    return events.filter((event) =>
      [event.name, event.description, event.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [events, query]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await createEvent(form);
      setEvents((current) => [response.data.data, ...current]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to create the event. Please try again.",
      );
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    setMessage("");

    try {
      await signOut();
      router.replace("/");
    } catch {
      setSigningOut(false);
      setMessage("Unable to sign out. Please try again.");
    }
  }

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/events" className={styles.logo}>happning</Link>
        <div className={styles.navActions}>
          <button type="button" className={styles.signOutButton} onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
          <button
            type="button"
            className={styles.createButton}
            onClick={() => setShowForm((current) => !current)}
            aria-label={showForm ? "Close create event form" : "Create an event"}
            aria-expanded={showForm}
          >
            <span className={styles.createIcon} data-open={showForm} aria-hidden="true">+</span>
            {showForm ? "Close" : "New event"}
          </button>
        </div>
      </nav>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Your next moment</p>
          <h1>What&apos;s happening?</h1>
        </div>
        <input
          className={styles.search}
          type="search"
          placeholder="Search events"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search events"
        />
      </header>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formIntro}>
            <p className={styles.eyebrow}>Event builder</p>
            <h2>Create an event</h2>
            <p>Give it a name, a place and a time. It goes live as soon as you hit create.</p>
          </div>
          <div className={styles.formFields}>
            <label>
              Name
              <input name="name" value={form.name} onChange={updateField} placeholder="Rooftop listening session" required />
            </label>
            <label>
              Description
              <textarea name="description" value={form.description} onChange={updateField} placeholder="What should people expect?" required />
            </label>
            <label>
              Location
              <input name="location" value={form.location} onChange={updateField} placeholder="Where is it?" required />
            </label>
            <div className={styles.formRow}>
              <label>
                Date
                <input name="date" type="date" value={form.date} onChange={updateField} required />
              </label>
              <label>
                Time
                <input name="time" type="time" value={form.time} onChange={updateField} required />
              </label>
            </div>
            <button type="submit" className={styles.submitButton}>Create event</button>
          </div>
        </form>
      )}

      {message && <p className={styles.message}>{message}</p>}
      {loading ? (
        <p className={styles.emptyState}>Loading events...</p>
      ) : filteredEvents.length > 0 ? (
        <>
          <p className={styles.count}>
            {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
          </p>
          <section className={styles.grid}>
            {filteredEvents.map((event) => {
              const when = dateParts(event.date);

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className={styles.card}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.dateBlock}>
                      <span>{when.month}</span>
                      <strong>{when.day}</strong>
                    </div>
                    <p className={styles.eventDate}>{when.weekday} · {event.time.slice(0, 5)}</p>
                  </div>
                  <h2>{event.name}</h2>
                  <p className={styles.description}>{event.description}</p>
                  <p className={styles.location}>{event.location}</p>
                </Link>
              );
            })}
          </section>
        </>
      ) : (
        <p className={styles.emptyState}>
          {query ? "No events match your search." : "No events yet. Create the first one."}
        </p>
      )}
    </main>
  );
}
