import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// You might need to adjust the path to your CSS file
import './styles.css';

function SwiperCarousel() {
  const [cursos, setCursos] = useState([]);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

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
    return <div>Cargando cursos...</div>;
  }

  return (
    <div 
      className="relative overflow-hidden py-16 bg-ghost flex justify-center items-center" 
      data-aos="fade-up"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 space-y-5 max-w-6xl w-full">
        <h2 className="text-4xl font-extrabold text-center capitalize mb-8">Cursos destacados</h2>
        
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {cursos.map((curso, index) => (
            <SwiperSlide key={curso.curso_id}>
              <div className={`card bg-base-100 rounded-lg ${index === 1 ? 'w-80 z-10' : 'w-64 opacity-50 scale-90'}`}>
                <figure>
                  <img 
                    src={curso.curso_imagen_url} 
                    alt={curso.curso_nombre} 
                    className={`w-full object-cover rounded-t-lg ${index === 1 ? 'h-48' : 'h-32'}`}
                  />
                </figure>
                <div className="card-body p-4">
                  <h2 className={`card-title ${index === 1 ? 'text-orange-400' : 'text-sm'}`}>{curso.curso_nombre}</h2>
                  {index === 1 && (
                    <>
                      <p className="text-sm">
                        {curso.curso_descripcion.length > 100 
                          ? `${curso.curso_descripcion.substring(0, 100)}...` 
                          : curso.curso_descripcion}
                      </p>
                      <p className="text-xs">Escuela: {curso.escuela_nombre}</p>
                      <p className="text-lg font-bold">
                        ${curso.curso_precio.toFixed(2)}
                      </p>
                      <div className="card-actions justify-end">
                        <a 
                          href={`../APP/Views/Crud/curso_detalle.php?id=${curso.curso_id}`} 
                          className="btn btn-sm btn-primary bg-orange-400 hover:bg-orange-500 border-none rounded-lg"
                        >
                          Ver Curso
                        </a>
                      </div>
                    </>
                  )}
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