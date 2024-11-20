export const Banner = () => {
  return (
    
    <section className="dark:bg-[#061E2D] light:bg-[#d8693e] min-h-screen flex items-center" id="home">
      <div className="container mx-auto px-4">
  <div className="fixed w-56 h-56 bg-white bottom-32 left-1/3 rounded-full filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12 space-y-6">
            <h2 className="text-[#F86D31] text-xl font-bold">
              Classment Academy
            </h2>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Forjando Grandes{" "}
              <span className="text-5xl text-gradient">deportistas</span>{" "}
              desde cualquier lugar!
            </h1>
            <p className="text-base leading-relaxed max-w-lg">
              Desarrolla tu potencial deportivo con nuestra plataforma de 
              entrenamiento personalizado y acondicionamiento físico.
            </p>
            <button 
              className="bg-[#F86D31] hover:bg-[#071822] text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
              onClick={() => console.log('connect')}
            >
              Conectar con nosotros
              <span className="text-sm pl-2">🚀</span>
            </button>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <img 
              src="/images/basquetbolista.png" 
              alt="Basquetbolista"
              className="w-full max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}