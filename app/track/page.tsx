"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import RatingCard from "../RatingCard/page";
import { Search, MapPin, Star, Square } from "lucide-react";

const TrackingMap = dynamic(() => import("../components/TrackingMap"), {
  ssr: false,
});

type Delivery = {
  id: string;
  senderName?: string | null;
  senderPhone?: string | null;
  receiverName: string;
  receiverPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType?: string | null;
  weight?: number | null;
  driverNotes?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;

  assignedDriver?: {
    id: string;
    name: string | null;
    email: string;
  } | null;

  statusHistory?: {
    id: string;
    status: string;
    createdAt: string;
  }[];
};

export default function TrackPage() {
  const [showRating, setShowRating] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const res = await fetch("/api/deliveries");
        const data = await res.json();

        const normalizedDeliveries = Array.isArray(data) ? data : [data];

        setDeliveries(normalizedDeliveries);
        setSelectedDelivery(normalizedDeliveries[0] || null);
      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
      }
    }

    fetchDeliveries();
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const query = search.toLowerCase();

    return (
      delivery.id.toLowerCase().includes(query) ||
      delivery.receiverName.toLowerCase().includes(query) ||
      delivery.deliveryAddress.toLowerCase().includes(query) ||
      delivery.status.toLowerCase().includes(query)
    );
  });

  return (
    <main className="relative min-h-screen bg-black text-white">
      <header className="px-8 pt-8">
        <div className="flex items-center gap-16">
          <Image
            src="/logo.png"
            alt="LogiTrack"
            width={170}
            height={100}
            priority
          />
          <div className="h-px flex-1 bg-white/30" />
        </div>

        <h1 className="mt-12 text-4xl font-light">Welcome back, Cioné</h1>
      </header>

      <nav className="mt-8 border-y border-white/25 px-8">
        <div className="flex gap-10">
          <Link
            href="/track"
            className="border-b-2 border-purple-500 py-5 text-purple-400"
          >
            Track
          </Link>

          <Link href="/book-delivery" className="py-5">
            Book Delivery
          </Link>
        </div>
      </nav>

      <section className="grid grid-cols-[320px_1fr]">
        <aside className="min-h-[760px] border-r border-white/25 px-4 py-7">
          <div className="flex items-center gap-2 rounded-md bg-zinc-800 px-3 py-3 text-sm text-gray-300">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Tracking Number"
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="mt-8 space-y-4">
            {filteredDeliveries.length === 0 && (
              <p className="text-gray-400">No deliveries found</p>
            )}

            {filteredDeliveries.map((delivery) => {
              const active = selectedDelivery?.id === delivery.id;

              return (
                <button
                  key={delivery.id}
                  onClick={() => setSelectedDelivery(delivery)}
                  className={`block w-full rounded-lg p-3 text-left transition ${
                    active
                      ? "bg-purple-950/60 ring-1 ring-purple-500"
                      : "hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3 text-purple-400">
                    <Square size={14} fill="currentColor" />
                    <span className="text-xs">{delivery.id}</span>
                  </div>

                  <div className="mt-3 pl-8 leading-6 text-gray-200">
                    <p className="font-semibold">{delivery.receiverName}</p>
                    <p className="text-sm text-gray-400">
                      {delivery.deliveryAddress}
                    </p>
                    <p className="mt-2 text-xs text-orange-400">
                      {delivery.status}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 border-t border-white/25" />
        </aside>

        <section className="px-10 py-10">
          <h2 className="text-3xl font-semibold">Tracking Number</h2>

          <p className="mt-2 text-3xl font-bold text-purple-500">
            {selectedDelivery?.id || "No delivery selected"}
          </p>

          <div className="relative mt-8 h-80 overflow-hidden rounded-xl border border-white/15 bg-zinc-950 shadow-[0_0_35px_rgba(168,85,247,0.15)]">
            {selectedDelivery ? (
              <TrackingMap
                pickupAddress={selectedDelivery.pickupAddress}
                deliveryAddress={selectedDelivery.deliveryAddress}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                Select a delivery to view map
              </div>
            )}

            <div className="absolute right-5 top-5 z-[500] rounded bg-orange-900/80 px-3 py-1 text-orange-400">
              ● LIVE
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-lg border border-white/15 bg-zinc-900 px-6 py-5">
            <h3 className="text-2xl font-bold">ETA</h3>
            <p className="text-2xl font-semibold">
              <span className="mr-4 text-orange-400">■</span>
              {selectedDelivery ? "33:24" : "--:--"}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <InfoCard
              title="From"
              value={selectedDelivery?.pickupAddress || "Pickup address"}
              icon
            />

            <InfoCard
              title="To"
              value={selectedDelivery?.deliveryAddress || "Delivery address"}
              icon
            />
          </div>

          <div className="mt-6 grid grid-cols-4 gap-6">
            <InfoCard
              title="Recipient"
              value={selectedDelivery?.receiverName || "Receiver name"}
            />

            <InfoCard
              title="Driver"
              value={selectedDelivery?.assignedDriver?.name || "Not assigned"}
            />

            <InfoCard
              title="Package"
              value={
                selectedDelivery
                  ? `${selectedDelivery.packageType || "Package"} (${
                      selectedDelivery.weight ?? "N/A"
                    } kg)`
                  : "Package details"
              }
            />

            <InfoCard
              title="Driver Notes"
              value={selectedDelivery?.driverNotes || "No notes"}
            />
          </div>

          <div className="mt-6 rounded-lg border border-white/15 bg-zinc-900 p-5">
            <p className="text-sm text-gray-300">Current Status</p>
            <p className="mt-3 text-xl font-bold text-purple-400">
              {selectedDelivery?.status || "PENDING"}
            </p>
          </div>

          <button
            onClick={() => setShowRating(true)}
            disabled={!selectedDelivery}
            className="mt-6 flex w-64 items-center gap-3 rounded-lg border border-white/15 bg-zinc-900 px-5 py-4 text-lg transition hover:border-purple-500 hover:text-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Star size={24} />
            Rate this delivery
          </button>

          <h3 className="mt-7 text-xl">Status timeline</h3>

          <div className="mt-3 w-[440px] rounded-lg border border-white/15 bg-zinc-900 p-6">
            {selectedDelivery?.statusHistory?.length ? (
              selectedDelivery.statusHistory.map((history, index) => (
                <TimelineItem
                  key={history.id}
                  time={new Date(history.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  status={history.status}
                  color={getTimelineColor(history.status)}
                  title={history.status.replaceAll("_", " ")}
                  place={selectedDelivery.deliveryAddress}
                  last={index === selectedDelivery.statusHistory!.length - 1}
                />
              ))
            ) : (
              <p className="text-center text-gray-400">
                No status history available yet.
              </p>
            )}
          </div>
        </section>
      </section>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          document.cookie =
            "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/login";
        }}
        className="fixed bottom-8 right-10 text-3xl font-light"
      >
        Sign Out
      </button>

      {showRating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg">
            <div className="relative rounded-3xl border border-purple-500/40 bg-black shadow-[0_0_60px_rgba(236,72,153,0.45)]">
              <button
                onClick={() => setShowRating(false)}
                className="absolute right-4 top-4 z-[10000] flex h-8 w-8 items-center justify-center text-xl font-bold text-gray-400 transition hover:text-white"
              >
                ×
              </button>

              <RatingCard />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function getTimelineColor(status: string): "purple" | "blue" | "orange" {
  if (status === "DELIVERED") return "blue";
  if (status === "IN_TRANSIT") return "purple";
  if (status === "PICKED_UP") return "blue";
  return "orange";
}

function InfoCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-zinc-900 p-5">
      <p className="text-sm text-gray-300">{title}</p>

      <div className="mt-4 flex items-center gap-3">
        {icon && <MapPin size={24} fill="white" />}
        <p>{value}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  time,
  status,
  color,
  title,
  place,
  last,
}: {
  time: string;
  status: string;
  color: "purple" | "blue" | "orange";
  title: string;
  place: string;
  last?: boolean;
}) {
  const badge =
    color === "purple"
      ? "bg-purple-900 text-purple-300"
      : color === "blue"
      ? "bg-blue-900 text-blue-300"
      : "bg-orange-900 text-orange-300";

  return (
    <div className="relative flex gap-6 pb-8 last:pb-0">
      {!last && (
        <div className="absolute left-[7px] top-5 h-full w-px bg-white/40" />
      )}

      <div className="z-10 mt-1 h-4 w-4 rounded bg-orange-400" />

      <div>
        <div className="flex items-center gap-5">
          <span className="text-orange-400">{time}</span>
          <span className={`rounded px-3 py-1 font-mono ${badge}`}>
            {status}
          </span>
        </div>

        <h4 className="mt-3 text-xl font-semibold">{title}</h4>
        <p className="mt-1 text-gray-400">{place}</p>
      </div>
    </div>
  );
}