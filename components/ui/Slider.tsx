"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

// TODO: Modify later to use cloudinary for images
const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "jackets",
    bg: "bg-gradient-to-r from-yellow-100 to-pink-100",
  },
  {
    id: 2,
    title: "Winter Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",

    tag: "winter",
    bg: "bg-gradient-to-r from-pink-100 to-blue-100",
  },
  {
    id: 3,
    title: "Spring Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "spring",
    bg: "bg-gradient-to-r from-blue-100 to-yellow-100",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timeout = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timeout);
  }, [current]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  return (
    <div className="h-[calc(100vh-72px)]  overflow-hidden">
      <div
        {...handlers}
        className=" w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide, index) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col xl:flex-row`}
            key={slide.id}
          >
            <div
              className={`h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-4 lg:gap-8 text-center 2xl:gap-12 text-zinc-900  select-none ${current === index ? "animate-appear" : "opacity-0"}`}
            >
              <h3 className="text-xl md:text-3xl 2xl:text-5xl delay-100">
                {slide.description}
              </h3>
              <h2 className="text-4xl md:text-6xl 2xl:text-8xl font-semibold delay-300">
                {slide.title}
              </h2>
              <Link
                href={`/shop?tags=${encodeURIComponent(slide.tag.toLowerCase())}`}
              >
                <button className="rounded-md bg-black text-white py-3 px-4 cursor-pointer delay-500">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="h-1/2 flex-1 xl:h-full relative">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="100%"
                className="object-cover pointer-events-none"
                draggable="false"
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex gap-4">
        {slides.map((slide, index) => (
          <div
            className={`w-3 h-3 rounded-full ring-1 ring-zinc-800 cursor-pointer flex items-center justify-center transition-all ease-in-out duration-300 ${current === index ? "scale-150" : ""}`}
            key={slide.id}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
