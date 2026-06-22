import Image from "next/image";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import RatingCard from "@/components/RatingCard";
import Footer from "@/components/Footer";


export default function Home() {
  return (   
      <main className="min-h-screen bg-black text-white">

        <Header />
        <Navbar />

        <div className="flex justify-center pt-12">
          <RatingCard />
        </div>

        <Footer />        
        
      </main>
  );
}
