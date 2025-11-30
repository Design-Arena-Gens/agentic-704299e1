/* eslint-disable react/no-unescaped-entities */
"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import Link from "next/link";
import { suggestNextSlot, timeClashes } from "@/lib/scheduling";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";

export default function AdminPage() {
  const events = useStore((s) => s.events);
  const addEvent = useStore((s) => s.addEvent);
  const updateEvent = useStore((s) => s.updateEvent);
  const deleteEvent = useStore((s) => s.deleteEvent);
  const attendees = useStore((s) => s.attendees);

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    speakers: "",
    agenda: ""
  });

  const isEditing = Boolean(form.id);

  const handleSubmit = () => {
    if (!form.name || !form.date || !form.startTime || !form.endTime) return;
    const event = {
      id: isEditing ? form.id : nanoid(),
      name: form.name,
      description: form.description,
      venue: form.venue,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      speakers: form.speakers.split(",").map((s) => s.trim()).filter(Boolean),
      agenda: form.agenda
    };
    if (timeClashes(events, event)) {
      alert("Time clash detected with an existing event. Please choose a different time.");
      return;
    }
    if (isEditing) {
      updateEvent(event.id, event);
    } else {
      addEvent(event);
    }
    setForm({
      id: "",
      name: "",
      description: "",
      venue: "",
      date: "",
      startTime: "",
      endTime: "",
      speakers: "",
      agenda: ""
    });
  };

  const stats = {
    totalEvents: events.length,
    totalAttendees: attendees.length
  };

  const handleSuggest = () => {
    if (!form.date) {
      alert("Pick a date first");
      return;
    }
    const suggestion = suggestNextSlot(events, form.date, 60);
    setForm((f) => ({ ...f, startTime: suggestion.startTime, endTime: suggestion.endTime }));
  };

  const startEdit = (id: string) => {
    const e = events.find((x) => x.id === id);
    if (!e) return;
    setForm({
      id: e.id,
      name: e.name,
      description: e.description,
      venue: e.venue,
      date: e.date,
      startTime: e.startTime,
      endTime: e.endTime,
      speakers: e.speakers.join(", "),
      agenda: e.agenda
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Link href="/" className="btn btn-secondary">Back to Home</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">{isEditing ? "Edit Event" : "Create Event"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="input" placeholder="Event name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
              <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <div className="flex gap-2">
                <input className="input" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                <input className="input" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                <button className="btn btn-secondary" onClick={handleSuggest}>Suggest</button>
              </div>
              <input className="input md:col-span-2" placeholder="Speakers (comma separated)" value={form.speakers} onChange={(e) => setForm({ ...form, speakers: e.target.value })} />
              <textarea className="input md:col-span-2" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <textarea className="input md:col-span-2" rows={4} placeholder="Agenda" value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={handleSubmit}>{isEditing ? "Save Changes" : "Create Event"}</button>
              {isEditing && (
                <button className="btn btn-secondary" onClick={() => setForm({ ...form, id: "" })}>Cancel</button>
              )}
            </div>
          </div>

          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Events</h2>
            <ul className="divide-y">
              {events.map((e) => (
                <li key={e.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-sm text-slate-600">{format(new Date(e.date + "T" + e.startTime), "PPpp")} - {e.endTime} @ {e.venue}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/events/${e.id}`} className="btn btn-secondary">View</Link>
                    <button className="btn btn-secondary" onClick={() => startEdit(e.id)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteEvent(e.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold mb-2">Statistics</h2>
            <div className="space-y-1 text-sm">
              <div>Total events: <span className="font-medium">{stats.totalEvents}</span></div>
              <div>Total attendees: <span className="font-medium">{stats.totalAttendees}</span></div>
            </div>
          </div>
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
}

