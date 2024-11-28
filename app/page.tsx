import Image from 'next/image'
import React from 'react'
// import SeachBar from '@/components/SearchBar'
import SearchBar from '@/components/SearchBar'
import HeroCarousel from '@/components/HeroCarousel'
import ProductCard from "../components/ProductCard.tsx"
import { getAllProduct } from '@/lib/actions'
const Home = async () => {
  const allProducts = await getAllProduct()
  console.log(allProducts)
  return (
    <>
      <section className='border-red-300 px-6 md:px-20 border-2 py-24'>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>
            <p className='small-text'>
              Smart Shooping Starts Here :
              <Image
                alt="arrow"
                src={"/assets/icons/arrow-right.svg"}
                width={16}
                height={16}
              />
            </p>
            <h1 className='head-text'>
              Unleash the Power of <span className='text-primary'>
                PriceWise
              </span>


            </h1>
            <p className='pt-6'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque autem vero assumenda provident voluptate incidunt
            </p>
            <SearchBar />
          </div>
          {/* <HeroCarousel /> */}

        </div>


      </section>
      <section className='trending-section'>
        <h2 className='section-text'>
          Trending
        </h2>
        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {
            allProducts?.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))
          }
        </div>
      </section>
    </>
  )
}

export default Home