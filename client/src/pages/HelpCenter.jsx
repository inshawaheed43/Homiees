// pages/HelpCenter.jsx for landlord and tenant to submit issues
// This page allows users to submit help requests for various issues they may encounter.
import React, { useState } from "react";

export default function HelpCenter() {
    const [form, setForm] = useState({ category: "", description: "" });
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/help", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                category: form.category,
                message: form.description,
            }),
        });
        const data = await res.json();
        setMessage(data.message || "Submitted");
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Help Center</h1>
            {message && <p className="text-green-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Select Category</option>
                    <option>Payment Issue</option>
                    <option>Listing Issue</option>
                    <option>Chat/Message Bug</option>
                    <option>Account Access</option>
                    <option>Other</option>
                </select>
                <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border p-2 rounded"
                    placeholder="Describe your issue..."
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
            </form>
        </div>
    );
}
