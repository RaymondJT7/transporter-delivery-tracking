"use client";

import { useState } from "react";

export default function RatingCard() {
    const [selectedStars, setSelectedStars] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [feedback, setFeedback] = useState("");
    const [status, setStatus] = useState("");

    const toggleTag = (tag: string) => {
        setSelectedTags((current) =>
            current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
        );
    };

    const handleSubmit = async () => {
        setStatus("");

        try {
            const response = await fetch("/api/ratings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deliveryId: "demo-delivery",
                    score: selectedStars,
                    tags: selectedTags,
                    feedback,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setStatus(result?.error || "Failed to submit rating");
                return;
            }

            setStatus("Rating saved successfully");
        } catch (error) {
            console.error("Rating submit error:", error);
            setStatus("Failed to submit rating");
        }
    };

    return (
        
    <div className="w-full max-w-xl bg-[#11131d] border border-gray-800 p-6 shadow-2xl">                                      
            
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

            <p className="mt-4 relative top-[15px] right-[0px] text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
                Overall Experience
            </p>

            <div className="flex gap-2 mt-6 text-3xl text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedStars(star)}
                        className={star <= selectedStars ? "text-yellow-400" : "text-gray-600"}
                    >
                        ★
                    </button>
                ))}
            </div>

            <div className="mt-4"> 
                <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-3">
                    Quick Feedback
                </p>

                <div className="flex flex-wrap gap-3">
                    {[
                        "Fast delivery",
                        "Careful with package",
                        "Friendly driver",
                        "Great communication",
                        "Left in safe place",
                    ].map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`border px-4 py-3 transition ${
                                    isSelected
                                        ? "border-yellow-600 text-yellow-500"
                                        : "border-gray-700 text-gray-400 hover:border-yellow-600 hover:text-yellow-500"
                                }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

            </div>

            <div className="mt-4">
                <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
                    Additional Comments
                </p>
            
                <textarea 
                    className="w-full -mt-1 p-3 bg-[#1b1f2d] border border-gray-700 rounded"
                    placeholder="Optional..."
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                />
                
            </div>

            {status ? <p className="mt-4 text-sm text-yellow-400">{status === "Failed to submit rating" ? "" : status}</p> : null}

            <button
                type="button"
                onClick={handleSubmit}
                className="w-full mt-4 bg-yellow-700 py-4 uppercase text-black font-semibold"
            >
                Submit Rating
            </button>

        </div>

    );
}