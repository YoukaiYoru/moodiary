// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

const MainBanner = () => {

    const slides = [
        {
            url: "https://plus.unsplash.com/premium_photo-1683865775849-b958669dca26?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVudGFsJTIwaGVhbHRofGVufDB8fDB8fHww"
        },
        {
            url: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVudGFsJTIwaGVhbHRofGVufDB8fDB8fHww"
        },
        {
            url: "https://images.unsplash.com/photo-1579600161224-cac5a2971069?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1lbnRhbCUyMGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            url: "https://images.unsplash.com/photo-1564682895970-0dbb72e18d97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fG1lbnRhbCUyMGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            url: "https://images.unsplash.com/photo-1564682895970-0dbb72e18d97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fG1lbnRhbCUyMGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="max-w-[1080px] h-[600px] w-full m-auto py-4 px-4 relative group">
            <div style={{ backgroundImage: `url(${slides[currentIndex].url})` }} className="w-full h-full rounded-2xl bg-center bg-cover duration-500"></div>
            {/* Left arrow */}
            <div className='hidden group-hover:block absolute top-[50%] transalate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                <BsChevronCompactLeft onClick={prevSlide} size={30} />
            </div>
            {/* Right arrow */}
            <div className='hidden group-hover:block absolute top-[50%] transalate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                <BsChevronCompactRight onClick={nextSlide} size={30} />
            </div>
            <div className='flex top-4 justify-center py-2'>
                {slides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className='text-2xl cursor-pointer'
                    >
                        <RxDotFilled />
                    </div>
                ))}
            </div>
        </div>

        // <div>
        //     <div id="animation-carousel" className="relative w-full" data-carousel="static">
        //         {/* Carousel wrapper */}
        //         <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        //             {/* Item 1 */}
        //             <div className="hidden duration-200 ease-linear" data-carousel-item>
        //                 <img src="https://img.freepik.com/free-photo/gorgeous-arrangement-flowers-wallpaper_23-2149057015.jpg?t=st=1747022905~exp=1747026505~hmac=b6a6194295442729638c3a0d3cc92bb60a2a99e2052c9b6b9ee352e77a7f6c41&w=996" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
        //             </div>
        //             {/* Item 2 */}
        //             {/* <div className="hidden duration-200 ease-linear" data-carousel-item>
        //                 <img src="https://img.freepik.com/free-photo/gorgeous-arrangement-flowers-wallpaper_23-2149057015.jpg?t=st=1747022905~exp=1747026505~hmac=b6a6194295442729638c3a0d3cc92bb60a2a99e2052c9b6b9ee352e77a7f6c41&w=996" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
        //             </div> */}
        //         </div>
        //         {/* Slider controls */}
        //         <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        //             <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        //                 <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        //                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
        //                 </svg>
        //                 <span className="sr-only">Previous</span>
        //             </span>
        //         </button>
        //         <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        //             <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        //                 <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        //                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
        //                 </svg>
        //                 <span className="sr-only">Next</span>
        //             </span>
        //         </button>
        //     </div>
        //     <div className="w-full max-w-4xl mx-auto mt-10 rounded-lg overflow-hidden">
        //         <Swiper
        //             modules={[Navigation, Pagination, Autoplay]}
        //             spaceBetween={30}
        //             slidesPerView={1}
        //             navigation
        //             pagination={{ clickable: true }}
        //             autoplay={{ delay: 3000 }}
        //             loop
        //         >
        //             <SwiperSlide>
        //                 <div className='flex justify-center items-center w-full h-64 md:h-[32rem] bg-gray-100'>
        //                     <img src="https://img.freepik.com/free-photo/gorgeous-arrangement-flowers-wallpaper_23-2149057015.jpg?t=st=1747022905~exp=1747026505~hmac=b6a6194295442729638c3a0d3cc92bb60a2a99e2052c9b6b9ee352e77a7f6c41&w=996" alt="Slide 1" className="w-full h-64 md:h-96 object-cover" />
        //                 </div>
        //             </SwiperSlide>
        //             <SwiperSlide>
        //                 <img src="https://img.freepik.com/free-photo/gorgeous-arrangement-flowers-wallpaper_23-2149057015.jpg?t=st=1747022905~exp=1747026505~hmac=b6a6194295442729638c3a0d3cc92bb60a2a99e2052c9b6b9ee352e77a7f6c41&w=996" alt="Slide 2" className="w-full h-64 md:h-96 object-cover" />
        //             </SwiperSlide>
        //             {/* Add more SwiperSlide components as needed */}
        //         </Swiper>
        //     </div>
        // </div>
    )
}

export default MainBanner



// import { useState } from 'react';

// const MainBanner = () => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const slides = [
//         "https://mdbcdn.b-cdn.net/img/new/slides/041.webp",
//         "https://mdbcdn.b-cdn.net/img/new/slides/042.webp",
//         "https://mdbcdn.b-cdn.net/img/new/slides/043.webp"
//     ];

//     const handlePrev = () => {
//         setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
//     };

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
//     };

//     return (
//         <div className="relative">
//             {/* Carousel Indicators */}
//             <div className="absolute inset-x-0 bottom-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0">
//                 {slides.map((_, index) => (
//                     <button
//                         key={index}
//                         className={`mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)]`}
//                         onClick={() => setCurrentIndex(index)}
//                         style={{
//                             opacity: currentIndex === index ? 1 : 0.5,
//                         }}
//                         aria-label={`Slide ${index + 1}`}
//                     ></button>
//                 ))}
//             </div>

//             {/* Carousel Items */}
//             <div className="relative w-full overflow-hidden">
//                 {slides.map((slide, index) => (
//                     <div
//                         key={index}
//                         className={`relative float-left w-full transition-opacity duration-[600ms] ease-in-out ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}
//                     >
//                         <img src={slide} className="block w-full" alt={`Slide ${index + 1}`} />
//                     </div>
//                 ))}
//             </div>

//             {/* Carousel Controls - Prev */}
//             <button
//                 className="absolute top-0 left-0 z-[1] flex items-center justify-center w-[15%] h-full bg-black opacity-50 hover:opacity-90"
//                 type="button"
//                 onClick={handlePrev}
//             >
//                 <span className="inline-block h-8 w-8">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//                     </svg>
//                 </span>
//             </button>

//             {/* Carousel Controls - Next */}
//             <button
//                 className="absolute top-0 right-0 z-[1] flex items-center justify-center w-[15%] h-full bg-black opacity-50 hover:opacity-90"
//                 type="button"
//                 onClick={handleNext}
//             >
//                 <span className="inline-block h-8 w-8">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//                     </svg>
//                 </span>
//             </button>
//         </div>
//     );
// };

// export default MainBanner;
