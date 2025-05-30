"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { EllipsisVertical, MoveRight, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";


export default function Review({ user }) {
    const { institutionId } = useParams();
    const { data: session } = useSession();
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showOptions, setShowOptions] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
  

  // useEffect(() => {
  //   if (session || session?.user) {
      
  //     // Fetch reviews for the specific institution
  //     axios
  //       .get(`/api/reviews?institutionId=${session?.user?.id}`)
  //       .then((res) => {
  //         setReviews(res.data);
  //         console.log("res", res.data);

  //       })
  //       .catch(() => toast.error("Failed to fetch reviews"));
  //   }
  // }, [session]);

  

    useEffect(() => {
      if (!session?.user) return;

      // const role = session?.user?.role;

      // if (role === "USER" && !institutionId) return;

      const fetchReviews = async () => {
        try {
          const idToUse = institutionId || session?.user?.id;
          if (!idToUse) return;

          const res = await axios.get(`/api/reviews?institutionId=${idToUse}`);
          setReviews(res.data);
        } catch {
          toast.error("Failed to fetch reviews");
        }
      };

      fetchReviews();
    }, [session, institutionId]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (rating === 0) {
      toast.error("Please give star rating before submitting.");
      return;
    }

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
        console.log(err.response); // for debugging

      // toast.error("Error submitting review");
      const msg = err?.response?.data?.error || "Something went wrong while submitting the review.";
      toast.error(msg);
    }
  };
  
  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingId(review.id);
    setShowOptions(null);

    const el = document.getElementById("edit-review");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

  };

  const confirmReport = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowReportModal(true);
  };

  const handleReport = async (reviewId) => {
    try {
      await axios.post("/api/reviews/report", {
        reviewId: selectedReviewId,
        reason: "Inappropriate or abusive content",
        reportedBy: session?.user?.id,
      });
  
      toast.success("Report submitted!");
    } catch (error) {
      console.error("Error reporting review:", error);
      toast.error("Failed to report review");
    } finally {
      setShowReportModal(false);
      setSelectedReviewId(null);
      setShowOptions(null);
    }
  };

  const handleShowOptions = (reviewId) => {
      setShowOptions((prev) => (prev === reviewId ? null : reviewId));
  };
  
  return (
  <div className="flex justify-center items-center py-4 md:py-6 w-full">
    <div className="w-80 sm:w-3/4 px-4 py-3 md:px-8 md:py-6 flex flex-col gap-y-4 border border-gray-300 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-lg">

    {session?.user?.role === "USER" && (
      <div id="edit-review">
        <h2 className="text-2xl font-semibold pb-0 md:pb-2 text-gray-800">
          {editingId ? "Edit Review" : "Write a Review"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 md:gap-y-4">
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
                  className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>

          {/* Comment Input */}
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            rows="4"
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <div>
            <button
              type="submit"
              className="px-2 md:px-5 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-400"
            >
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
                className="ml-4 px-2 md:px-5 py-2 cursor-pointer border rounded-lg border-gray-400 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors duration-400 ease-in-out"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    )}

    {/* Display Reviews */}
    <div className="flex flex-col gap-y-2 md:gap-y-4">
      <h3 className="text-2xl font-semibold mb-2 text-gray-800">Reviews</h3>
        {reviews.length > 0 ? (
        // <div className="flex flex-col gap-y-2 md:gap-y-4">
        //   <h3 className="text-2xl font-semibold mb-2 text-gray-800">Reviews</h3>
        <ul className="flex flex-col gap-y-1.5 md:gap-y-3">
          {/* {reviews.map((review, i) => ( */}
              
          {reviews
            // .filter((r) => r.rating === 5)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
            .map((review, i) => (  
              
            <li key={i} className="p-2.5 md:p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                {/* Left side: Profile photo, Name */}
                <div className="flex items-center gap-1.5 md:gap-3">
                  <div className="w-8 md:w-12 h-8 md:h-12 relative">
                    <Image src={review?.user?.profilePhoto || "/default-img.jpg"} alt="User Profile" fill className="w-12 h-12 rounded-full" priority />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-[16px]">{review?.user?.firstName} {review?.user?.lastName}</p>
                    {/* <p className="text-sm text-gray-500">{new Date(review?.createdAt).toLocaleDateString()}</p> */}
                    <p className="text-sm text-gray-500">
                      {new Date( review?.updatedAt > review?.createdAt ? review?.updatedAt : review?.createdAt ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right side: Rating */}
                <div className="flex items-center gap-y-1 md:gap-x-2">
                  <div className="flex">
                    {[...Array(Math.floor(review?.rating))].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="relative">
                    <button onClick={() => handleShowOptions(review.id)} className="cursor-pointer">
                      <EllipsisVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {showOptions === review.id && (
                      <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-md z-10">
                        {session?.user?.id === review?.userId && (
                          <button
                            className="block w-full text-left px-4 cursor-pointer py-2 text-sm transition-all ease-in-out duration-400 hover:bg-gray-100"
                            onClick={() => handleEdit(review)}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          className="block w-full text-left px-4 py-2 text-sm cursor-pointer transition-all ease-in-out duration-400 hover:bg-gray-100"
                          onClick={() => confirmReport(review.id)}
                        >
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-gray-700 text-sm md:text-[15px] break-words whitespace-pre-line">{review.comment}</p>
            </li>
          ))}
        </ul>
      // </div>
        ) : (
          <p className="text-gray-500 text-center my-4">No reviews yet.</p>
          )}
    </div>

    {reviews.length > 3 && (
      <div className="text-right mt-3">
        <Link href={`/all-reviews/${institutionId || session?.user?.id}`}
          className="group inline-flex items-center gap-2 text-blue-600 cursor-pointer transition-all ease-in-out duration-400 hover:text-blue-700 hover:underline text-sm">
              View All Reviews <MoveRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    )}

    {showReportModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-lg font-semibold mb-4">Report Review</h2>
          <p className="mb-4">Are you sure you want to report this review?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border rounded bg-gray-100 cursor-pointer transition-all ease-in-out duration-400 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReport(selectedReviewId)}
                  className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer transition-all ease-in-out duration-400 hover:bg-red-700"
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
    </div>
  );
}


