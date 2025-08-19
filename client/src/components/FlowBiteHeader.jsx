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


export default function FlowBiteHeader({profile}) {
  const { signOut } = useAuth()
  return (<>
  <Navbar fluid light>
    <NavbarBrand>
        <img src="" alt="" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Xoo Store</span>
    </NavbarBrand>
    {profile ? (
      <>
      <div className="flex md:order-2">
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
        <NavbarLink href="#">
            Marketplace
        </NavbarLink>
        <NavbarLink href="#">
            Features
        </NavbarLink>
        <NavbarLink href="#">
            Contact
        </NavbarLink>
    </NavbarCollapse>

  </Navbar>
  
  </>);
}
