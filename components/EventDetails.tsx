"use client";

import { useStore } from "@/lib/store";
import { Attendee } from "@/lib/types";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { AIAssistant } from "./ai/AIAssistant";

export function EventDetails({ eventId }: { eventId: string }) {
  const event = useStore((s) => s.events.find((e) => e.id === eventId));
  const addAttendee = useStore((s) => s.addAttendee);
  const removeAttendee = useStore((s) => s.removeAttendee);
  const attendees = useStore((s) => s.attendees.filter((a) => a.eventId === eventId));

  const [form, setForm] = useState({ name: "", email: "", phone: "", whatsapp: "" });
  const [speech, setSpeech] = useState<string>("");

  const speakersLine = useMemo(() => (event?.speakers ?? []).join(", "), [event]);

  if (!event) {
    return <div className="card">Event not found.</div>;
  }

  const handleRegister = () => {
    if (!form.name) return;
    const a: Omit<Attendee, "id" | "registeredAt"> = {
      eventId,
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      whatsapp: form.whatsapp || undefined
    };
    addAttendee(a);
    setForm({ name: "", email: "", phone: "", whatsapp: "" });
  };

  const generateSpeech = () => {
    const text = `Welcome to ${event.name} at ${event.venue} on ${format(new Date(event.date + "T" + event.startTime), "PPP p")}. Today we will cover: ${event.agenda}. Our speakers are ${speakersLine}. We hope you enjoy the event!`;
    setSpeech(text);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">{event.name}</h1>
        <div className="text-sm text-slate-600">
          {format(new Date(event.date + "T" + event.startTime), "PPpp")} - {event.endTime} @ {event.venue}
        </div>
        <p className="text-slate-700">{event.description}</p>
        <div className="text-sm"><span className="font-medium">Speakers:</span> {speakersLine || "TBA"}</div>
        <div className="text-sm whitespace-pre-wrap"><span className="font-medium">Agenda:</span> {event.agenda || "TBA"}</div>
        <div className="flex gap-2 pt-2">
          <button className="btn btn-primary" onClick={generateSpeech}>AI-generate opening speech</button>
          {speech && <button className="btn btn-secondary" onClick={() => setSpeech("")}>Clear</button>}
        </div>
        {speech && <div className="mt-2 p-3 bg-slate-50 rounded text-sm">{speech}</div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Register</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input" placeholder="Phone (SMS)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input" placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
            <div>
              <button className="btn btn-primary" onClick={handleRegister}>Register</button>
            </div>
          </div>

          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Attendees</h2>
            {attendees.length === 0 ? (
              <div className="text-sm text-slate-600">No attendees yet.</div>
            ) : (
              <ul className="divide-y">
                {attendees.map((a) => (
                  <li key={a.id} className="py-2 flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-slate-600">{a.email || a.phone || a.whatsapp || "?"}</div>
                    </div>
                    <button className="btn btn-danger" onClick={() => removeAttendee(a.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold mb-2">AI Help Desk</h2>
            <AIAssistant contextEventId={eventId} />
          </div>
        </div>
      </div>
    </div>
  );
}

