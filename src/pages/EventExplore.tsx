import React, { useState, useEffect } from "react";
import type { EventifyEvent, Ticket } from "../types";
import { eventService } from "../services/api";
import { Toast } from "../components/Toast";

// Örnek Etkinlik Listesi
const INITIAL_EVENTS: EventifyEvent[] = [
  {
    id: "m-1",
    title: "Duman - Canlı Açık Hava Konseri",
    category: "Müzik",
    date: "2026-10-25T21:00",
    location: "İzmir Kültürpark Açıkhava Tiyatrosu, İzmir",
    capacity: 2500,
    registeredCount: 1850,
    price: 450,
    status: "Yayında",
    description:
      "Sevilen rock grubu Duman, en popüler şarkıları ve muhteşem sahne şovuyla açık havada hayranlarıyla buluşuyor.",
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m-2",
    title: "Yüzyüzeyken Konuşuruz & Akustik Gece",
    category: "Müzik",
    date: "2026-11-08T20:30",
    location: "Bostanlı Suat Taşer Sahnesi, İzmir",
    capacity: 800,
    registeredCount: 620,
    price: 350,
    status: "Yayında",
    description:
      "Indie pop ve alternatif rock müziğin sevilen ismi Yüzyüzeyken Konuşuruz'dan özel akustik performans.",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1",
    title: "Neon Nights Electro Festival",
    category: "Müzik",
    date: "2026-10-15T21:00",
    location: "Klein Phönix, İstanbul",
    capacity: 500,
    registeredCount: 412,
    price: 850,
    status: "Yayında",
    description:
      "Şehrin en iyi DJ'leri ve devasa neon ışık şovlarıyla unutulmaz bir elektronik müzik gecesi.",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    title: "Sunset Beach Acoustic Session",
    category: "Müzik",
    date: "2026-10-18T18:30",
    location: "Alaçatı, Çeşme",
    capacity: 150,
    registeredCount: 110,
    price: 350,
    status: "Yayında",
    description:
      "Deniz kenarında gün batımı eşliğinde akustik caz ve indie performansları.",
    imageUrl:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "AI & Future Tech Summit '26",
    category: "Yazılım",
    date: "2026-10-20T10:00",
    location: "İzmir Teknopark, İzmir",
    capacity: 200,
    registeredCount: 200,
    price: 0,
    status: "Tükendi",
    description:
      "Yapay zeka, üretken modeller ve veri bilimindeki son gelişmelerin konuşulduğu teknoloji zirvesi.",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "UI/UX & Design Systems Atölyesi",
    category: "Tasarım",
    date: "2026-11-02T14:00",
    location: "Alsancak Studio, İzmir",
    capacity: 35,
    registeredCount: 18,
    price: 450,
    status: "Yayında",
    description:
      "Figma üzerinde modern tasarım sistemleri kurma ve bileşen mimarisi oluşturma pratik eğitimi.",
    imageUrl:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
  },
];

