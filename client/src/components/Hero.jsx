import React, { useState } from "react";
import { Dropdown, DropdownItem, TextInput, Carousel } from "flowbite-react";
import { ArrowRightIcon, Search } from "lucide-react";
import useProducts from "../hooks/useProducts";

export default function Hero(props) {
  const [search, setSearch] = useState("");
  const { products, loading } = useProducts(5);
  const dropItems = [
    "Electronics",
    "Fashion",
    "Toys",
    "Home & Garden",
    "Books",
  ];

  const captitaliseFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row p-6 gap-8 md:h-[40em]">
        <div className="flex flex-col gap-4 md:w-[50%] lg:w-[60%] p-4">
          <h1 className="text-3xl lg:text-5xl font-bold px-4 md:px-1">
            Don't miss out on Exclusive Deals made just for you.
          </h1>
          <p className="text-lg p-1 text-gray-600 px-6 md:px-1">
            Made for easy shopping
          </p>
          <form
            action=""
            className="flex justify-between rounded-lg border-2 w-[95%] self-center mt-8"
          >
            <Dropdown
              label="Categories"
              inline
              placement="bottom"
              size="sm"
              className="rounded md:w-[10%] md:text-sm"
            >
              {dropItems.map((item) => (
                <DropdownItem>{item}</DropdownItem>
              ))}
            </Dropdown>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Search"
              className="rounded-none border-0 w-2/3"
              required
            />
            <Search className="rounded-none h-full w-10 p-1 px-2 hover:cursor-pointer " />
          </form>
          <hr className="w-[95%] self-center py-2 mt-5" />
          <div className="flex p-4 md:px-1">
            <div className="w-1/2">
              <h2 className="font-medium text-sm lg:text-lg">
                Shopping made easy
              </h2>
              <p className="text-xs lg:text-sm p-1 text-gray-600 md:">
                With a large range of products from different sellers, there is
                always something for you
              </p>
            </div>
            <div className="w-1/2">
              <h2 className="font-medium text-sm lg:text-lg">
                Best selling experience
              </h2>
              <p className="text-xs lg:text-sm p-1 text-gray-600">
                Our selling platform helps to cater to your every entrepenuer
                need
              </p>
            </div>
          </div>
        </div>
        <div className="h-[25em] md:h-full md:w-[50%] lg:w-[40%]">
          <Carousel
            indicators={false}
            className="md:h-[80%] lg:h-[80%] bg-cyan-50 border-2 rounded-xl"
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              products.map((product) => (
                <div className="flex flex-col gap-4 justify between">
                  <img
                    src={product.thumbnail}
                    alt="..."
                    className="w-fit self-center"
                  />
                  <div className="flex flex-col">
                    <p className=" px-6 text-gray-900 font-medium">
                      {product.title}
                      <br></br>{" "}
                      {product.tags.map((tag) => captitaliseFirst(tag) + ", ")}{" "}
                      {product.brand}
                    </p>
                    <a
                      href="#"
                      className="flex gap-3 text-[0.9rem] text-blue-700 px-6 p-2 mb-12"
                    >
                      See more deals like this{" "}
                      <ArrowRightIcon className="w-5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </Carousel>
        </div>
      </div>
    </>
  );
}
