"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMe } from "../../../lib/api/auth";
import { deleteEvent, getEvent } from "../../../lib/api/events";
import {
  getEventRegistrations,
  getMyRegistrations,
  register,
  unregister,
} from "../../../lib/api/registrations";
import { dateParts } from "../../../lib/date";
import styles from "../events.module.css";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return undefined;

    let active = true;

    Promise.all([getMe(), getEvent(id)])
      .then(async ([meResponse, eventResponse]) => {
        const currentUser = meResponse.data.data;
        const currentEvent = eventResponse.data.data;
        if (!active) return;
        setMe(currentUser);
        setEvent(currentEvent);

        // Creator sees who registered; everyone else sees their own status.
        // These are extras, so a failure here must not hide the event.
        try {
          if (currentEvent.adminId === currentUser.id) {
            const response = await getEventRegistrations(id);
            if (active) setAttendees(response.data.data);
          } else {
            const response = await getMyRegistrations();
            if (active) {
              setRegistered(
                response.data.data.some((r) => r.eventId === Number(id)),
              );
            }
          }
        } catch {
          if (active) setMessage("Unable to load registration details.");
        }
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

  const isAdmin = event && me && event.adminId === me.id;

  async function toggleRegistration() {
    setBusy(true);
    setMessage("");
    try {
      if (registered) await unregister(id);
      else await register(id);
      setRegistered(!registered);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this event?")) return;
    setBusy(true);
    try {
      await deleteEvent(id);
      router.replace("/events");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete the event.");
      setBusy(false);
    }
  }

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
            <div className={styles.actions}>
              {isAdmin ? (
                <>
                  <Link href={`/events/${id}/edit`} className={styles.editButton}>
                    Edit event
                  </Link>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    disabled={busy}
                  >
                    Delete event
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={toggleRegistration}
                  disabled={busy}
                >
                  {registered ? "Cancel registration" : "Register"}
                </button>
              )}
            </div>
            {message && <p className={styles.message}>{message}</p>}
            {isAdmin && (
              <section className={styles.attendees}>
                <h2>Registrations ({attendees.length})</h2>
                {attendees.length > 0 ? (
                  <ul>
                    {attendees.map((person) => (
                      <li key={person.id}>
                        {person.name}
                        <span>{person.email}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No one has registered yet.</p>
                )}
              </section>
            )}
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
