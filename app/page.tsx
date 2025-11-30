import Link from "next/link";
import { EventList } from "@/components/EventList";
import { AIAssistant } from "@/components/ai/AIAssistant";

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Upcoming Events</h1>
          <Link href="/admin" className="btn btn-primary">Create Event</Link>
        </div>
        <EventList />
      </div>
      <div className="lg:col-span-1 space-y-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">AI Help Desk</h2>
          <AIAssistant />
        </div>
        <div className="card text-sm text-slate-600">
          <p>Register on an event page. Admin can send reminders to attendees (mock SMS/Email/WhatsApp).</p>
        </div>
      </div>
    </div>
  );
}

