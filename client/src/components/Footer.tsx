import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"; // ✅ use shadcn/ui, not radix directly

const Footer = () => {
    return (
        // <footer className="bg-transparent rounded-t-lg flex items-center justify-end shadow px-10 py-1 dark:bg-gray-800 antialiased">
        <footer className="bg-[#D3DADC] rounded-t-lg flex items-center justify-end shadow px-10 py-1 dark:bg-gray-800 antialiased">
            <p className="text-gray-700 dark:text-gray-400 text-[1rem]">
                &copy; {new Date().getFullYear()} Moodiary.&nbsp;Todos los derechos reservados.&nbsp;&nbsp;
            </p>
            <div className="flex justify-center items-center space-x-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="https://github.com/YoukaiYoru/moodiary"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
                                <svg
                                    className="w-7 h-7"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                                        clipRule="evenodd" />
                                </svg>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent>
                            Califícanos en GitHub
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </footer>
    );
};

export default Footer;