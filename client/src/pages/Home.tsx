function Home() {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-[40%] flex flex-col items-center rounded-4xl shadow-2xl p-6">
                <h1 className="font-playwrite text-6xl pb-10">Moodiary</h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo distinctio vel est culpa, iste reiciendis laudantium rerum. Ea, laboriosam recusandae!
                </p>
                <button className="px-6 py-2 mt-10 rounded-full text-white shadow-lg bg-indigo-600 hover:shadow-xl transition-shadow">
                    Iniciar Sesión
                </button>
            </div>
        </div >
    )
}

export default Home