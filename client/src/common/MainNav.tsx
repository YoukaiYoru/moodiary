// import { MdMenu } from "react-icons/md";
// import { FaRegUser } from "react-icons/fa";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

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
]

const MainNav = () => {
    return (
        <div className="bg-indigo-500 text-white py-8" style={{ backgroundColor: "#E6AB5C" }}>
            <div className="container flex justify-items-start items-center">

                {/* logo section */}
                <div>
                    <a href=""> {/* Expected link */}
                        <h1 className="text-3xl font-bold px-10 title">Moodiary</h1>
                    </a>
                </div>
                {/* menu section */}
                <div className='hidden md:block'>
                    <ul className='flex justify-center items-center gap-4 relative z-40'>
                        {NavBarMenu.map((item) => (
                            <li key={item.id}>
                                <a href={item.link} className='inline-block text-base font-semibold py-2 px-3 uppercase'>{item.title}</a>
                            </li>
                        ))}
                        {/* <button className='text-xl ps-14 flex items-center'>
                            <FaRegUser />
                            <p className="pl-2 font-bold">Iniciar Sesión</p>

                        </button> */}
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn >
                            <UserButton />
                        </SignedIn>
                        <h1 className="text-3xl font-bold px-10 font-playwrite">Hello world</h1>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MainNav