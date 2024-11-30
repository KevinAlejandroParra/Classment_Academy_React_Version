import React, { useState, useEffect, useRef, useCallback } from 'react';

function Carrousel() {
  const [cursos, setCursos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const autoAdvanceIntervalRef = useRef(null);

  const fetchCursos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cursos');
      if (!response.ok) {
        throw new Error('Error al obtener los cursos');
      }
      const data = await response.json();
      setCursos(data);
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cursos.length);
  }, [cursos.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + cursos.length) % cursos.length
    );
  }, [cursos.length]);

  useEffect(() => {
    fetchCursos();
  }, []);

  useEffect(() => {
    if (cursos.length > 0) {
      // Iniciar auto-avance
      autoAdvanceIntervalRef.current = setInterval(nextSlide, 5000);

      // Limpiar intervalo al desmontar
      return () => {
        if (autoAdvanceIntervalRef.current) {
          clearInterval(autoAdvanceIntervalRef.current);
        }
      };
    }
  }, [cursos, nextSlide]);

  const getAdjacentCourses = () => {
    const totalCourses = cursos.length;
    const prevIndex = (currentIndex - 1 + totalCourses) % totalCourses;
    const nextIndex = (currentIndex + 1) % totalCourses;

    return {
      prevCourse: cursos[prevIndex],
      currentCourse: cursos[currentIndex],
      nextCourse: cursos[nextIndex]
    };
  };

  const handleMouseEnter = () => {
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    autoAdvanceIntervalRef.current = setInterval(nextSlide, 5000);
  };

  if (cursos.length === 0) {
    return <div>Cargando cursos...</div>;
  }

  const { prevCourse, currentCourse, nextCourse } = getAdjacentCourses();

  return (
    <div 
      className="relative overflow-hidden py-16 bg-ghost flex justify-center items-center" 
      data-aos="fade-up"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 space-y-5 max-w-6xl w-full">
        <h2 className="text-4xl font-extrabold text-center capitalize">Cursos destacados</h2>
        
        <div 
          ref={carouselRef}
          className="carousel w-full relative overflow-hidden flex justify-center items-center"
        >
          <div className="flex transition-transform duration-300 ease-in-out justify-center items-center">
            <div className="flex space-x-8 items-center justify-center ">
              {/* Curso anterior */}
              <div className="card w-64 bg-base-100 shadow-xl opacity-50 transform scale-90 transition-all duration-300 rounded-lg">
                <figure>
                  <img 
                    src={prevCourse.curso_imagen_url} 
                    alt="Curso anterior" 
                    className="w-full h-32 object-cover rounded-t-lg" 
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="text-xl font-bold">{prevCourse.curso_nombre}</h3>
                </div>
              </div>

              {/* Curso actual */}
              <div className="card w-80 bg-base-100 rounded-lg z-10">
                <figure>
                  <img 
                    src={currentCourse.curso_imagen_url} 
                    alt={currentCourse.curso_nombre} 
                    className="w-full h-48 object-cover rounded-t-lg" 
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-orange-400">{currentCourse.curso_nombre}</h2>
                  <p className="text-sm">
                    {currentCourse.curso_descripcion.length > 100 
                      ? `${currentCourse.curso_descripcion.substring(0, 100)}...` 
                      : currentCourse.curso_descripcion}
                  </p>
                  <p className="text-xs">Escuela: {currentCourse.escuela_nombre}</p>
                  <p className="text-lg font-bold">
                    ${currentCourse.curso_precio.toFixed(2)}
                  </p>
                  <div className="card-actions justify-end">
                    <a 
                      href={`../APP/Views/Crud/curso_detalle.php?id=${currentCourse.curso_id}`} 
                      className="btn btn-sm btn-primary bg-orange-400 hover:bg-orange-500 border-none rounded-lg"
                    >
                      Ver Curso
                    </a>
                  </div>
                </div>
              </div>

              {/* Curso siguiente */}
              <div className="card w-64 bg-base-100 shadow-xl opacity-50 transform scale-90 transition-all duration-300 rounded-lg">
                <figure>
                  <img 
                    src={nextCourse.curso_imagen_url} 
                    alt="Curso siguiente" 
                    className="w-full h-32 object-cover rounded-t-lg" 
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">{nextCourse.curso_nombre}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Controles del carrusel */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button 
              onClick={prevSlide}
              className="btn btn-circle bg-orange-400 hover:bg-orange-500 border-none ml-2 rounded-lg"
            >
              ❮
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button 
              onClick={nextSlide}
              className="btn btn-circle bg-orange-400 hover:bg-orange-500 border-none mr-2 rounded-lg"
            >
              ❯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrousel;