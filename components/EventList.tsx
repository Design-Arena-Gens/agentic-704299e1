"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { format } from "date-fns";

export function EventList() {
  const events = useStore((s) => s.events);
  const attendees = useStore((s) => s.attendees);

  if (events.length === 0) {
    return <div className="card">No events yet. <Link className="text-brand-700 underline" href="/admin">Create one</Link>.</div>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((e) => {
        const count = attendees.filter((a) => a.eventId === e.id).length;
        return (
          <li key={e.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{e.name}</div>
              <span className="text-xs rounded bg-slate-100 px-2 py-1">{count} going</span>
            </div>
            <div className="text-sm text-slate-600">
              {format(new Date(e.date + "T" + e.startTime), "PPpp")} - {e.endTime}
            </div>
            <div className="text-sm">Venue: <span className="font-medium">{e.venue}</span></div>
            <div className="flex gap-2">
              <Link href={`/events/${e.id}`} className="btn btn-secondary">View</Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

