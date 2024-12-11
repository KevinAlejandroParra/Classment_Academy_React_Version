import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faVolleyball, faDumbbell } from "@fortawesome/free-solid-svg-icons";

export const Banner = () => {
  return (
    <div className="relative bg-transparent min-h-screen flex items-center overflow-hidden" id="home">
      {/* Decorative Elements */}


      <div className="absolute top-60 right-5 w-32 h-32 ">
        <FontAwesomeIcon 
          icon={faDumbbell} 
          className="text-yellow-400 text-6xl "
        />
      </div>
      <div className="absolute bottom-32 left-1/2 w-32 h-32">
        <FontAwesomeIcon 
          icon={faVolleyball} 
          className="text-yellow-400 text-6xl "
        />
      </div>

      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12 space-y-8">
            <div className="relative">
              <p className="dark:text-yellow-400 text-light-text text-2xl font-bold tracking-wide 
                           before:content-[''] before:absolute before:-left-4 before:top-1/2 before:w-2 before:h-12 
                           before:bg-yellow-400 before:-translate-y-1/2">
                Academia de Deportistas
              </p>
            </div>
            
            <h1 className="dark:text-white text-light-primary text-6xl md:text-6xl font-bold leading-tight
                         relative z-10">
              Forjando Grandes{" "}
              <br />
              <span className="text-6xl text-yellow-400 relative">
                deportistas
                <span className="absolute -right-4 -top-2 text-2xl text-yellow-300">
                  <i className="fas fa-star"></i>
                </span>
              </span>{" "}
              desde <br />cualquier lugar!
            </h1>
            
            <p className="text-gray-800 dark:text-gray-300 text-lg leading-relaxed max-w-lg
                        pl-4 border-l-4 border-yellow-400">
              Desarrolla tu potencial deportivo con nuestra plataforma de 
              entrenamiento personalizado y acondicionamiento físico.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <button 
                className="btn rounded-full px-6 font-bold bg-yellow-400 border-none shadow-lg shadow-yellow-500/30 hover:bg-yellow-600 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                ¡Empieza ahora!
                </span>
              </button>
              
              <button 
                className="group bg-transparent hover:bg-yellow-400/10 text-black dark:text-dark-text font-bold py-4 px-7 
                         rounded-full transition-all duration-300 border-2 border-yellow-400 
                         hover:border-yellow-300 flex items-center"
                onClick={() => console.log('connect')}
              >
                Soy escuela
                <i className="fas fa-chevron-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>


            <img 
              src="/Img/design/basquetbolista.png" 
              alt="Basquetbolista"
              className="w-full max-w-xl mx-auto relative z-10 
                       transition-all duration-500 hover:scale-105
                       drop-shadow-[0_0_20px_rgba(202,138,4,0.4)]
                       dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"

            />
        </div>
      </div>
    </div>
  )
}
