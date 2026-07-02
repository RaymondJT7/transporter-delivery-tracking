"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Shield,
  Plus,
  X,
  Eye,
  MapPin,
} from "lucide-react";

type Driver = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

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
  updatedAt?: string;
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

type DashboardData = {
  stats: {
    totalDeliveries: number;
    pending: number;
    pickedUp: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  users: {
    customers: number;
    drivers: number;
    admins: number;
  };
  recentDeliveries: Delivery[];
};

type NewDeliveryForm = {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  weight: string;
  driverNotes: string;
};

const emptyForm: NewDeliveryForm = {
  senderName: "",
  senderPhone: "",
  receiverName: "",
  receiverPhone: "",
  pickupAddress: "",
  deliveryAddress: "",
  packageType: "Parcel",
  weight: "",
  driverNotes: "",
};

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newDelivery, setNewDelivery] = useState<NewDeliveryForm>(emptyForm);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const dashboardRes = await fetch("/api/admin/dashboard");
      const dashboardJson = await dashboardRes.json();

      const driversRes = await fetch("/api/drivers");
      const driversJson = await driversRes.json();

      if (!dashboardRes.ok) {
        setError(dashboardJson.error || "Failed to load admin dashboard");
        return;
      }

      setData(dashboardJson);
      setDrivers(driversJson);
    } catch {
      setError("Could not connect to admin dashboard API");
    }
  }

  async function assignDriver(deliveryId: string) {
    const driverId = selectedDrivers[deliveryId];

    if (!driverId) {
      alert("Please select a driver first");
      return;
    }

    const res = await fetch(`/api/deliveries/${deliveryId}/assign-driver`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driverId }),
    });

    if (!res.ok) {
      alert("Failed to assign driver");
      return;
    }

    alert("Driver assigned successfully");
    await fetchDashboard();
  }

  async function createDelivery(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDelivery),
      });

      if (!res.ok) {
        alert("Failed to create delivery");
        return;
      }

      alert("Delivery created successfully");
      setNewDelivery(emptyForm);
      setShowCreateModal(false);
      await fetchDashboard();
    } catch {
      alert("Could not connect to delivery API");
    } finally {
      setCreating(false);
    }
  }

  const filteredDeliveries =
    data?.recentDeliveries.filter((delivery) => {
      const q = search.toLowerCase();

      return (
        delivery.id.toLowerCase().includes(q) ||
        delivery.receiverName.toLowerCase().includes(q) ||
        delivery.status.toLowerCase().includes(q) ||
        delivery.deliveryAddress.toLowerCase().includes(q)
      );
    }) || [];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="px-8 pt-8">
        <div className="flex items-center gap-16">
          <Image src="/LogiTrackLogo.png" alt="LogiTrack" width={170} height={100} priority />
          <div className="h-px flex-1 bg-white/30" />
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-300">Admin Dashboard</p>
            <h1 className="text-4xl font-light">LogiTrack Control Panel</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-bold shadow-[0_0_25px_rgba(236,72,153,0.35)] transition hover:scale-105"
            >
              <Plus size={18} />
              New Delivery
            </button>

            <Link
              href="/login"
              className="rounded-xl border border-white/20 bg-zinc-900 px-5 py-3 text-sm hover:border-purple-500 hover:text-purple-400"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {error ? (
        <div className="flex h-[500px] items-center justify-center text-red-400">
          {error}
        </div>
      ) : !data ? (
        <div className="flex h-[500px] items-center justify-center text-gray-400">
          Loading admin dashboard...
        </div>
      ) : (
        <section className="px-8 py-10">
          <div className="grid grid-cols-6 gap-5">
            <StatCard title="Total" value={data.stats.totalDeliveries} icon={<Package />} />
            <StatCard title="Pending" value={data.stats.pending} icon={<Clock />} />
            <StatCard title="Picked Up" value={data.stats.pickedUp} icon={<Truck />} />
            <StatCard title="In Transit" value={data.stats.inTransit} icon={<Truck />} />
            <StatCard title="Delivered" value={data.stats.delivered} icon={<CheckCircle />} />
            <StatCard title="Cancelled" value={data.stats.cancelled} icon={<XCircle />} />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-5">
            <UserCard title="Customers" value={data.users.customers} />
            <UserCard title="Drivers" value={data.users.drivers} />
            <UserCard title="Admins" value={data.users.admins} />
          </div>

          <section className="mt-10 rounded-2xl border border-purple-500/30 bg-zinc-950 p-6 shadow-[0_0_45px_rgba(168,85,247,0.15)]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Deliveries</h2>

              <div className="flex w-80 items-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm text-gray-300">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search deliveries"
                  className="w-full bg-transparent outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-gray-300">
                  <tr>
                    <th className="p-4">Tracking ID</th>
                    <th className="p-4">Receiver</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Driver</th>
                    <th className="p-4">Created</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="border-t border-white/10 hover:bg-zinc-900/60">
                      <td className="p-4 text-purple-400">{delivery.id}</td>
                      <td className="p-4">{delivery.receiverName}</td>
                      <td className="p-4">
                        {delivery.packageType || "Package"}
                        {delivery.weight ? ` • ${delivery.weight}kg` : ""}
                      </td>
                      <td className="p-4 text-gray-400">{delivery.deliveryAddress}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-orange-900/60 px-3 py-1 text-xs text-orange-300">
                          {delivery.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <select
                            value={selectedDrivers[delivery.id] || ""}
                            onChange={(e) =>
                              setSelectedDrivers({
                                ...selectedDrivers,
                                [delivery.id]: e.target.value,
                              })
                            }
                            className="max-w-[170px] rounded-lg border border-purple-500 bg-zinc-900 px-3 py-2 text-white"
                          >
                            <option value="">
                              {delivery.assignedDriver?.name || "Select Driver"}
                            </option>

                            {drivers.map((driver) => (
                              <option key={driver.id} value={driver.id}>
                                {driver.name || driver.email}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => assignDriver(delivery.id)}
                            className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 font-bold"
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(delivery.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedDelivery(delivery)}
                          className="flex items-center gap-2 rounded-lg border border-purple-500 px-4 py-2 text-purple-300 hover:bg-purple-950/50"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10 grid grid-cols-4 gap-5">
            <QuickAction title="Manage Drivers" href="/admin/drivers" />
            <QuickAction title="View Ratings" href="/admin/ratings" />
            <QuickAction title="Reports" href="/admin/reports" />
            <QuickAction title="All Deliveries" href="/track" />
          </section>
        </section>
      )}

      {selectedDelivery && (
        <DeliveryDetailsModal
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
        />
      )}

      {showCreateModal && (
        <CreateDeliveryModal
          newDelivery={newDelivery}
          setNewDelivery={setNewDelivery}
          creating={creating}
          createDelivery={createDelivery}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </main>
  );
}

function DeliveryDetailsModal({
  delivery,
  onClose,
}: {
  delivery: Delivery;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-purple-500/40 bg-black p-8 shadow-[0_0_70px_rgba(236,72,153,0.45)]">
        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-white">
          <X />
        </button>

        <p className="text-sm text-purple-300">Delivery Details</p>
        <h2 className="mt-2 text-3xl font-bold text-purple-400">{delivery.id}</h2>

        <div className="mt-6 flex items-center gap-3">
          <span className="rounded-full bg-orange-900/60 px-4 py-2 text-sm text-orange-300">
            {delivery.status}
          </span>

          <span className="text-sm text-gray-400">
            Created {new Date(delivery.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5">
          <DetailCard title="Sender" value={`${delivery.senderName || "N/A"} • ${delivery.senderPhone || "N/A"}`} />
          <DetailCard title="Receiver" value={`${delivery.receiverName} • ${delivery.receiverPhone}`} />

          <DetailCard icon title="Pickup Address" value={delivery.pickupAddress} />
          <DetailCard icon title="Delivery Address" value={delivery.deliveryAddress} />

          <DetailCard
            title="Package"
            value={`${delivery.packageType || "Package"}${delivery.weight ? ` • ${delivery.weight}kg` : ""}`}
          />

          <DetailCard
            title="Assigned Driver"
            value={delivery.assignedDriver?.name || "Not assigned"}
          />

          <div className="col-span-2">
            <DetailCard title="Driver Notes" value={delivery.driverNotes || "No notes"} />
          </div>
        </div>

        <h3 className="mt-8 text-xl font-bold">Status History</h3>

        <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950 p-5">
          {delivery.statusHistory?.length ? (
            delivery.statusHistory.map((history, index) => (
              <div key={history.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index !== delivery.statusHistory!.length - 1 && (
                  <div className="absolute left-[7px] top-5 h-full w-px bg-purple-500/40" />
                )}

                <div className="z-10 mt-1 h-4 w-4 rounded-full bg-purple-500" />

                <div>
                  <p className="font-bold text-purple-300">{history.status}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(history.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No status history yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateDeliveryModal({
  newDelivery,
  setNewDelivery,
  creating,
  createDelivery,
  onClose,
}: {
  newDelivery: NewDeliveryForm;
  setNewDelivery: React.Dispatch<React.SetStateAction<NewDeliveryForm>>;
  creating: boolean;
  createDelivery: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl border border-purple-500/40 bg-black p-8 shadow-[0_0_70px_rgba(236,72,153,0.45)]">
        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-white">
          <X />
        </button>

        <h2 className="text-3xl font-bold">Create New Delivery</h2>
        <p className="mt-2 text-sm text-gray-400">Add a new delivery to the database.</p>

        <form onSubmit={createDelivery} className="mt-8 grid grid-cols-2 gap-4">
          <Input label="Sender Name" value={newDelivery.senderName} onChange={(value) => setNewDelivery({ ...newDelivery, senderName: value })} />
          <Input label="Sender Phone" value={newDelivery.senderPhone} onChange={(value) => setNewDelivery({ ...newDelivery, senderPhone: value })} />
          <Input label="Receiver Name" value={newDelivery.receiverName} onChange={(value) => setNewDelivery({ ...newDelivery, receiverName: value })} required />
          <Input label="Receiver Phone" value={newDelivery.receiverPhone} onChange={(value) => setNewDelivery({ ...newDelivery, receiverPhone: value })} required />
          <Input label="Pickup Address" value={newDelivery.pickupAddress} onChange={(value) => setNewDelivery({ ...newDelivery, pickupAddress: value })} required />
          <Input label="Delivery Address" value={newDelivery.deliveryAddress} onChange={(value) => setNewDelivery({ ...newDelivery, deliveryAddress: value })} required />

          <div>
            <label className="text-sm text-gray-400">Package Type</label>
            <select
              value={newDelivery.packageType}
              onChange={(e) => setNewDelivery({ ...newDelivery, packageType: e.target.value })}
              className="mt-2 w-full rounded-xl border border-purple-500/40 bg-zinc-900 px-4 py-3 outline-none"
            >
              <option>Parcel</option>
              <option>Document</option>
              <option>Large</option>
              <option>Fragile</option>
            </select>
          </div>

          <Input label="Weight KG" type="number" value={newDelivery.weight} onChange={(value) => setNewDelivery({ ...newDelivery, weight: value })} />

          <div className="col-span-2">
            <label className="text-sm text-gray-400">Driver Notes</label>
            <textarea
              value={newDelivery.driverNotes}
              onChange={(e) => setNewDelivery({ ...newDelivery, driverNotes: e.target.value })}
              placeholder="Example: Leave at gate, fragile package, call customer..."
              className="mt-2 h-24 w-full rounded-xl border border-purple-500/40 bg-zinc-900 px-4 py-3 outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="col-span-2 mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl border border-white/20 px-6 py-3 hover:border-purple-500">
              Cancel
            </button>

            <button type="submit" disabled={creating} className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-bold disabled:opacity-60">
              {creating ? "Creating..." : "Create Delivery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailCard({ title, value, icon }: { title: string; value: string; icon?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950 p-5">
      <div className="flex items-center gap-2">
        {icon && <MapPin size={18} className="text-purple-400" />}
        <p className="text-sm text-gray-400">{title}</p>
      </div>
      <p className="mt-3 text-lg">{value}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-purple-500/40 bg-zinc-900 px-4 py-3 outline-none placeholder:text-gray-600"
      />
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-[0_0_25px_rgba(168,85,247,0.08)]">
      <div className="flex items-center justify-between text-purple-400">
        {icon}
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="mt-4 text-sm text-gray-400">{title}</p>
    </div>
  );
}

function UserCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
      <div className="flex items-center gap-4">
        <Users className="text-pink-400" />
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-purple-500/30 bg-zinc-950 p-6 text-center font-bold transition hover:border-pink-500 hover:text-pink-400"
    >
      <Shield className="mx-auto mb-3 text-purple-400" />
      {title}
    </Link>
  );
}