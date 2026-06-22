"use client"
import { useState } from "react"

import React from 'react'

const BookingPage = () => {

    const [formData, setFormData] = useState({
        senderName: "",
        senderPhone: "",
        receiverName: "",
        receiverPhone: "",
        pickupAddress: "",
        deliveryAddress: "",
        packageDetails: "",
    })

    const [loading, setLoading] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const res = await fetch("/api/deliveries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })

        setLoading(false)

        if(res.ok) {
            alert("Delivery booked successfully!")
            setFormData({
                senderName: "",
                senderPhone: "",
                receiverName: "",
                receiverPhone: "",
                pickupAddress: "",
                deliveryAddress: "",
                packageDetails: "",
            })
        } else {
            alert("Failed to book delivery")
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Book a Delivery</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="senderName" value={formData.senderName} onChange={handleChange} placeholder="Sender Name" className="w-full border p-2" />
                <input name="senderPhone" value={formData.senderPhone} onChange={handleChange} placeholder="Sender Phone" className="w-full border p-2" />
                <input name="receiverName" value={formData.receiverName} onChange={handleChange} placeholder="Receiver Name" className="w-full border p-2" />
                <input name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} placeholder="Receiver Phone" className="w-full border p-2" />
                <input name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} placeholder="Pickup Address" className="w-full border p-2" />
                <input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} placeholder="Delivery Address" className="w-full border p-2" />
                <textarea name="packageDetails" value={formData.packageDetails} onChange={handleChange} placeholder="Package Details" className="w-full border p-2" />
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                {loading ? "Booking..." : "Book Delivery"}
                </button>
            </form>
        </div>
    )
}

export default BookingPage
