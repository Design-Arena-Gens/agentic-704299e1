"use client";

import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";

export function NotificationsPanel() {
  const events = useStore((s) => s.events);
  const attendees = useStore((s) => s.attendees);
  const logs = useStore((s) => s.notifications);
  const send = useStore((s) => s.sendNotification);

  const [eventId, setEventId] = useState<string>("");
  const [channel, setChannel] = useState<"email" | "sms" | "whatsapp">("email");
  const [message, setMessage] = useState<string>("Reminder: Your event starts soon!");

  const targetAttendees = useMemo(
    () => attendees.filter((a) => (eventId ? a.eventId === eventId : true)),
    [attendees, eventId]
  );

  const onSend = () => {
    if (targetAttendees.length === 0) return;
    targetAttendees.forEach((a) => {
      send({ eventId: a.eventId, attendeeId: a.id, channel, message });
    });
    alert(`Sent ${targetAttendees.length} ${channel.toUpperCase()} reminders (mock).`);
  };

  return (
    <div className="card space-y-3">
      <h2 className="text-lg font-semibold">Notifications</h2>
      <div className="grid grid-cols-1 gap-3">
        <select className="input" value={eventId} onChange={(e) => setEventId(e.target.value)}>
          <option value="">All events</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <div className="flex gap-2">
          <select className="input" value={channel} onChange={(e) => setChannel(e.target.value as any)}>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <input className="input" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={onSend}>Send reminders</button>
      </div>
      <div className="pt-2">
        <div className="text-sm font-medium mb-1">Recent notification logs</div>
        {logs.length === 0 ? (
          <div className="text-sm text-slate-600">No notifications sent yet.</div>
        ) : (
          <ul className="divide-y">
            {logs.slice(0, 5).map((l) => {
              const ev = events.find((e) => e.id === l.eventId);
              const at = attendees.find((a) => a.id === l.attendeeId);
              return (
                <li key={l.id} className="py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="uppercase text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">{l.channel}</span>
                      {ev?.name} ? {at?.name ?? "All"}
                    </div>
                    <div className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-slate-600">{l.message}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

