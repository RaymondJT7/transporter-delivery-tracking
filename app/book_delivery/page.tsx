// Coded by Raymond J Tilstone
// Design by Cione Botha
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, MapPin, Package } from "lucide-react"
import Header from "../header/page"

export default function Book_Delivery() {

  const router = useRouter()

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
    router.push("/package_type?" + new URLSearchParams(formData).toString())
    // setLoading(true)

    // const res = await fetch("/api/deliveries", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // })

    // setLoading(false)

    // if (res.ok) {
    //   alert("Delivery booked successfully!")
    //   setFormData({
    //     senderName: "",
    //     senderPhone: "",
    //     receiverName: "",
    //     receiverPhone: "",
    //     pickupAddress: "",
    //     deliveryAddress: "",
    //     packageDetails: "",
    //   })
    // } else {
    //   alert("Failed to book delivery")
    // }
  }

  return (
    
    <div className="flex flex-col bg-black">
      <Header />


      <main className="min-h-screen flex items-center justify-center text-white px-6 py-10">

        <section className="w-full md:w-[50%]">
          <h1 className="text-2xl font-bold text-center mb-6">Book Delivery</h1>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            <label htmlFor="pickupAddress">Pickup Address</label>
            <Input id="pickupAddress" icon={<MapPin />} name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} placeholder="Pickup Address" />
            <label htmlFor="deliveryAddress">Delivery Address</label>
            <Input id="deliveryAddress" icon={<MapPin />} name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} placeholder="Delivery Address" />
            
            <div className="grid grid-cols-2 gap-5 mt-3">
              <div className="">
                <label htmlFor="receiverName">Recipient Name</label>
                <Input id="receiverName" icon={<User />} name="receiverName" value={formData.receiverName} onChange={handleChange} placeholder="Receiver Name" />
              </div>

              <div className="">
                <label htmlFor="receiverPhone">Phone</label>
                <Input id="receiverPhone" icon={<Phone />} name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} placeholder="Receiver Phone" />
              </div>
            </div>
            
            

            {/* <Input icon={<User />} name="senderName" value={formData.senderName} onChange={handleChange} placeholder="Sender Name" />
            <Input icon={<Phone />} name="senderPhone" value={formData.senderPhone} onChange={handleChange} placeholder="Sender Phone" />
             */}
                  
            {/* <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-3 ring-1 ring-purple-500/40">
              <Package className="text-pink-400" />
              <textarea
                name="packageDetails"
                value={formData.packageDetails}
                onChange={handleChange}
                placeholder="Package Details"
                className="w-full bg-transparent text-gray-300 outline-none placeholder:text-gray-500"
              />
            </div> */}

            <div className="flex items-center justify-center">
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

function Input({
  icon,
  name,
  value,
  onChange,
  placeholder,
  id,
}: {
  icon: React.ReactNode
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  id?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-3 ring-1 ring-purple-500/40 mt-5">
      <span className="text-pink-400">{icon}</span>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        
        className="w-full bg-transparent text-gray-300 outline-none placeholder:text-gray-500"
      />
    </div>
  )
}
