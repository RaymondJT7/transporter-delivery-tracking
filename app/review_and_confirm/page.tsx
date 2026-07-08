// Coded by Raymond J Tilstone
// Design by Cione Botha
"use client"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "../header/page"
import { Square } from "lucide-react"

function ReviewAndConfirmContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const formData = Object.fromEntries(searchParams.entries())

    async function handleConfirm() {
        const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        })

        if (res.ok) {
        alert("Delivery booked successfully! Thank you for booking your delivery with us!")
        router.push("/") // final thank-you page
        } else {
        alert("Failed to book delivery")
        }
    }

    return (
        <div className="flex flex-col bg-black">
            <Header />
            <main className="min-h-screen flex items-center justify-center text-white px-6 py-10">
                <section className="w-full md:w-[50%]">
                    <h1 className="text-2xl font-bold text-center mb-6">Review and Confirm</h1>
                    <div className="flex flex-col w-full bg-[#121212]">
                        <div className="p-2 m-3 bg-[#1e1e1e]">
                            <Square className="inline w-3 h-3 bg-[#595858] text-[#595858]" />
                            <h3 className="inline ml-2 text-sm text-[#595858]">Pickup</h3>
                            <p>{formData.pickupAddress}</p>
                            <br />
                            <Square className="inline w-3 h-3 bg-[#c99f08] text-[#c99f08]" />
                            <h3 className="inline ml-2 text-sm text-[#595958]">Delivery</h3>
                            <p>{formData.deliveryAddress}</p>
                        </div>
                        
                        <div className="flex flex-row m-3 gap-3">
                            <div className="w-[50%] bg-[#1e1e1e] p-2">
                                <h3 className="text-sm text-[#595858]">Recipient</h3>
                                <p>{formData.receiverName}</p>
                            </div>
                            <div className="w-[50%] bg-[#1e1e1e] p-2">
                                <h3 className="text-sm text-[#595858]">Phone</h3>
                                <p>{formData.receiverPhone}</p>
                            </div>
                        </div>

                        <div className="flex flex-row m-3 gap-3">
                            <div className="w-[50%] bg-[#1e1e1e] p-2">
                                <h3 className="text-sm text-[#595858]">Package</h3>
                                <p>{formData.packageType}</p>
                            </div>
                            <div className="w-[50%] bg-[#1e1e1e] p-2">
                                <h3 className="text-sm text-[#595858]">Weight</h3>
                                <p>{formData.weight}</p>
                            </div>
                        </div>

                        {/* <div className="flex flex-row m-3 gap-3">
                            <div className="w-[50%] bg-[#1e1e1e] p-2">
                                <h3 className="text-sm text-[#595858]">Service</h3>
                                <p>{formData.receiverName}</p>
                            </div>
                            <div className="w-[50%] bg-[#1e1e1e] p-2">
                                <h3 className="text-sm text-[#595858]">Time Slot</h3>
                                <p>{formData.receiverPhone}</p>
                            </div>
                        </div> */}

                        <div className="p-2 m-3 bg-[#1e1e1e]">
                            <h3 className="text-sm text-[#595858]">Driver Notes</h3>
                            <p>{formData.driverNotes}</p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                        onClick={handleConfirm}
                        className="w-50 rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 py-3 text-lg font-bold shadow-[0_0_35px_rgba(236,72,153,0.7)] transition hover:scale-105"
                        >
                        Confirm and Pay
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default function Review_And_Confirm() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <ReviewAndConfirmContent />
        </Suspense>
    )
}