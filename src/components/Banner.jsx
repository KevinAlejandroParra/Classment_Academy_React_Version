export const Banner = () => {
  return (
    
    <div className="dark:bg-[#061E2D] bg-white min-h-screen flex items-center" id="home">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12 space-y-6">
            <p className="text-[#F86D31] font-athletic text-3xl font-bold">
            Academia de Deportistas
            </p>
            <h1 className="dark:text-white text-gray-800 text-7xl md:text-6xl font-bold leading-tight">
            <div className="fixed w-56 h-56 dark:bg-white bg-[#f0ae333e] inset-x-96 top-90 h-16  rounded-full filter blur-[100px] dark:opacity-30  animate-blob animation-delay-4000"></div>
              Forjando Grandes{" "}
              <br></br>
              <span className="text-7xl text-gradient">deportistas</span>{" "}
              desde <br></br>cualquier lugar!
            </h1>
            <p className="dark:text-white text-gray-600 text-xl leading-relaxed max-w-lg">
              Desarrolla tu potencial deportivo con nuestra plataforma de 
              entrenamiento personalizado y acondicionamiento físico.
            </p>
            <div className="flex space-x-4">
            <button 
              className="bg-[#F86D31] hover:bg-[#071822] text-white text-2xl font-bold py-3 px-6 rounded-full transition-colors duration-300"
              onClick={() => console.log('connect')}
            >
              Conectar con nosotros
              <span className="text-sm pl-2">🚀</span>
            </button>
            <button 
              className="bg-[#F86D31] hover:bg-[#071822] text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
              onClick={() => console.log('connect')}
            >
              Ver detalles 
              <span className="text-sm pl-2">🦁</span>
            </button>
            </div>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0 dark:drop-shadow-[0_0_8px_#FFFFFF] drop-shadow-[0_0_8px_#F86D31] ">
            <img 
              src="/Img/design/basquetbolista.png" 
              alt="Basquetbolista"
              className="w-full max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
)
}