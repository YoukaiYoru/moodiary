// import { MdMenu } from "react-icons/md";
// import { FaRegUser } from "react-icons/fa";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const NavBarMenu = [
  {
    id: 1,
    title: "Home",
    link: "#",
  },
  {
    id: 2,
    title: "Calendario",
    link: "#",
  },
  {
    id: 3,
    title: "Estadisticas",
    link: "#",
  },
  {
    id: 4,
    title: "Blog",
    link: "#",
  },
];

const MainNav = () => {
  return (
    <div
      className="border-b border-[#D8E3E6] bg-white py-2.5 text-[#3F4B52]"
    >
      <div className="container flex items-center justify-items-start">
        {/* logo section */}
        <div>
          <a href="" className="inline-flex items-center">
            {" "}
            {/* Expected link */}
            <h1 className="px-4 text-xl font-bold title">Moodiary</h1>
          </a>
        </div>
        {/* menu section */}
        <div className="hidden md:block">
          <ul className="relative z-40 flex items-center justify-center gap-2">
            {NavBarMenu.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  className="inline-block px-2 py-1.5 text-xs font-semibold uppercase"
                >
                  {item.title}
                </a>
              </li>
            ))}
            {/* <button className='text-xl ps-14 flex items-center'>
                            <FaRegUser />
                            <p className="pl-2 font-bold">Iniciar Sesión</p>

                        </button> */}
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
