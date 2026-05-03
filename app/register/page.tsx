"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); 
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, formData);
            setShowSuccessModal(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed, please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-500 flex items-center justify-center p-4">
            <div className="bg-black w-full max-w-md rounded-3xl p-10 text-white shadow-2xl my-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-wide mb-2">Register</h1>
                    <p className="text-sm text-gray-500">create new account</p>
                </div>

                {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Type your username"
                            required
                            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 text-white pb-2 outline-none transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Type your email"
                            required
                            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 text-white pb-2 outline-none transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Type your password"
                            required
                            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 text-white pb-2 outline-none transition-colors placeholder-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white font-bold py-3 rounded-full mt-8 transition-colors duration-300"
                    >
                        {isLoading ? "LOADING..." : "REGISTER"}
                    </button>
                </form>

                <div className="mt-10 text-center space-y-4">
                    <p className="text-xs text-gray-500">Already have an account?</p>
                    <Link href="/login" className="block text-sm font-bold text-white hover:text-blue-400 transition-colors tracking-widest">
                        LOGIN
                    </Link>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="w-[300px] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
                        <div className="bg-[#82C341] py-8 flex flex-col items-center justify-center text-white">
                            <svg className="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="8 12 11 15 16 9"></polyline>
                            </svg>
                            <h2 className="tracking-[0.2em] font-medium text-sm">SUCCESS</h2>
                        </div>
                        <div className="p-6 text-center flex flex-col items-center">
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Congratulations, your account<br />has been successfully created.
                            </p>
                            <button
                                onClick={() => router.push("/login")}
                                className="bg-[#82C341] hover:bg-[#6fa835] text-white font-medium py-2 px-8 rounded-full transition-colors shadow-md"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}