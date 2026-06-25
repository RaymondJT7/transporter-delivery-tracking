export default function RatingCard() {
    return (
        
    <div className="w-full max-w-xl bg-[#11131d] border border-gray-800 p-6 shadow-2xl">                          

            <button className="absolute top-91 right-119 text-gray-500 hover:text-white text-3xl transition">
                ×
            </button>
            
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                Rate Your Delivery
            </p>

            <h3 className="mt-2 text-2xl font-xs text-white">
                TRP-2841-AX9F
            </h3>          

            <div className="flex items-center gap-4 mt-8">
         
            <div className="w-12 h-12 bg-yellow-700 flex items-center justify-center text-yellow-200 font-bold">
                RD
            </div>
        
            <div>
                <h4 className="text-xl text-white">
                    Ryan Davies
                </h4>

                <p className="text-gray-500 font-xs">
                    Your courier
                </p>

            </div>

        </div>

            <p className="mt-4 relative top-3.75 right-0 text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
                Overall Experience
            </p>

            <div className="flex gap-2 mt-6 text-3xl text-yellow-500"> 
                <button>☆</button>
                <button>☆</button>
                <button>☆</button>
                <button>☆</button>
                <button>☆</button>
            </div>

            <div className="mt-8"> 
                <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
                    Quick Feedback
                </p>

                <div className="flex flex-wrap gap-3">
                    <button className="border border-gray-700 px-4 py-3 text-gray-400 hover:border-yellow-600 hover:text-yellow-500 transition">
                    Fast delivery
                    </button>

                    <button className="border border-gray-700 px-4 py-3 text-gray-400 hover:border-yellow-600 hover:text-yellow-500 transition">
                    Careful with package
                    </button>

                    <button className="border border-gray-700 px-4 py-3 text-gray-400 hover:border-yellow-600 hover:text-yellow-500 transition">
                    Friendly driver
                    </button>

                    <button className="border border-gray-700 px-4 py-3 text-gray-400 hover:border-yellow-600 hover:text-yellow-500 transition">
                    Great communication
                    </button>

                    <button className="border border-gray-700 px-4 py-3 text-gray-400 hover:border-yellow-600 hover:text-yellow-500 transition">
                    Left in safe place
                    </button>

                </div>

            </div>

            <div className="mt-4">
                <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
                    Additional Comments
                </p>
            
                <textarea 
                    className="w-full -mt-1 p-3 bg-[#1b1f2d] border border-gray-700 rounded"
                    placeholder="Optional..."
                />
                
            </div>

            <button className="w-full mt-4 bg-yellow-700 py-4 uppercase text-black font-semibold">
                Submit Rating
            </button>

        </div>

    );
}