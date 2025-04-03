"use client";
import { useState, useEffect } from "react";

export default function UserResponse() {
    const [formData, setFormData] = useState({ name: "", email: "", content: "" });
    const [feedbacks, setFeedbacks] = useState([]);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null); // Track the feedback being edited

    // Fetch feedbacks when the component mounts
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fetch user feedbacks (GET)
    const fetchFeedbacks = async () => {
        try {
            const response = await fetch("/api/feedback", { method: "GET" });
            const result = await response.json();
            if (response.ok) {
                setFeedbacks(result.feedbacks);
            } else {
                setMessage(result.error || "Failed to fetch feedbacks");
            }
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setMessage("An error occurred while fetching feedbacks.");
        }
    };

    // Submit new feedback (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Feedback submitted successfully!");
                setFormData({ name: "", email: "", content: "" });
                fetchFeedbacks(); // Refresh feedback list
            } else {
                setMessage(result.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    // Delete feedback (DELETE)
    const handleDelete = async (id) => {
        try {
            const response = await fetch("/api/feedback", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage("Feedback deleted successfully!");
                fetchFeedbacks();
            } else {
                setMessage(result.error || "Failed to delete feedback");
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
            setMessage("An error occurred while deleting feedback.");
        }
    };

    // Update feedback (PUT)
    const handleUpdate = async (id) => {
        try {
            const response = await fetch("/api/feedback", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, content: formData.content }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage("Feedback updated successfully!");
                setEditingId(null);
                setFormData({ name: "", email: "", content: "" });
                fetchFeedbacks();
            } else {
                setMessage(result.error || "Failed to update feedback");
            }
        } catch (error) {
            console.error("Error updating feedback:", error);
            setMessage("An error occurred while updating feedback.");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <h2>Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Feedback:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>

            {message && <p>{message}</p>}

            <h2>Your Feedback</h2>
            {feedbacks.length > 0 ? (
                <ul>
                    {feedbacks.map((feedback) => (
                        <li key={feedback.id} style={{ marginBottom: "10px" }}>
                            {editingId === feedback.id ? (
                                <>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                    <button onClick={() => handleUpdate(feedback.id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <p><strong>{feedback.name}</strong>: {feedback.content}</p>
                                    <button onClick={() => {
                                        setEditingId(feedback.id);
                                        setFormData({ content: feedback.content });
                                    }}>Edit</button>
                                    <button onClick={() => handleDelete(feedback.id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No feedback found.</p>
            )}
        </div>
    );
}
