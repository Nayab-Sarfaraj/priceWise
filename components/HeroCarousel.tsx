"use client"
import Image from 'next/image'
import React from 'react'
import { Carousel } from "react-responsive-carousel"
const heroImages = [
    { imgUrl: "/assets/images/hero-1.svg", alt: "smartwatch" },
    { imgUrl: "/assets/images/hero-2.svg", alt: "bag" },
    { imgUrl: "/assets/images/hero-3.svg", alt: "lamp" },
    { imgUrl: "/assets/images/hero-4.svg", alt: "air fryer" },
    { imgUrl: "/assets/images/hero-5.svg", alt: "chair" }

]
const HeroCarousel = () => {
    return (
        <div className=''>
            <Carousel
                infiniteLoop
                interval={2000}
                autoPlay
                showArrows={false}
                showStatus={false}
                showThumbs={false}

            >
                {
                    heroImages.map((item, idx) => (
                        <Image src={item.imgUrl} alt={item.alt} width={484} height={484} className='object-contain' key={idx} />
                    ))
                }


            </Carousel>
        </div>
    )
}

export default HeroCarousel