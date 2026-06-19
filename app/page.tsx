// Raymond J Tilstone
// Design by Cione Botha

import Image from "next/image";
import Link from "next/link";
import RegisterPage from "./register/page";
import LoginPage from "./login/page";

export default function Home() {

  return (

    // Home page parent container
    <div className="min-h-screen flex flex-col justify-center items-center bg-[radial-gradient(circle_at_top,rgba(126,34,206,0.6)_0%,rgba(26,5,46,0.4)_35%,rgba(0,0,0,0.2)_75%)] opacity-100 ">

      <img src="/LogiTrackLogo.png" alt="LogiTrack Logo" className="w-45 md:w-90" />

      <h3 className="text-xs md:text-lg px-2 py-1 md:p-0 text-purple-500">STAY UPDATED, STAY IN CONTROL</h3>
      <h3 className="text-xs md:text-lg px-2 py-1 md:p-0 text-pink-500 mb-5 text-center">MANAGE DELIVERIES WITH REAL-TIME TRACKING AND INSTANT UPDATES</h3>

      <img src="/HomepagePic1.png" alt="Homepage Image" className="w-50 md:w-100" />

      <div className="flex flex-col gap-3 p-2">
        <button className="bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl p-1 md:px-2 font-bold"><Link href="/register">Get Started →</Link></button>
        <button className="border border-solid border-white rounded-2xl font-bold p-1 md:px-2"><Link href="/login">Log In</Link></button>
      </div>
      
    </div>

  )

}
