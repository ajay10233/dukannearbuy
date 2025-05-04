// "use client"

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation as SwiperNavigation, Autoplay as SwiperAutoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Star, StarHalf, ChevronRight, ChevronLeft } from "lucide-react";
// import Image from "next/image";

// const Review = () => {
//   const reviews = [
//     {
//       id: 1,
//       userName: "Sarah Johnson",
//       userPhoto: "/chatUserSvg/userImage.svg",
//       location: "New York, USA",
//       rating: 5,
//       reviewText: "Wow... I am very happy to use this App, it turned out to be more than my expectations and so far there have been no problems. Dukan near me  always the best."
//     },
//     {
//       id: 2,
//       userName: "Michael Chen",
//       userPhoto: "/chatUserSvg/userImage.svg",
//       location: "Toronto, Canada",
//       rating: 4,
//       reviewText: "Wow... I am very happy to use this App, it turned out to be more than my expectations and so far there have been no problems. Dukan near me  always the best"
//     },
//     {
//       id: 3,
//       userName: "Piyush Singh",
//       userPhoto: "/chatUserSvg/userImage.svg",
//       location: "London, UK",
//       rating: 5,
//       reviewText: "Wow... I am very happy to use this App, it turned out to be more than my expectations and so far there have been no problems. Dukan near me  always the best."
//     },
//     {
//       id: 4,
//       userName: "David Miller",
//       userPhoto: "/chatUserSvg/userImage.svg",
//       location: "Sydney, Australia",
//       rating: 4.5,
//       reviewText: "Wow... I am very happy to use this App, it turned out to be more than my expectations and so far there have been no problems. Dukan near me  always the best."
//     }
//   ];

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 0; i < fullStars; i++) {
//         stars.push(<Star key={`star-${i}`} size={20} color="#fdc700" fill="#fdc700" strokeWidth={1.5} />);
//     }
      
//     if (hasHalfStar) {
//         stars.push(<StarHalf size={20} strokeWidth={1.5} color="#fdc700" fill="#fdc700" key="half-star" />);
//     }
      
//     const remainingStars = 5 - stars.length;
//     for (let i = 0; i < remainingStars; i++) {
//         stars.push(<Star key={`empty-star-${i}`} className="text-transparent" />);
//     }
//     return stars;
//   };

//   return (
//     <div className="h-full py-16 px-4 sm:px-6 lg:px-8">
//       <div className="flex flex-col gap-y-10 max-w-7xl mx-auto">
//         <div className="flex flex-col text-center gap-y-2 md:gap-y-5">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Trusted by Thousands of Happy Customer</h2>
//             <p className="text-md text-gray-200 max-w-2xl mx-auto">
//                 These are the stories of our customers who have joined us with great pleasure when using this crazy feature.
//             </p>
//         </div>

//         <div className="relative">
//           <Swiper
//             modules={[SwiperNavigation, SwiperAutoplay]}
//             spaceBetween={30}
//             slidesPerView={1}
//             // navigation={{
//             //   prevEl: ".swiper-button-prev",
//             //   nextEl: ".swiper-button-next"
//             // }}
//             autoplay={{
//               delay: 3000,
//               disableOnInteraction: false
//             }}
//             breakpoints={{
//               640: { slidesPerView: 1 },
//               768: { slidesPerView: 2 },
//               1024: { slidesPerView: 3 }
//             }}
//             className="pb-12">
//             {reviews.map((review) => (
//                 <SwiperSlide key={review.id} className="h-50">
//                     <div className="bg-white rounded-lg shadow-lg p-3 md:p-6 transform transition-transform duration-300 hover:scale-105">
//                         <div className="flex space-x-4">
//                             <div className="w-12 h-12 md:w-16 md:h-16 relative">
//                                 <Image src={review.userPhoto}
//                                     alt={review.userName}
//                                     fill
//                                     className="rounded-full object-cover" />
//                                     {/* onError={(e) => {
//                                         e.target.src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167";
//                                     }}/> */}
//                             </div>

//                             <div className="flex flex-col justify-center">
//                                 <div className="flex flex-col gap-y-2">
//                                     <h3 className="text-md font-semibold text-gray-900">{review.userName}</h3>
//                                     <p className="text-sm text-gray-600">{review.location}</p>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col justify-start items-center">
//                                 <div className="flex justify-center space-x-1">
//                                     {renderStars(review.rating)}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="mt-4">
//                             <p className="text-gray-700 text-base">
//                                 "{review.reviewText}"
//                             </p>
//                         </div>
//                     </div>
//                 </SwiperSlide>
//             ))}
//           </Swiper>

//           {/* <button className="swiper-button-prev absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 hover:bg-gray-100 focus:outline-none">
//                 <ChevronLeft size={20} color="#2c2c2a" strokeWidth={1.5} />
//           </button>
//           <button className="swiper-button-next absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 hover:bg-gray-100 focus:outline-none">
//                 <ChevronRight size={20} color="#2c2c2a" strokeWidth={1.5} />
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Review;

"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNavigation, Autoplay as SwiperAutoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star, StarHalf } from "lucide-react";
import Image from "next/image";

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
          <p className="text-md text-gray-200 max-w-2xl mx-auto">
            These are the stories of our customers who have joined us with great pleasure when using this crazy feature.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[SwiperNavigation, SwiperAutoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="pb-12"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="h-50">
                <div className="bg-white rounded-lg shadow-lg p-3 md:p-6 transform transition-transform duration-300 hover:scale-105">
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 relative">
                      <Image
                        src={review?.user?.profilePhoto || "/default-img.jpg"}
                        alt={review?.user?.name}
                        fill
                        className="rounded-full object-cover" priority
                      />
                    </div>

                    <div className="flex flex-col justify-center">
                      <h3 className="text-md font-semibold text-gray-900">{review?.user?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col justify-start items-center">
                      <div className="flex justify-center space-x-1">{renderStars(review?.rating)}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700 text-base">"{review?.comment}"</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Review;
