"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNavigation, Autoplay as SwiperAutoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star, StarHalf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Review = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`/api/top-reviews?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();

          setReviews(data);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    // const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={20} color="#fdc700" fill="#fdc700" strokeWidth={1.5} />);
    }

    // if (hasHalfStar) {
    //   stars.push(<StarHalf size={20} strokeWidth={1.5} color="#fdc700" fill="#fdc700" key="half-star" />);
    // }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-transparent" />);
    }

    return stars;
  };

  return (
    <div className="h-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-y-10 max-w-7xl mx-auto">
        <div className="flex flex-col text-center gap-y-2 md:gap-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100">Trusted by Thousands of Happy Customers</h2>
          <p className="text-sm md:text-[16px] text-gray-300 max-w-2xl mx-auto">
            These are the stories of our customers who have joined us with great pleasure when using this crazy feature.
          </p>
        </div>

        <div className="relative">
          {reviews.length > 0 ? (

          <Swiper
            modules={[SwiperNavigation, SwiperAutoplay]}
            spaceBetween={30}
            slidesPerView={1}
            // centeredSlides={reviews.length < 3} // will center the slides in the container
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="pb-12">
            
            {reviews.filter((review) => review.rating === 5)
              .map((review) => (
              <SwiperSlide key={review.id} className="h-50">
                <div className="bg-white rounded-lg shadow-lg p-3 md:p-6 transform transition-transform duration-300 hover:scale-105">
                  <div className="flex space-x-4 relative">
                    <div className="w-12 h-12 md:w-16 md:h-16 relative">
                      <Image
                          src={review?.user?.profilePhoto || "/default-img.jpg"}
                          alt={review?.user?.firstName || "Profile"}                        
                        fill size="64px"
                        className="rounded-full object-cover" priority
                      />
                    </div>

                    <div className="flex flex-col justify-center">
                      <h3 className="text-md font-semibold text-gray-900">{review?.user?.firstName} {review?.user?.lastName}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        </p>

                        {review?.institution?.id && (
                          <Link href={`/partnerProfile/${review?.institution?.id}`} className="text-sm text-gray-500 font-semibold">
                            Reviewed: {review?.institution?.firmName}
                          </Link>
                        )}
                    </div>

                    <div className="flex absolute top-4 right-1 space-x-1">
                      <div className="flex justify-center space-x-1">{renderStars(review?.rating)}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                      <p className="text-gray-700 text-base hidden md:inline-block">
                        "{review?.comment?.length > 35
                          ? review.comment.slice(0, 35) + "..."
                          : review?.comment
                        }"
                      </p>
                      <p className="text-gray-700 text-base inline-block md:hidden">
                        "{review?.comment?.length > 30
                          ? review.comment.slice(0, 30) + "..."
                          : review?.comment
                        }"
                      </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            </Swiper>
          ) : (
              <div className="text-center text-gray-400 text-lg py-20">
                No top reviews available at the moment.
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Review;
