export const Banner = () => {
  return (
    <section className="bg-[#061E2D] h-screen flex flex-col justify-center" id="home">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h2 className="text-[#F86D31] text-xl font-bold">Classment Academy</h2>
            <h1 className="text-6xl font-bold">Forjando Grandes <span className="text-gradient">deportistas</span> desde cualquier lugar!</h1>
            <p className="text-xl">Desarrolla tu potencial deportivo con nuestra plataforma de entrenamiento personalizado y acondicionamiento fisico. En Classment Academy, nos preocupamos por tus objetivos y te ayudamos a alcanzarlos.</p>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => console.log('connect')}>Conectar con nosotros
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
    )
}