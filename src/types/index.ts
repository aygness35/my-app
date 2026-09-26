export interface EventifyEvent {
  id: string;
  title: string;
  description: string;
  category: "Yazılım" | "Tasarım" | "İş Dünyası" | "Müzik" | "Atölye";
  date: string;
  location: string;
  capacity: number;
  registeredCount: number;
  price: number; // 0 ise Ücretsiz
  imageUrl: string;
  status: "Aktif" | "Yaklaşan" | "Tükendi" | "İptal";
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  purchaseDate: string;
  ticketCode: string;
}
