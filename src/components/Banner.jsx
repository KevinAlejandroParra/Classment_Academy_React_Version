export const Banner = () => {
  return (
    <section className="bg-gradient-to-r from-sky-500 to-indigo-500 h-screen flex flex-col justify-center" id="home">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <span className="text-2xl font-bold">Forjando Grandes deportistas desde cualquier lugar!</span>
            <h1 className="text-6xl font-bold">¡Bienvenido a Classment Academy! </h1>
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
