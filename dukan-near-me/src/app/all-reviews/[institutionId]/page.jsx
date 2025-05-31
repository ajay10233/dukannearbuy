"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { EllipsisVertical, MoveRight, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/app/components/userProfile/navbar/Navbar";

export default function Review({ user }) {
    const { institutionId } = useParams();
    console.log("institutionId:", institutionId);

    const { data: session } = useSession();
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showOptions, setShowOptions] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [sortOption, setSortOption] = useState("all");
    const [showForm, setShowForm] = useState(false);


    const router = useRouter();
    const pathname = usePathname();

  
    useEffect(() => {
        if (!session?.user) return;

        // const role = session?.user?.role;

        // if (role === "USER" && !institutionId) return;

        const fetchReviews = async () => {
            try {
            // For USER role, fetch by institutionId from URL param
            // For SHOP_OWNER or INSTITUTION role, fetch by session.user.id
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
        setShowForm(false);

      const updated = await axios.get(`/api/reviews?institutionId=${institutionId}`);

      setReviews(updated.data);
    } catch (err) {
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
    setShowForm(true);

    // router.push(`/partnerProfile/${institutionId}#edit-review`);

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
    <>  
        <Navbar />    
        <div className="min-h-screen flex flex-col justify-center items-center py-4 md:py-6 w-full px-4">
            <div className="flex-1 w-full sm:w-[90%] md:max-w-4xl max-h-[90vh] mt-16 mx-4 md:mx-0 overflow-hidden border border-gray-300 rounded-lg shadow-md bg-gray-100 transition-all duration-300 hover:shadow-lg px-4 py-3 md:px-8 md:py-6">

                {/* review form */}
                {session?.user?.role === "USER" && showForm && (
                    <div className="edit-review mb-4">
                        <h2 className="text-2xl font-semibold pb-0 md:pb-2 text-gray-800">
                        {!editingId && !showForm ? "Edit Review" : "Write a Review"}
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
                            className="w-full p-3 border resize-none bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
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
                                setShowForm(false); 
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
                
                {/* Reviews Header */}
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800">All Reviews</h3>
                    <select value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="ml-4 text-sm border cursor-pointer border-gray-300 rounded px-2 py-1 bg-white focus:outline-none">
                            <option value="all">All</option>
                            <option value="latest">Latest Reviews</option>
                            <option value="oldest">Oldest Reviews</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                    </select>
                </div>

            {/* Reviews List Scrollable */}
                <div className="overflow-y-auto dialogScroll pr-1 max-h-[80vh] sm:max-h-[70vh]" >
                    {reviews.length > 0 ? (
                        <ul className="flex flex-col gap-3">
                            {/* {reviews
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) */}
                                    
                            {[...reviews]
                                .sort((a, b) => {
                                    if (sortOption === "latest")
                                return new Date(b.updatedAt > b.createdAt ? b.updatedAt : b.createdAt) - new Date(a.updatedAt > a.createdAt ? a.updatedAt : a.createdAt);

                                if (sortOption === "oldest")
                                return new Date(a.updatedAt > a.createdAt ? a.updatedAt : a.createdAt) - new Date(b.updatedAt > b.createdAt ? b.updatedAt : b.createdAt);

                                    if (sortOption === "highest") return b.rating - a.rating;
                                    if (sortOption === "lowest") return a.rating - b.rating;
                                    return 0;
                                })        
                                .map((review, i) => (
                                <li key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between">
                                    {/* Profile Section */}
                                    <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 relative rounded-full overflow-hidden">
                                        <Image
                                        src={review?.user?.profilePhoto || "/default-img.jpg"}
                                        alt="User Profile"
                                        fill
                                        className="object-cover"
                                        priority
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm md:text-base">{review?.user?.firstName} {review?.user?.lastName}</p>
                                        <p className="text-xs text-gray-500">
                                        {new Date(review?.updatedAt > review?.createdAt ? review?.updatedAt : review?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    </div>

                                    {/* Rating and Options */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(Math.floor(review?.rating))].map((_, idx) => (
                                            <Star key={idx} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <button onClick={() => handleShowOptions(review.id)} className="cursor-pointer">
                                            <EllipsisVertical className="w-5 h-5 text-gray-500" />
                                            </button>

                                            {showOptions === review.id && (
                                                <div className="absolute right-0 mt-2 w-28 bg-white border cursor-pointer border-gray-200 rounded shadow-md z-10">
                                                    {session?.user?.id === review?.userId && (
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm transition-all ease-in-out duration-400 cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleEdit(review)}
                                                    >
                                                        Edit
                                                    </button>
                                                    )}
                                                    <button
                                                    className="block w-full text-left px-4 py-2 text-sm transition-all ease-in-out duration-400 cursor-pointer hover:bg-gray-100"
                                                    onClick={() => confirmReport(review.id)}
                                                    >
                                                    Report
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700 text-sm md:text-[15px] whitespace-pre-line">{review.comment}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center my-4">No reviews yet.</p>
                    )}
                </div>

            {/* Report Dialog */}
                {showReportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Report Review</h2>
                        <p className="mb-4">Are you sure you want to report this review?</p>
                        <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowReportModal(false)}
                            className="px-4 py-2 border rounded transition-all ease-in-out duration-400 cursor-pointer bg-gray-100 hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleReport(selectedReviewId)}
                            className="px-4 py-2 bg-red-500 transition-all ease-in-out duration-400 cursor-pointer text-white rounded hover:bg-red-600"
                        >
                            Report
                        </button>
                        </div>
                    </div>
                    </div>
                )}
            </div>      
        </div>
    </>  
);

}



