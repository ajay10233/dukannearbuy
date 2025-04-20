"use client";

// import { useState } from "react";
// import { Star } from "lucide-react";

// export default function CommentSection({ comments = [], onSubmit }) {
//   const [comment, setComment] = useState("");
//   const [rating, setRating] = useState(0);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (comment.trim() && rating > 0) {
//       onSubmit({ comment, rating });
//       setComment("");
//       setRating(0);
//     }
//   };

//   return (
//     <div className="flex justify-center py-6">
//       <div className="w-3/4 px-8 py-4 border border-gray-400">
//         <h2 className="text-xl font-semibold pb-4">Write a Review</h2>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
//           {/* Star Rating */}
//           <div className="flex items-center gap-x-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 type="button"
//                 key={star}
//                 onClick={() => setRating(star)}
//               >
//                 <Star
//                   className={`w-6 h-6 cursor-pointer ${
//                     star <= rating
//                       ? "text-yellow-400 fill-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 />
//               </button>
//             ))}
//           </div>

//           {/* Comment Input */}
//           <textarea
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             rows="4"
//             placeholder="Write your feedback..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           ></textarea>

//           <button
//             type="submit"
//             className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Post Review
//           </button>
//         </form>

//         {/* Display Comments */}
//         <div className="pt-6">
//           <h3 className="text-lg font-medium mb-2">Reviews</h3>
//           <ul className="flex flex-col gap-y-3">
//             {comments.map((c, index) => (
//               <li
//                 key={index}
//                 className="p-3 bg-gray-100 rounded-md shadow-sm"
//               >
//                 <div className="flex items-center mb-1 text-yellow-400 text-sm">
//                   {[...Array(c.rating)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                     />
//                   ))}
//                   <span className="pl-2 text-gray-700 text-xs">
//                     ({c.rating}/5)
//                   </span>
//                 </div>
//                 <p className="text-gray-800">{c.comment}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Review({ user }) {
    const { institutionId } = useParams();
    const { data: session } = useSession();
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [avgRating, setAvgRating] = useState(0);


  useEffect(() => {
    if (institutionId) {
      // Fetch reviews for the specific institution
      axios
        .get(`/api/reviews?institutionId=${institutionId}`)
        .then((res) => {
          setReviews(res.data);
          // const reviews = res.data;
          // setReviews(reviews);
          // const avg =
          //   reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;
          // setAvgRating(avg.toFixed(1));
        })
        .catch(() => toast.error("Failed to fetch reviews"));
    }
  }, [institutionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) return;

    try {
      if (editingId) {
        // Update review
        await axios.put("/api/reviews", {
          commentId: editingId,
          rating,
          comment,
        });
        toast.success("Review updated!");
      } else {
        // New review
        await axios.post("/api/reviews", {
          institutionId,
          rating,
          comment,
        });
        toast.success("Review submitted!");
      }

      setComment("");
      setRating(0);
      setEditingId(null);

      const updated = await axios.get(`/api/reviews?institutionId=${institutionId}`);
      setReviews(updated.data);
    } catch (err) {
      toast.error("Error submitting review");
    }
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingId(review.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
<div className="flex justify-center py-4 md:py-6">
  <div className="w-75 md:w-3/4 px-4 py-3 md:px-8 md:py-6 flex flex-col gap-y-4 border border-gray-300 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg">
    
    {session?.user?.role === "USER" && (
        <>
            <h2 className="text-2xl font-semibold pb-0 md:pb-2 text-gray-800">
            {editingId ? "Edit Review" : "Write a Review"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                {/* Star Rating */}
                <div className="flex items-center gap-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="transform transition-transform hover:scale-110"
                    >
                        <Star
                        className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    rows="4"
                    placeholder="Write your feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}>
                </textarea>

                <div>
                    <button
                        type="submit"
                        className="px-2.5 md:px-5 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200">
                        {editingId ? "Update Review" : "Post Review"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                            setComment("");
                            setRating(0);
                            setEditingId(null);
                            }}
                            className="ml-4 text-gray-500 hover:text-gray-700 underline transition-colors duration-200">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>              
        </>
    )}

    {/* Display Reviews */}
    {reviews.length > 0 ? (
      <div className="flex flex-col gap-y-3">
        <h3 className="text-2xl font-semibold mb-2 text-gray-800">Reviews</h3>
        <ul className="flex flex-col gap-y-3">
          {reviews.map((review, i) => (
            <li
              key={i}
              className="p-2.5 md:p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-2 text-yellow-400 text-sm">
                {/* <span className="px-2 text-gray-700 text-xs">
                  ({review.rating})
                </span> */}
                {[...Array(review.rating)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                {/* <span className="pl-2 text-gray-700 text-xs">
                  ({review.rating}/5)
                </span> */}
              </div>
              <p className="text-gray-800">{review.comment}</p>
              {review.userId === user?.id && (
                <button
                  className="text-blue-600 text-sm pt-2 hover:underline"
                  onClick={() => handleEdit(review)}>
                  Edit
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="text-gray-500 text-center py-4">No reviews yet</div>
    )}
  </div>
</div>

  );
}
