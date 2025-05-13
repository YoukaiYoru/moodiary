import { SignInButton } from "@clerk/clerk-react";
function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-[40%] flex flex-col items-center rounded-4xl shadow-2xl p-6">
        <h1 className="font-playwrite text-6xl pb-10">Moodiary</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
          distinctio vel est culpa, iste reiciendis laudantium rerum. Ea,
          laboriosam recusandae!
        </p>
        <SignInButton forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}

export default Home;
