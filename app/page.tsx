"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function MainPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro");
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    
    const [tasks, setTasks] = useState<any[]>([]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const themes = {
        pomodoro: { bg: "bg-black", text: "text-black", label: "Time to focus!", duration: 25 },
        shortBreak: { bg: "bg-blue-600", text: "text-blue-600", label: "Time for a break!", duration: 5 },
        longBreak: { bg: "bg-green-600", text: "text-green-600", label: "Time for a break!", duration: 15 },
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            fetchTasks();
        }
    }, [router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            alert("Session finished!"); 
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const switchMode = (newMode: "pomodoro" | "shortBreak" | "longBreak") => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(themes[newMode].duration * 60);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, 
                { title: newTaskTitle, focusDuration: themes.pomodoro.duration },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewTaskTitle("");
            setIsAddingTask(false);
            fetchTasks();
        } catch (error) {
            alert("Failed to add task");
        }
    };

    const handleUpdateStatus = async (taskId: number, currentStatus: string) => {
        try {
            const token = localStorage.getItem("token");
            const newStatus = currentStatus === "completed" ? "pending" : "completed";
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (error) {
            alert("Failed to update task status");
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (error) {
            alert("Failed to delete task");
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${themes[mode].bg} text-white font-sans pb-20`}>
            <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-2 font-bold text-xl cursor-pointer">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    PomoTimer
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsReportOpen(true)} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm font-medium transition">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                        Report
                    </button>
                    <button onClick={() => setIsSettingOpen(true)} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm font-medium transition">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                        Setting
                    </button>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4 py-8 mt-4">
                <div className="bg-white/10 rounded-lg p-6 sm:p-8 text-center shadow-lg">
                    <div className="flex justify-center gap-2 sm:gap-4 mb-8">
                        <button onClick={() => switchMode("pomodoro")} className={`px-4 py-1 rounded text-sm sm:text-base font-bold transition-colors ${mode === "pomodoro" ? "bg-black/30" : "hover:bg-black/10"}`}>Pomodoro</button>
                        <button onClick={() => switchMode("shortBreak")} className={`px-4 py-1 rounded text-sm sm:text-base font-bold transition-colors ${mode === "shortBreak" ? "bg-black/30" : "hover:bg-black/10"}`}>Short Break</button>
                        <button onClick={() => switchMode("longBreak")} className={`px-4 py-1 rounded text-sm sm:text-base font-bold transition-colors ${mode === "longBreak" ? "bg-black/30" : "hover:bg-black/10"}`}>Long Break</button>
                    </div>

                    <div className="text-[100px] sm:text-[120px] font-bold leading-none mb-8 tracking-wider">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex justify-center items-center gap-4">
                        <button onClick={toggleTimer} className={`bg-white ${themes[mode].text} text-2xl font-bold py-3 px-12 rounded-md shadow-[0_6px_0_rgb(235,235,235)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(235,235,235)] transition-all uppercase w-48`}>
                            {isActive ? "PAUSE" : "START"}
                        </button>
                        {isActive && (
                            <button onClick={() => setTimeLeft(0)} className="bg-white text-black w-14 h-14 flex items-center justify-center rounded-full shadow-[0_6px_0_rgb(235,235,235)] hover:translate-y-1 hover:shadow-[0_4px_0_rgb(235,235,235)] transition-all ml-4">
                                <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M7 6v12l10-6-10-6z" /><path d="M17 6v12h2V6h-2z" /></svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-white/70 mb-1">#1</p>
                    <p className="text-xl font-medium mb-8">{themes[mode].label}</p>

                    <div className="flex justify-between items-center border-b-[2px] border-white/20 pb-4 mb-6">
                        <h2 className="text-2xl font-bold">Tasks</h2>
                    </div>

                    <div className="space-y-3 mb-6">
                        {tasks.map((task) => (
                            <div key={task.id} className={`flex justify-between items-center bg-white text-gray-800 p-4 rounded-lg shadow-sm border-l-4 ${task.status === 'completed' ? 'border-green-500 opacity-60' : 'border-blue-500'}`}>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleUpdateStatus(task.id, task.status)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                                        {task.status === 'completed' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                    </button>
                                    <span className={`font-bold ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</span>
                                </div>
                                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {isAddingTask ? (
                        <form onSubmit={handleAddTask} className="bg-white rounded-lg p-4 text-left shadow-lg">
                            <input 
                                type="text" 
                                autoFocus
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="What are you working on?" 
                                className="w-full text-gray-700 text-lg font-bold placeholder-gray-400 outline-none mb-4"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsAddingTask(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gray-800 text-white font-bold rounded shadow">Save</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => setIsAddingTask(true)} className="w-full border-2 border-dashed border-white/40 hover:border-white/70 bg-black/10 hover:bg-black/20 text-white/80 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                            Add Task
                        </button>
                    )}
                </div>
            </div>

            {isSettingOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden text-gray-700 shadow-2xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-gray-500 uppercase tracking-wide text-sm">Setting</h3>
                            <button onClick={() => setIsSettingOpen(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-4 space-y-6">
                            <div>
                                <h4 className="flex items-center gap-2 text-gray-400 font-bold mb-4 uppercase text-sm">Timer</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div><label className="text-sm text-gray-400 font-medium">Pomodoro</label><input type="number" defaultValue={25} className="w-full bg-gray-100 rounded p-2 mt-1 outline-none" /></div>
                                    <div><label className="text-sm text-gray-400 font-medium">Short Break</label><input type="number" defaultValue={5} className="w-full bg-gray-100 rounded p-2 mt-1 outline-none" /></div>
                                    <div><label className="text-sm text-gray-400 font-medium">Long Break</label><input type="number" defaultValue={15} className="w-full bg-gray-100 rounded p-2 mt-1 outline-none" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isReportOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden text-gray-700 shadow-2xl min-h-[400px] flex flex-col">
                        <div className="flex justify-end p-2 border-b">
                            <button onClick={() => setIsReportOpen(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-6 flex-1">
                            <h3 className="font-bold text-xl mb-6">Focus Time Detail (Completed Tasks)</h3>
                            <div className="overflow-y-auto max-h-[250px]">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 font-bold uppercase">Date</th>
                                            <th className="py-2 font-bold uppercase">Project / Task</th>
                                            <th className="py-2 font-bold uppercase text-right">Minutes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.filter(t => t.status === 'completed').length === 0 ? (
                                            <tr><td colSpan={3} className="py-8 text-center text-gray-400">No completed tasks yet.</td></tr>
                                        ) : (
                                            tasks.filter(t => t.status === 'completed').map(task => (
                                                <tr key={task.id} className="border-b border-gray-100">
                                                    <td className="py-3">{new Date(task.created_at).toLocaleDateString('id-ID')}</td>
                                                    <td className="py-3 font-medium text-gray-800">{task.title}</td>
                                                    <td className="py-3 text-right">{task.focus_duration}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}