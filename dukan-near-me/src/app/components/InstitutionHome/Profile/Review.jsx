"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function CommentSection({ comments = [], onSubmit }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() && rating > 0) {
      onSubmit({ comment, rating });
      setComment("");
      setRating(0);
    }
  };

  return (
    <div className="flex justify-center py-6">
      <div className="w-3/4 px-8 py-4 border border-gray-400">
        <h2 className="text-xl font-semibold pb-4">Write a Review</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          {/* Star Rating */}
          <div className="flex items-center gap-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Comment Input */}
          <textarea
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post Review
          </button>
        </form>

        {/* Display Comments */}
        <div className="pt-6">
          <h3 className="text-lg font-medium mb-2">Reviews</h3>
          <ul className="flex flex-col gap-y-3">
            {comments.map((c, index) => (
              <li
                key={index}
                className="p-3 bg-gray-100 rounded-md shadow-sm"
              >
                <div className="flex items-center mb-1 text-yellow-400 text-sm">
                  {[...Array(c.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="pl-2 text-gray-700 text-xs">
                    ({c.rating}/5)
                  </span>
                </div>
                <p className="text-gray-800">{c.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
