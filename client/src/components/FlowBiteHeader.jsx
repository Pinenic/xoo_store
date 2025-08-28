import React from "react";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../context/useCart";


export default function FlowBiteHeader({profile}) {
    const { items, loading } = useCartStore();
  const { signOut } = useAuth()
  return (<>
  <Navbar fluid className="sticky top-0 z-50 bg-white">
    <NavbarBrand>
        <img src="#" alt="" />
        <Link to={"/"}><span className="self-center whitespace-nowrap text-xl font-semibold text-black">Xoo Store</span></Link>
    </NavbarBrand>
    {profile ? (
      <>
      <div className="flex gap-4 items-center md:order-2">
        <Link to="/cart" className="flex  gap-2 text-gray-600 rounded-full p-[0.6em] hover:bg-gray-600/10">
        <ShoppingCart />
        <span>{items.length > 0 ? items.length : ""}</span>
        </Link>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img={profile.avatar_url} rounded />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">{profile.name}</span>
            <span className="block truncate text-sm font-medium">{profile.email}</span>
          </DropdownHeader>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={() => signOut()}>Logout</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      </>
    ) : (
      <>
     <div className=" flex items-center md:order-2">
      <Link to="/cart" className="text-gray-600 rounded-full p-[0.6em] hover:bg-gray-600/10">
        <ShoppingCart />
        </Link>
        <Button><Link
              to="/auth"
              className="w-full"
            >
              Login
            </Link></Button>
    <NavbarToggle />
      </div>
      </>
    )}
    <NavbarCollapse>
        <NavbarLink href="/marketplace">
            Marketplace
        </NavbarLink>
        <NavbarLink href="/features">
            Features
        </NavbarLink>
        <NavbarLink href="#">
            Contact
        </NavbarLink>
    </NavbarCollapse>

  </Navbar>
  
  </>);
}
