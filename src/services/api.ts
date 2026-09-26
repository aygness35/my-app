import type { EventifyEvent, Ticket } from "../types";

const initialEvents: EventifyEvent[] = [
  {
    id: "1",
    title: "React & Tailwind v4 Workshop",
    description:
      "Modern web teknolojileriyle sıfırdan performanslı arayüz geliştirme eğitimi.",
    category: "Yazılım",
    date: "2026-10-15T14:00",
    location: "İzmir İnovasyon Merkezi / Online",
    capacity: 100,
    registeredCount: 84,
    price: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    status: "Aktif",
  },
  {
    id: "2",
    title: "UI/UX & Design Systems Summit",
    description:
      "Awwwards ödüllü tasarımcılardan mikro etkileşimler ve erişilebilirlik oturumları.",
    category: "Tasarım",
    date: "2026-11-02T10:30",
    location: "Alsancak Etkinlik Kompleksi",
    capacity: 50,
    registeredCount: 50,
    price: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    status: "Tükendi",
  },
  {
    id: "3",
    title: "Girişimcilik ve Yatırımcılık Zirvesi",
    description:
      "Start-up ekosistemi ve melek yatırımcı bulma stratejileri paneli.",
    category: "İş Dünyası",
    date: "2026-12-05T09:00",
    location: "Ege Üniversitesi Kültür Merkezi",
    capacity: 200,
    registeredCount: 110,
    price: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
    status: "Aktif",
  },
];

if (!localStorage.getItem("eventify_events")) {
  localStorage.setItem("eventify_events", JSON.stringify(initialEvents));
}
if (!localStorage.getItem("eventify_tickets")) {
  localStorage.setItem("eventify_tickets", JSON.stringify([]));
}

export const eventService = {
  getEvents: (): Promise<EventifyEvent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem("eventify_events");
        resolve(data ? JSON.parse(data) : []);
      }, 300);
    });
  },

  createEvent: (
    newEvent: Omit<EventifyEvent, "id" | "registeredCount" | "status">,
  ): Promise<EventifyEvent> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events: EventifyEvent[] = JSON.parse(
          localStorage.getItem("eventify_events") || "[]",
        );
        const created: EventifyEvent = {
          ...newEvent,
          id: Date.now().toString(),
          registeredCount: 0,
          status: "Aktif",
        };
        events.unshift(created);
        localStorage.setItem("eventify_events", JSON.stringify(events));
        resolve(created);
      }, 400);
    });
  },

  bookTicket: (
    eventId: string,
  ): Promise<{ success: boolean; ticket?: Ticket; message?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events: EventifyEvent[] = JSON.parse(
          localStorage.getItem("eventify_events") || "[]",
        );
        const index = events.findIndex((e) => e.id === eventId);

        if (index === -1) {
          resolve({ success: false, message: "Etkinlik bulunamadı." });
          return;
        }

        const event = events[index];
        if (event.registeredCount >= event.capacity) {
          resolve({
            success: false,
            message: "Kontenjan dolduğu için bilet alınamadı.",
          });
          return;
        }

        event.registeredCount += 1;
        if (event.registeredCount >= event.capacity) {
          event.status = "Tükendi";
        }
        events[index] = event;
        localStorage.setItem("eventify_events", JSON.stringify(events));

        const tickets: Ticket[] = JSON.parse(
          localStorage.getItem("eventify_tickets") || "[]",
        );
        const newTicket: Ticket = {
          id: "TICK-" + Date.now().toString().slice(-6),
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          purchaseDate: new Date().toISOString(),
          ticketCode:
            "EVT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        };
        tickets.unshift(newTicket);
        localStorage.setItem("eventify_tickets", JSON.stringify(tickets));

        resolve({ success: true, ticket: newTicket });
      }, 500);
    });
  },

  getMyTickets: (): Promise<Ticket[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tickets = localStorage.getItem("eventify_tickets");
        resolve(tickets ? JSON.parse(tickets) : []);
      }, 200);
    });
  },
};
