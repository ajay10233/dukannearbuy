'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ReviewComponent({user}) {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null); // New

  useEffect(() => {
    axios.get('/api/institutions')
      .then((res) => setInstitutions(res.data?.data))
      .catch(() => toast.error("Failed to fetch institutions"));
  }, []);

  useEffect(() => {
    if (selectedInstitution) {
      axios.get(`/api/reviews?institutionId=${selectedInstitution}`)
        .then((res) => setReviews(res.data))
        .catch(() => toast.error("Failed to fetch reviews"));
    }
  }, [selectedInstitution]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // PUT request for editing
        await axios.put('/api/reviews', {
          commentId: editingId,
          rating,
          comment,
        });
        toast.success("Review updated!");
      } else {
        // POST request for new review
        await axios.post('/api/reviews', {
          institutionId: selectedInstitution,
          rating,
          comment,
        });
        toast.success("Review submitted!");
      }

      setComment('');
      setRating(5);
      setEditingId(null);

      const updated = await axios.get(`/api/reviews?institutionId=${selectedInstitution}`);
      setReviews(updated.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit/update review");
    }
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingId(review.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{editingId ? 'Edit Review' : 'Submit a Review'}</h1>

      {/* Institution Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Institution</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={selectedInstitution}
          onChange={(e) => {
            setSelectedInstitution(e.target.value);
            setEditingId(null);
            setComment('');
            setRating(5);
          }}
        >
          <option value="">-- Select an Institution --</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.firmName || `${inst.firstName} ${inst.lastName}`}
            </option>
          ))}
        </select>
      </div>

      {/* Review Form */}
      {selectedInstitution && (
        <form onSubmit={handleReviewSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block mb-1 font-medium">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? 'Update Review' : 'Submit Review'}
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-4 text-gray-600 underline"
              onClick={() => {
                setEditingId(null);
                setRating(5);
                setComment('');
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  {review.user?.profilePhoto && (
                    <img
                      src={review.user.profilePhoto}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <p className="font-semibold">
                    {review.user?.firstName} {review.user?.lastName}
                  </p>
                  <span className="text-yellow-500 ml-auto">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>

                {/* Show Edit button only if it's the user's review */}

                { review.userId == user.id && (
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-blue-600 mt-2 text-sm underline"
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
