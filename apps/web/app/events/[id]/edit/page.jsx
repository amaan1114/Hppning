"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMe } from "../../../../lib/api/auth";
import { getEvent, updateEvent } from "../../../../lib/api/events";
import styles from "../../events.module.css";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return undefined;

    let active = true;

    Promise.all([getMe(), getEvent(id)])
      .then(([meResponse, eventResponse]) => {
        if (!active) return;
        const event = eventResponse.data.data;

        // Only the admin who created the event can edit it
        if (event.adminId !== meResponse.data.data.id) {
          router.replace(`/events/${id}`);
          return;
        }

        setForm({
          name: event.name,
          description: event.description,
          location: event.location,
          date: event.date,
          time: event.time.slice(0, 5),
        });
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) router.replace("/");
        else setMessage(error.response?.data?.message || "Unable to load this event.");
      });

    return () => {
      active = false;
    };
  }, [id, router]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateEvent(id, form);
      router.replace(`/events/${id}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save the event.");
      setSaving(false);
    }
  }

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/events" className={styles.logo}>happning</Link>
        <Link href={`/events/${id}`} className={styles.backLink}>Back to event</Link>
      </nav>

      {form ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formIntro}>
            <p className={styles.eyebrow}>Event builder</p>
            <h2>Edit event</h2>
            <p>Change anything you like. Registered guests will see the new details.</p>
          </div>
          <div className={styles.formFields}>
            <label>
              Name
              <input name="name" value={form.name} onChange={updateField} required />
            </label>
            <label>
              Description
              <textarea name="description" value={form.description} onChange={updateField} required />
            </label>
            <label>
              Location
              <input name="location" value={form.location} onChange={updateField} required />
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
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        !message && <p className={styles.emptyState}>Loading event...</p>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </main>
  );
}
