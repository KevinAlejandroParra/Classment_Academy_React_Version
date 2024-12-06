export const Banner = () => {
  return (
    <div className="relative bg-transparent min-h-screen flex items-center overflow-hidden" id="home">
      {/* Decorative Elements */}

      <div className="absolute top-20 left-10 w-24 h-24 opacity-10">
        <i className="fas fa-basketball-ball text-yellow-400 text-6xl animate-spin-slow"></i>
      </div>
      <div className="absolute bottom-20 right-40 w-32 h-32 opacity-10">
        <i className="fas fa-basketball-ball text-yellow-400 text-7xl animate-bounce-slow"></i>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12 space-y-8">
            <div className="relative">
              <p className="dark:text-yellow-400 text-light-text text-3xl font-bold tracking-wide 
                           before:content-[''] before:absolute before:-left-4 before:top-1/2 before:w-2 before:h-12 
                           before:bg-yellow-400 before:-translate-y-1/2">
                Academia de Deportistas
              </p>
            </div>
            
            <h1 className="dark:text-white text-light-primary text-7xl md:text-6xl font-bold leading-tight
                         relative z-10">
              Forjando Grandes{" "}
              <br />
              <span className="text-7xl text-yellow-400 relative">
                deportistas
                <span className="absolute -right-4 -top-2 text-2xl text-yellow-300">
                  <i className="fas fa-star"></i>
                </span>
              </span>{" "}
              desde <br />cualquier lugar!
            </h1>
            
            <p className="text-light-secondary dark:text-gray-300 text-xl leading-relaxed max-w-lg
                        pl-4 border-l-4 border-yellow-400">
              Desarrolla tu potencial deportivo con nuestra plataforma de 
              entrenamiento personalizado y acondicionamiento físico.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                className="group bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 
                         text-white font-bold py-4 px-8 rounded-full transition-all duration-300 
                         transform hover:scale-105 hover:shadow-lg flex items-center"
                onClick={() => console.log('connect')}
              >
                Conectar con nosotros
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </button>
              
              <button 
                className="group bg-transparent hover:bg-yellow-400/10 text-white font-bold py-4 px-8 
                         rounded-full transition-all duration-300 border-2 border-yellow-400 
                         hover:border-yellow-300 flex items-center"
                onClick={() => console.log('connect')}
              >
                Ver detalles
                <i className="fas fa-chevron-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-yellow-400/5 rounded-full blur-xl"></div>
            
            <img 
              src="/Img/design/basquetbolista.png" 
              alt="Basquetbolista"
              className="w-full max-w-2xl mx-auto relative z-10 
                       transition-all duration-500 hover:scale-105
                       dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

