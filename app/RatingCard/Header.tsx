import Image from "next/image";

export default function Header() {
    return (
        <header className="border-b border-gray-800">
            <div className="flex items-center justify-between px-8 py-6">

                <Image
                    src="/LogiTrackLogo(smaller).png"
                    alt="LogiTrack Logo"
                    width={200}
                    height={200}
                    className="object-contain"                    
                />               
           
                <div className="w-3/4 border-t border-gray-700">
                </div>

            </div>

            <div className="px-8 py-5">
                 <h2 className="text-3xl font-light text-white">
                 Welcome back, Cioné
                </h2>

            </div>
            
        </header>
    );
}