export default function Navbar() {
    return (
        <nav className="border-t border-b border-gray-800 px-8 py-4">
            <ul className="flex gap-8">        
                <li>
                    <button className="text-white hover:text-purple-400 transition">
                        Track
                    </button>

                </li>

                <li>
                    <button className="text-white hover:text-pink-400 transition">
                        Book Delivery
                    </button>

                </li>

            </ul>

        </nav>

    );
}