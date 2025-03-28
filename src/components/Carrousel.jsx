import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

// Importar solo los estilos necesarios de Swiper
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

function SwiperCarousel() {
  const [cursos, setCursos] = useState([]);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const swiperRef = useRef(null);

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

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
      setIsAutoplayPaused(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
      setIsAutoplayPaused(false);
    }
  }, []);

  if (cursos.length === 0) {
    return <div className="text-center py-8">Cargando cursos...</div>;
  }

  return (
    <div 
      className="relative overflow-hidden py-16 bg-ghost flex justify-center items-center " 
      data-aos="fade-up"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 space-y-5 max-w-7xl w-full">
        <h2 className="text-4xl font-extrabold text-center capitalize mb-8 dark:text-white">Cursos destacados</h2>
        
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper overflow-visible"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {cursos.map((curso) => (
            <SwiperSlide key={curso.curso_id} className="bg-center bg-cover w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] dark:drop-shadow-[0_0_8px_#FFFFFF] drop-shadow-[0_0_8px_#F86D31]">
              <div className="card bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 dark:bg-gray-800">
                <figure className="relative">
                  <img 
                    src={curso.curso_imagen_url} 
                    alt={curso.curso_nombre} 
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-xl font-semibold mb-2 dark:text-white">{curso.curso_nombre}</h2>
                  <p className="text-lg mb-2 dark:text-gray-300 line-clamp-2">
                    {curso.curso_descripcion}
                  </p>
                  <p className="text-sm mb-2 dark:text-gray-400">Escuela: {curso.escuela_nombre}</p>
                  <p className="text-lg font-bold mb-2 dark:text-white">
                    ${curso.curso_precio}
                  </p>
                  <div className="card-actions justify-end pt-2 pb-2">
                    <a 
                      href={`../APP/Views/Crud/curso_detalle.php?id=${curso.curso_id}`} 
                      className="btn rounded-lg px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white font-semibold dark:bg-orange-600 dark:hover:bg-orange-700 dark:text-gray-100 transition duration-300 ease-in-out">
                      Ver Curso
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default SwiperCarousel;


