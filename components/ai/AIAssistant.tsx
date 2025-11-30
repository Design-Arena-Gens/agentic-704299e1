"use client";

import { useStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string };

function generateAIResponse(input: string, context: { eventNames: string[]; attendeeCount: number }): string {
  const lower = input.toLowerCase();
  if (lower.includes("schedule") || lower.includes("time") || lower.includes("slot")) {
    return "To schedule, pick a date and use 'Suggest' to find a free slot without clashes between 09:00 and 18:00.";
  }
  if (lower.includes("register") || lower.includes("sign")) {
    return "Open the event page and fill the Register form with your name and contact. You'll appear in the attendee list instantly.";
  }
  if (lower.includes("events") || lower.includes("list")) {
    if (context.eventNames.length === 0) return "There are no events yet. Create one from the Admin page.";
    return `Current events: ${context.eventNames.join(", ")}.`;
  }
  if (lower.includes("attendee") || lower.includes("people")) {
    return `There are ${context.attendeeCount} total registered attendees across events.`;
  }
  if (lower.includes("reminder") || lower.includes("notification")) {
    return "Admins can send mock reminders via Email, SMS, or WhatsApp from the Notifications panel.";
  }
  if (lower.includes("speaker") || lower.includes("agenda")) {
    return "Edit speakers and agenda from the Admin event form. Details show on the event page.";
  }
  return "I'm your event assistant. Ask me about scheduling, registration, events, attendees, or reminders.";
}

export function AIAssistant({ contextEventId }: { contextEventId?: string }) {
  const events = useStore((s) => s.events);
  const attendees = useStore((s) => s.attendees);
  const [messages, setMessages] = useState<Message[]>([
    { id: crypto.randomUUID(), role: "assistant", text: "Hi! How can I help with your event?" }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    const context = {
      eventNames: events.map((e) => e.name),
      attendeeCount: contextEventId
        ? attendees.filter((a) => a.eventId === contextEventId).length
        : attendees.length
    };
    const resp = generateAIResponse(text, context);
    const aiMsg: Message = { id: crypto.randomUUID(), role: "assistant", text: resp };
    setMessages((m) => [...m, aiMsg]);
  };

  return (
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "assistant" ? "text-sm" : "text-sm text-right"}>
            <span className={m.role === "assistant" ? "inline-block bg-slate-100 px-2 py-1 rounded" : "inline-block bg-brand-600 text-white px-2 py-1 rounded"}>
              {m.text}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className="input"
          placeholder="Ask about scheduling, registration, reminders..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button className="btn btn-primary" onClick={onSend}>Send</button>
      </div>
    </div>
  );
}