export const EventExplore: React.FC<{ onLogout: () => void }> = ({
  onLogout,
}) => {
  const [events, setEvents] = useState<EventifyEvent[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  // Modal State'leri
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] =
    useState<EventifyEvent | null>(null);
  const [selectedTicketForQR, setSelectedTicketForQR] = useState<Ticket | null>(
    null,
  );

  // Bilet Alma Seçim State'leri
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [seatCategory, setSeatCategory] = useState<string>(
    "Genel Giriş / Ayakta",
  );

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Yeni Etkinlik Form State'leri
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] =
    useState<EventifyEvent["category"]>("Yazılım");
  const [newDate, setNewDate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCapacity, setNewCapacity] = useState(50);
  const [newPrice, setNewPrice] = useState(0);
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents();
      const myTickets = await eventService.getMyTickets();

      const combinedEvents = [...INITIAL_EVENTS, ...(data || [])];
      const uniqueEvents = Array.from(
        new Map(combinedEvents.map((item) => [item.id, item])).values(),
      );

      setEvents(uniqueEvents);
      setTickets(myTickets || []);
    } catch {
      setEvents(INITIAL_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  // Bilet Alma Seçim Penceresini Açar
  const handleOpenBookingModal = (evt: EventifyEvent) => {
    setSelectedEventForBooking(evt);
    setTicketQuantity(1);
    setSeatCategory("Genel Giriş / Ayakta");
  };

  // Onay Verilince Biletleri Oluşturur
  const handleConfirmPurchase = async () => {
    if (!selectedEventForBooking) return;

    setBookingLoading(true);
    try {
      const newTickets: Ticket[] = [];

      for (let i = 0; i < ticketQuantity; i++) {
        const randomSeat = Math.floor(Math.random() * 80) + 1;
        const ticketCode = `EVT-${Math.floor(100000 + Math.random() * 900000)}`;

        const t: Ticket = {
          id: `t-${Date.now()}-${i}`,
          eventId: selectedEventForBooking.id,
          eventTitle: `${selectedEventForBooking.title} (${seatCategory} - Koltuk #${randomSeat})`,
          eventLocation: selectedEventForBooking.location,
          ticketCode: ticketCode,
          createdAt: new Date().toISOString(),
        };
        newTickets.push(t);
      }

      setTickets((prev) => [...newTickets, ...prev]);

      // Kontenjan Güncelle
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id === selectedEventForBooking.id) {
            const updatedCount = evt.registeredCount + ticketQuantity;
            return {
              ...evt,
              registeredCount: updatedCount,
              status: updatedCount >= evt.capacity ? "Tükendi" : "Yayında",
            };
          }
          return evt;
        }),
      );

      setToast({
        message: `${ticketQuantity} Adet biletiniz başarıyla oluşturuldu!`,
        type: "success",
      });
      setSelectedEventForBooking(null);
    } catch {
      setToast({ message: "Bilet alınırken bir hata oluştu.", type: "error" });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelTicket = (ticketId: string, eventId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));

    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const updatedCount = Math.max(0, evt.registeredCount - 1);
          return {
            ...evt,
            registeredCount: updatedCount,
            status: "Yayında",
          };
        }
        return evt;
      }),
    );

    if (selectedTicketForQR?.id === ticketId) {
      setSelectedTicketForQR(null);
    }

    setToast({
      message: "Biletiniz başarıyla iptal edildi.",
      type: "info",
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newLocation.trim()) {
      setToast({ message: "Lütfen zorunlu alanları doldurun.", type: "error" });
      return;
    }

    const createdEvent: EventifyEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: newDate || new Date().toISOString(),
      location: newLocation,
      capacity: Number(newCapacity),
      registeredCount: 0,
      price: Number(newPrice),
      status: "Yayında",
      description: newDescription || "Etkinlik açıklaması belirtilmedi.",
      imageUrl:
        newImage ||
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    };

    setEvents((prev) => [createdEvent, ...prev]);
    setToast({ message: "Yeni etkinlik yayınlandı!", type: "success" });
    setIsCreateModalOpen(false);

    setNewTitle("");
    setNewLocation("");
    setNewDescription("");
    setNewImage("");
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory =
      selectedCategory === "Tümü" || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#09020C] text-slate-100 p-4 sm:p-8 font-sans relative overflow-x-hidden pb-24 sm:pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Arka Plan Görseli & Atmosfer */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-15 filter blur-[3px] pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#09020C]/90 via-[#15051B]/95 to-[#09020C] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 pb-6 border-b border-pink-500/20 bg-[#12041A]/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 flex items-center justify-center font-black text-2xl text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]">
              🪩
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent">
                Eventify
              </h1>
              <p className="text-[10px] font-bold text-pink-400/80 tracking-widest uppercase">
                Etkinlik & Bilet Platformu
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="bg-[#0A020E]/80 border border-pink-900/40 hover:border-pink-500/50 px-3.5 py-2.5 rounded-xl text-xs font-bold text-pink-200 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              👤 Profilim
            </button>

            <button
              onClick={() => setIsTicketsOpen(true)}
              className="bg-[#0A020E]/80 border border-pink-900/40 hover:border-pink-500/50 px-4 py-2.5 rounded-xl text-xs font-bold text-pink-200 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              🎟️ Biletlerim ({tickets.length})
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all cursor-pointer"
            >
              + Etkinlik Oluştur
            </button>

            <button
              onClick={onLogout}
              className="bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Çıkış
            </button>
          </div>
        </header>

        {/* Arama & Filtre Barı */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Etkinlik veya şehir ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12041A]/80 border border-pink-500/30 rounded-2xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-pink-500 text-slate-100 placeholder:text-slate-500 backdrop-blur-xl transition-all"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm opacity-60">
              🔍
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              "Tümü",
              "Müzik",
              "Yazılım",
              "Tasarım",
              "İş Dünyası",
              "Atölye",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_4px_20px_rgba(225,29,72,0.4)] scale-105"
                    : "bg-[#12041A]/60 border border-pink-900/30 text-slate-400 hover:text-pink-300 hover:border-pink-500/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ana Etkinlik Listesi */}
        <main>
          {loading ? (
            <div className="flex justify-center items-center py-20 text-pink-400 text-sm">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-3" />
              Etkinlikler Yükleniyor...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-[#12041A]/40 border border-pink-500/20 rounded-3xl backdrop-blur-xl">
              <p className="text-slate-400 text-sm">
                Aradığınız kriterlere uygun etkinlik bulunamadı.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-[#12041A]/60 border border-pink-500/20 rounded-3xl overflow-hidden shadow-xl hover:border-pink-500/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col group backdrop-blur-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12041A] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-pink-600/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider">
                      {evt.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-100 mb-2 line-clamp-1">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-pink-900/30">
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span className="line-clamp-1">📍 {evt.location}</span>
                        <span className="font-extrabold text-rose-400 whitespace-nowrap ml-2">
                          {evt.price === 0 ? "ÜCRETSİZ" : `${evt.price} TL`}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenBookingModal(evt)}
                        disabled={evt.status === "Tükendi"}
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer shadow-md"
                      >
                        {evt.status === "Tükendi"
                          ? "Kontenjan Doldu"
                          : "Bilet Al / Detay Seç →"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* 1. BİLET AL / SEÇİM YAP EKRANI (DETAY MODALI) */}
        {selectedEventForBooking && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#12041A] border border-pink-500/30 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="relative h-48 w-full">
                <img
                  src={selectedEventForBooking.imageUrl}
                  alt={selectedEventForBooking.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12041A] via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedEventForBooking(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <h2 className="text-xl font-black text-white">
                    {selectedEventForBooking.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    📍 {selectedEventForBooking.location}
                  </p>
                </div>

                <div className="space-y-4 bg-[#0A020E] p-4 rounded-2xl border border-pink-900/30">
                  {/* Bilet Adedi Seçimi */}
                  <div>
                    <label className="block text-xs font-bold text-pink-300 mb-2">
                      Bilet Adedi Seçin:
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setTicketQuantity(num)}
                          className={`w-10 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            ticketQuantity === num
                              ? "bg-pink-600 text-white shadow-lg scale-105"
                              : "bg-[#12041A] text-slate-400 border border-pink-900/40 hover:text-white"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Konum / Bölge Seçimi */}
                  <div>
                    <label className="block text-xs font-bold text-pink-300 mb-2">
                      Koltuk / Bölge Seçin:
                    </label>
                    <select
                      value={seatCategory}
                      onChange={(e) => setSeatCategory(e.target.value)}
                      className="w-full bg-[#12041A] border border-pink-900/40 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 cursor-pointer"
                    >
                      <option value="Genel Giriş / Ayakta">
                        Genel Giriş / Ayakta (Standart)
                      </option>
                      <option value="Ön Sıra / Sahne Önü">
                        Ön Sıra / Sahne Önü
                      </option>
                      <option value="VIP Teras / Protokol">
                        VIP Teras / Protokol
                      </option>
                    </select>
                  </div>
                </div>

                {/* Fiyat Özeti ve Onay */}
                <div className="flex items-center justify-between pt-2 border-t border-pink-900/30">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Toplam Tutar
                    </p>
                    <p className="text-xl font-extrabold text-pink-400">
                      {selectedEventForBooking.price === 0
                        ? "Ücretsiz"
                        : `${selectedEventForBooking.price * ticketQuantity} TL`}
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmPurchase}
                    disabled={bookingLoading}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2"
                  >
                    {bookingLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Biletleri Onayla ve Al →"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. BİLETLERİM LİSTESİ MODALI */}
        {isTicketsOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#12041A] border border-pink-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-pink-900/40 pb-3">
                <h2 className="text-base font-bold text-white">
                  Biletlerim ({tickets.length})
                </h2>
                <button
                  onClick={() => setIsTicketsOpen(false)}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {tickets.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">
                  Henüz alınmış bir biletiniz yok.
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketForQR(t)} // Tıklanınca Doğrudan QR Açılır
                      className="bg-[#0A020E] p-4 border border-pink-900/40 hover:border-pink-500 rounded-2xl flex justify-between items-center cursor-pointer transition-all group"
                    >
                      <div className="flex-1 mr-2">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-pink-300 transition-colors">
                          {t.eventTitle}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          📍 {t.eventLocation}
                        </p>
                      </div>
                      <span className="text-xs bg-pink-600/20 text-pink-300 border border-pink-500/30 px-3 py-1.5 rounded-xl font-bold group-hover:bg-pink-600 group-hover:text-white transition-all whitespace-nowrap">
                        QR Gör →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. DOĞRUDAN AÇILAN QR KOD MODALI */}
        {selectedTicketForQR && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#12041A] border border-pink-500/30 w-full max-w-sm rounded-3xl p-6 text-center space-y-4 relative">
              <button
                onClick={() => setSelectedTicketForQR(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white leading-snug">
                {selectedTicketForQR.eventTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                Girişte bu QR kodu görevliye okutunuz.
              </p>

              <div className="bg-white p-4 rounded-2xl inline-block mx-auto border-4 border-pink-500/30 shadow-2xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${selectedTicketForQR.ticketCode}`}
                  alt="QR Code"
                  className="w-40 h-40"
                />
              </div>

              <p className="text-xs font-mono text-pink-300 font-bold bg-[#0A020E] py-2 rounded-xl border border-pink-900/30">
                Kod: {selectedTicketForQR.ticketCode}
              </p>

              <button
                onClick={() =>
                  handleCancelTicket(
                    selectedTicketForQR.id,
                    selectedTicketForQR.eventId,
                  )
                }
                className="w-full bg-rose-500/10 border border-rose-500/30 hover:bg-rose-600 hover:text-white text-rose-400 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                🚫 Bileti İptal Et / İade Et
              </button>
            </div>
          </div>
        )}

        {/* 4. PROFİL MODALI */}
        {isProfileOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#12041A] border border-pink-500/30 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-pink-900/40 pb-3">
                <h2 className="text-base font-bold text-white">
                  Profilim & Hesap Ayarları
                </h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 bg-[#0A020E] p-4 rounded-2xl border border-pink-900/30">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-md">
                  E
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Kullanıcı Hesabı
                  </h3>
                  <p className="text-xs text-slate-400">
                    kullanici@eventify.com
                  </p>
                  <span className="inline-block mt-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    Onaylı Üye
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between bg-[#0A020E] p-3 rounded-xl border border-pink-900/20">
                  <span>Aktif Biletler</span>
                  <span className="font-bold text-pink-400">
                    {tickets.length} Adet
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full bg-rose-500/10 border border-rose-500/30 hover:bg-rose-600 hover:text-white text-rose-400 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        )}

        {/* ETKİNLİK OLUŞTUR MODALI */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#12041A] border border-pink-500/30 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-pink-900/40 pb-4">
                <h2 className="text-lg font-bold text-white">
                  Yeni Etkinlik Oluştur
                </h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-pink-300 mb-1">
                    Etkinlik Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Örn: Alaçatı Jazz Fest"
                    className="w-full bg-[#0A020E] border border-pink-900/40 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-pink-300 mb-1">
                    Konum *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Örn: Alsancak, İzmir"
                    className="w-full bg-[#0A020E] border border-pink-900/40 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
                >
                  Yayınla →
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
