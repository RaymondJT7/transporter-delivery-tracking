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
} from "lucide-react";

type Driver = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

type Delivery = {
  id: string;
  receiverName: string;
  receiverPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType?: string | null;
  weight?: number | null;
  status: string;
  createdAt: string;
  assignedDriver?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
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

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ driverId }),
    });

    if (!res.ok) {
      alert("Failed to assign driver");
      return;
    }

    alert("Driver assigned successfully");
    await fetchDashboard();
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
          <Image
            src="/LogiTrackLogo.png"
            alt="LogiTrack"
            width={170}
            height={100}
            priority
          />
          <div className="h-px flex-1 bg-white/30" />
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-300">Admin Dashboard</p>
            <h1 className="text-4xl font-light">LogiTrack Control Panel</h1>
          </div>

          <Link
            href="/login"
            className="rounded-xl border border-white/20 bg-zinc-900 px-5 py-3 text-sm hover:border-purple-500 hover:text-purple-400"
          >
            Sign Out
          </Link>
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
                  </tr>
                </thead>

                <tbody>
                  {filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="border-t border-white/10 hover:bg-zinc-900/60"
                    >
                      <td className="p-4 text-purple-400">{delivery.id}</td>

                      <td className="p-4">{delivery.receiverName}</td>

                      <td className="p-4">
                        {delivery.packageType || "Package"}
                        {delivery.weight ? ` • ${delivery.weight}kg` : ""}
                      </td>

                      <td className="p-4 text-gray-400">
                        {delivery.deliveryAddress}
                      </td>

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
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
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