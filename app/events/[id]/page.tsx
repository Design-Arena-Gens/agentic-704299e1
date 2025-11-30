import { EventDetails } from "@/components/EventDetails";
import { notFound } from "next/navigation";

export default function EventPage({ params }: { params: { id: string } }) {
  if (!params?.id) return notFound();
  return <EventDetails eventId={params.id} />;
}

