import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSchool, 
  faUserTie, 
  faCalendarAlt, 
  faCalendarCheck, 
  faUsers, 
  faChild, 
  faMapMarkerAlt, 
  faPhone,
  faClock,
  faLocationDot,
  faChalkboardUser
} from '@fortawesome/free-solid-svg-icons';
import CourseModel from '../models/CourseModel';

const CourseHeader = ({ course }) => (
  <figure className="relative h-64 sm:h-80 md:h-96 mb-8 overflow-hidden rounded-b-3xl shadow-lg">
    <img 
      src={course.curso_imagen_url || ''} 
      alt={course.curso_nombre || 'Imagen del curso'} 
      className="w-full h-full object-cover absolute inset-0"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <h1 className="text-yellow-400 text-3xl md:text-4xl font-bold text-center px-4 drop-shadow-lg">
        {course.curso_nombre || 'Curso'}
      </h1>
    </div>
  </figure>
);

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseData = await CourseModel.getCourseDetails(id);
        setCourse(courseData);
      } catch (error) {
        setError('Error al cargar los detalles del curso. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8 text-light-primary dark:text-dark-primary">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!course) {
    return <div className="text-center py-8 text-light-primary dark:text-dark-primary">Curso no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      <CourseHeader course={course} />
      
      <main className="container mx-auto px-4 max-w-6xl -mt-16 relative z-10">
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl shadow-light-shadow dark:shadow-dark-shadow overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Información del Curso */}
            <section>
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-light-primary dark:text-dark-primary mb-2">
                    <FontAwesomeIcon icon={faSchool} className="mr-3 text-light-accent dark:text-dark-accent" />
                    {course.curso_nombre}
                  </h2>
                  <p className="text-light-secondary dark:text-dark-secondary">
                    <FontAwesomeIcon icon={faChalkboardUser} className="mr-2 text-light-warning dark:text-dark-warning" />
                    {course.escuela_nombre}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-light-accent dark:text-dark-accent mb-2">
                    ${course.curso_precio?.toFixed(2) || '0.00'}
                  </p>
                  <button className="btn bg-light-success dark:bg-dark-success text-white hover:bg-opacity-90 rounded-full px-6 py-2">
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    Inscribirse
                  </button>
                </div>
              </div>
            </section>

            {/* Descripción */}
            <section>
              <h3 className="text-2xl font-semibold text-light-primary dark:text-dark-primary mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-light-warning dark:text-dark-warning" />
                Descripción
              </h3>
              <p className="text-light-secondary dark:text-dark-secondary">
                {course.curso_descripcion || 'Sin descripción disponible.'}
              </p>
            </section>

            {/* Detalles del Curso */}
            <section className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold text-light-primary dark:text-dark-primary mb-4">
                  <FontAwesomeIcon icon={faClock} className="mr-3 text-light-warning dark:text-dark-warning" />
                  Detalles del Curso
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-light-accent dark:text-dark-accent" />
                    Inicio: {course.curso_fecha_inicio ? new Date(course.curso_fecha_inicio).toLocaleDateString() : 'N/A'}
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarCheck} className="mr-3 text-light-accent dark:text-dark-accent" />
                    Fin: {course.curso_fecha_fin ? new Date(course.curso_fecha_fin).toLocaleDateString() : 'N/A'}
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faUsers} className="mr-3 text-light-accent dark:text-dark-accent" />
                    Cupos: {course.estudiantes_matriculados || 0}/{course.curso_capacidad_maxima || 'N/A'}
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faChild} className="mr-3 text-light-accent dark:text-dark-accent" />
                    Edad mínima: {course.curso_edad_minima || 'N/A'} años
                  </li>
                </ul>
              </div>

              {/* Ubicación */}
              <div>
                <h4 className="text-xl font-semibold text-light-primary dark:text-dark-primary mb-4">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-3 text-light-warning dark:text-dark-warning" />
                  Ubicación
                </h4>
                <div className="space-y-3">
                  <p className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-light-accent dark:text-dark-accent" />
                    {course.curso_direccion || 'Dirección no disponible'}
                  </p>
                  <p className="flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="mr-3 text-light-accent dark:text-dark-accent" />
                    {course.escuela_telefono || 'Teléfono no disponible'}
                  </p>
                </div>
              </div>
            </section>

            {/* Profesor */}
            <section>
              <h3 className="text-2xl font-semibold text-light-primary dark:text-dark-primary mb-4">
                <FontAwesomeIcon icon={faUserTie} className="mr-3 text-light-warning dark:text-dark-warning" />
                Profesor
              </h3>
              {course.profesor_nombre ? (
                <div className="flex items-center space-x-4 bg-light-background dark:bg-dark-background p-4 rounded-xl">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-light-warning dark:ring-dark-warning ring-offset-2">
                      <img 
                        src={course.profesor_imagen || ''} 
                        alt={`${course.profesor_nombre} ${course.profesor_apellido}`} 
                        className="object-cover rounded-full "
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-light-accent dark:text-dark-accent">
                      {course.profesor_nombre} {course.profesor_apellido}
                    </p>
                    <p className="text-light-secondary dark:text-dark-secondary">Profesor del curso</p>
                  </div>
                </div>
              ) : (
                <p className="text-light-secondary dark:text-dark-secondary">
                  Información del profesor no disponible.
                </p>
              )}
            </section>

            {/* Horarios */}
            <section>
              <h3 className="text-2xl font-semibold text-light-primary dark:text-dark-primary mb-4">
                <FontAwesomeIcon icon={faClock} className="mr-3 text-light-warning dark:text-dark-warning" />
                Horarios
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(course.horarios) && course.horarios.length > 0 ? (
                  course.horarios.map((schedule, index) => (
                    <div 
                      key={index} 
                      className="bg-light-background dark:bg-dark-background p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                      <p className="text-lg font-semibold text-light-accent dark:text-dark-accent">
                        {schedule.horario_dia}
                      </p>
                      <p className="text-light-secondary dark:text-dark-secondary">
                        {schedule.horario_hora_inicio} - {schedule.horario_hora_fin}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-light-secondary dark:text-dark-secondary col-span-full text-center">
                    No hay horarios disponibles.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;