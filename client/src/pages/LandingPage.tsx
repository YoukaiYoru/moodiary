import Navbar from '../components/Navbar'

function LandingPage() {
    return (
        <div>
            <Navbar />
            <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 py-20 bg-gradient-to-b from-indigo-100 to-white">
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-4 bg-red-200 rounded-4xl">
                        Registra tus emociones. <br /> Mejora tu bienestar.
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Moodiary es tu diario emocional privado y seguro. Reflexiona, registra y acompáñate en tu día a día con frases motivadoras.
                    </p>
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 transition">
                        Comienza ahora
                    </button>
                </div>
                <div className="md:w-1/2 mb-10 md:mb-0">
                    {/* <img src={diaryImage} alt="Diario emocional" className="w-full max-w-md mx-auto" /> */}
                </div>
            </section>
        </div>
    )
}

export default LandingPage