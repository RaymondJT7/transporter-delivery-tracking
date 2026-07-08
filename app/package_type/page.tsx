"use client"

import React, { Suspense } from 'react'
import Header from '../header/page'
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function PackageTypeForm() {

    const router = useRouter()
    const searchParams = useSearchParams()

    // Grab data passed from previous step
    const initialData = Object.fromEntries(searchParams.entries())

    const [formData, setFormData] = useState({
        ...initialData,
        packageType: "",
        weight: "",
        driverNotes: "",
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    function handlePackageSelect(type: string) {
        setFormData({ ...formData, packageType: type })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        router.push("/review_and_confirm?" + new URLSearchParams(formData).toString())
    }

    return (
        <div className="flex flex-col bg-black">
            <Header />

            <main className="min-h-screen flex items-center justify-center text-white px-6 py-10">
                <section className="w-full md:w-[50%]">
                    <h1 className="text-2xl font-bold text-center mb-6">Package Type</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Package Type Selection */}
                        <div className="grid grid-cols-2 gap-4">
                        {["Document", "Parcel", "Large", "Fragile"].map((type) => (
                            <button
                            type="button"
                            key={type}
                            onClick={() => handlePackageSelect(type)}
                            className={`rounded-xl border px-4 py-6 text-center font-semibold transition ${
                                formData.packageType === type
                                ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.7)]"
                                : "bg-zinc-900 text-gray-300 border-purple-500/40 hover:scale-105"
                            }`}
                            >
                            {type}
                            </button>
                        ))}
                        </div>

                        {/* Weight */}
                        <div>
                            <label htmlFor="weight" className="block mb-2 font-semibold">Weight (kg)</label>
                            <input
                                id="weight"
                                name="weight"
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="e.g. 2.5"
                                className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-gray-300 outline-none ring-1 ring-purple-500/40 placeholder:text-gray-500"
                            />
                        </div>

                        {/* Driver Notes */}
                        <div>
                            <label htmlFor="driverNotes" className="block mb-2 font-semibold">Driver Notes</label>
                            <textarea
                                id="driverNotes"
                                name="driverNotes"
                                value={formData.driverNotes}
                                onChange={handleChange}
                                placeholder="e.g. Fragile, leave at door..."
                                className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-gray-300 outline-none ring-1 ring-purple-500/40 placeholder:text-gray-500"
                            />
                        </div>

                        <div className='flex justify-center items-center'>
                            {/* Continue Button */}
                            <button
                            type="submit"
                            className="w-50 rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 py-3 text-lg font-bold shadow-[0_0_35px_rgba(236,72,153,0.7)] transition hover:scale-105"
                            >
                            Continue
                            </button>
                        </div>
                        
                    </form>
                </section>
            </main>
        </div>
    )
}

export default function Package_Type() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <PackageTypeForm />
        </Suspense>
    )
}