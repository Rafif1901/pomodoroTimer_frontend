"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                email,
                password,
            });
            
            localStorage.setItem("token", response.data.token);
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed, please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-500 flex items-center justify-center p-4">
            <div className="bg-black w-full max-w-md rounded-3xl p-10 text-white shadow-2xl">
                <h1 className="text-4xl font-bold text-center mb-10 tracking-wide">Login</h1>

                {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <div className="relative">
                            <span className="absolute left-0 top-2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Type your Email"
                                required
                                className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 text-white pl-8 pb-2 outline-none transition-colors placeholder-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <span className="absolute left-0 top-2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Type your password"
                                required
                                className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 text-white pl-8 pb-2 outline-none transition-colors placeholder-gray-600"
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full mt-8 transition-colors duration-300"
                    >
                        LOGIN
                    </button>
                </form>

                <div className="mt-10 text-center space-y-4">
                    <p className="text-xs text-gray-500">Or Sign Up Using</p>
                    <Link href="/register" className="block text-sm font-bold text-white hover:text-blue-400 transition-colors tracking-widest">
                        SIGN UP
                    </Link>
                </div>
            </div>
        </div>
    );
}