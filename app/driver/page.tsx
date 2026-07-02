"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  MapPin,
  Package,
  Phone,
  CheckCircle,
  Search,
  ArrowLeft,
} from "lucide-react";

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
};

export default function DriverPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  async function fetchDeliveries() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    window.location.href = "/login";
    return;
  }

  const user = JSON.parse(storedUser);

  if (user.role !== "DRIVER") {
    alert("Only drivers can access this page");
    window.location.href = "/login";
    return;
  }

  const res = await fetch(`/api/drivers/${user.id}/deliveries`);
  const data = await res.json();

  setDeliveries(data);
  setSelectedDelivery(data[0] || null);
}

  async function updateStatus(status: string) {
    if (!selectedDelivery) return;

    setLoading(true);

    const res = await fetch(`/api/deliveries/${selectedDelivery.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to update delivery status");
      return;
    }

    const updated = await res.json();

    setSelectedDelivery(updated);

    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === updated.id ? updated : delivery
      )
    );

    alert(`Delivery marked as ${status}`);
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    const q = search.toLowerCase();

    return (
      delivery.id.toLowerCase().includes(q) ||
      delivery.receiverName.toLowerCase().includes(q) ||
      delivery.deliveryAddress.toLowerCase().includes(q) ||
      delivery.status.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-black text-white">
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

        <div className="mt-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-300">Driver Dashboard</p>
            <h1 className="text-4xl font-light">Welcome back, Driver</h1>
          </div>

          <Link
            href="/track"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-zinc-900 px-5 py-3 text-sm hover:border-purple-500 hover:text-purple-400"
          >
            <ArrowLeft size={18} />
            Back to tracking
          </Link>
        </div>
      </header>

      <section className="mt-10 grid grid-cols-[340px_1fr] border-t border-white/20">
        <aside className="min-h-[760px] border-r border-white/20 px-5 py-7">
          <div className="flex items-center gap-2 rounded-md bg-zinc-800 px-3 py-3 text-sm text-gray-300">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search delivery"
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="mt-7 space-y-4">
            {filteredDeliveries.length === 0 && (
              <p className="text-gray-400">No deliveries found</p>
            )}

            {filteredDeliveries.map((delivery) => {
              const active = selectedDelivery?.id === delivery.id;

              return (
                <button
                  key={delivery.id}
                  onClick={() => setSelectedDelivery(delivery)}
                  className={`w-full rounded-xl p-4 text-left transition ${
                    active
                      ? "bg-purple-950/60 ring-1 ring-purple-500"
                      : "bg-zinc-950 hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs text-purple-400">
                      {delivery.id}
                    </p>

                    <span className="rounded-full bg-orange-900/60 px-3 py-1 text-[10px] text-orange-300">
                      {delivery.status}
                    </span>
                  </div>

                  <p className="mt-3 font-semibold">
                    {delivery.receiverName}
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                    {delivery.deliveryAddress}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="px-10 py-8">
          {!selectedDelivery ? (
            <div className="flex h-[600px] items-center justify-center rounded-2xl border border-white/15 bg-zinc-950 text-gray-400">
              Select a delivery to view driver details
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-purple-500/30 bg-zinc-950 p-7 shadow-[0_0_45px_rgba(168,85,247,0.18)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Delivery ID</p>
                    <h2 className="mt-2 text-3xl font-bold text-purple-400">
                      {selectedDelivery.id}
                    </h2>
                  </div>

                  <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-bold">
                    {selectedDelivery.status}
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <InfoCard
                    icon={<MapPin className="text-purple-400" />}
                    title="Pickup Location"
                    value={selectedDelivery.pickupAddress}
                  />

                  <InfoCard
                    icon={<MapPin className="text-pink-400" />}
                    title="Drop-off Location"
                    value={selectedDelivery.deliveryAddress}
                  />

                  <InfoCard
                    icon={<Phone className="text-purple-400" />}
                    title="Receiver"
                    value={`${selectedDelivery.receiverName} • ${selectedDelivery.receiverPhone}`}
                  />

                  <InfoCard
                    icon={<Package className="text-pink-400" />}
                    title="Package"
                    value={`${selectedDelivery.packageType || "Package"} ${
                      selectedDelivery.weight
                        ? `• ${selectedDelivery.weight}kg`
                        : ""
                    }`}
                  />
                </div>

                {selectedDelivery.driverNotes && (
                  <div className="mt-6 rounded-xl border border-white/10 bg-black/60 p-5">
                    <p className="text-sm text-gray-400">Driver Notes</p>
                    <p className="mt-2 text-lg">
                      {selectedDelivery.driverNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-5">
                <button
                  disabled={loading}
                  onClick={() => updateStatus("PICKED_UP")}
                  className="rounded-2xl border border-blue-500/50 bg-blue-950/40 px-5 py-5 font-bold text-blue-300 transition hover:bg-blue-900/60 disabled:opacity-50"
                >
                  Mark Picked Up
                </button>

                <button
                  disabled={loading}
                  onClick={() => updateStatus("IN_TRANSIT")}
                  className="rounded-2xl border border-purple-500/50 bg-purple-950/40 px-5 py-5 font-bold text-purple-300 transition hover:bg-purple-900/60 disabled:opacity-50"
                >
                  Mark In Transit
                </button>

                <button
                  disabled={loading}
                  onClick={() => updateStatus("DELIVERED")}
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-5 font-bold shadow-[0_0_35px_rgba(236,72,153,0.45)] transition hover:scale-[1.02] disabled:opacity-50"
                >
                  <CheckCircle className="mr-2 inline" />
                  Complete Delivery
                </button>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">
                <h3 className="mb-5 text-xl font-bold">Driver Progress</h3>

                <div className="grid grid-cols-4 gap-4">
                  <ProgressBox
                    label="Pending"
                    active={selectedDelivery.status === "PENDING"}
                    done={[
                      "PICKED_UP",
                      "IN_TRANSIT",
                      "DELIVERED",
                    ].includes(selectedDelivery.status)}
                  />

                  <ProgressBox
                    label="Picked Up"
                    active={selectedDelivery.status === "PICKED_UP"}
                    done={["IN_TRANSIT", "DELIVERED"].includes(
                      selectedDelivery.status
                    )}
                  />

                  <ProgressBox
                    label="In Transit"
                    active={selectedDelivery.status === "IN_TRANSIT"}
                    done={selectedDelivery.status === "DELIVERED"}
                  />

                  <ProgressBox
                    label="Delivered"
                    active={selectedDelivery.status === "DELIVERED"}
                    done={selectedDelivery.status === "DELIVERED"}
                  />
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-5">
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-sm text-gray-400">{title}</p>
      </div>

      <p className="mt-4 text-lg">{value}</p>
    </div>
  );
}

function ProgressBox({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 text-center ${
        done
          ? "border-green-500 bg-green-950/40 text-green-300"
          : active
          ? "border-purple-500 bg-purple-950/40 text-purple-300"
          : "border-white/10 bg-black/60 text-gray-500"
      }`}
    >
      <Truck className="mx-auto mb-3" />
      <p className="font-semibold">{label}</p>
    </div>
  );
}