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
  faChalkboardUser,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import CourseModel from '../models/CourseModel';

//Inica la logica

//encabezado para imagen y nombre de la escuela

const SchoolHeader = ({School}) => (

    <figure className="relative h-64 sm:h-80 md:h-96 mb-8 overflow-hidden rounded-b-3xl shadow-lg">
        <img 
        src={school.imagen_escuela_url || ''} 
        alt={school.escuela_nombre || 'Imagen de la escuela'}
        className="w-full h-full object-cover absolute inset-0"
         />

         <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <h1 className='text-yellow-400 text-3xl md:text-4xl font-bold text-center px-4 drop-shadow-lg'>
                {school.escuela_nombre || 'escuela'}
            </h1>
         </div>
    </figure>
);

const SchoolDetail = () => {
    const [school, setSchool] = useState(null);
    const[loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchSchoolDetails = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/escuelas/${id}');
                const SchoolData = await response.json();
                SetSchool(SchoolData);
            } catch(error){
                setError('Error al cargar los detalles de la escuela. Por favor, intente más tarde.');
            } finally {
                setLoading(false);
            }
    };

    fetchSchoolDetails();
}, [id]);

if (loading) {
    return <div className="text-center py-8 text-light-primary dark:text-dark-primary">Cargando...</div>;
}

if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
}

if(!school){
    return <div className='text-center py-8 text-light-primary dark:text-dark-primary'>Escuela no encontrada</div>
}

return (

    <div className='"min-h-screen bg-light-background dark:bg-dark-background'>
        <SchoolHeader School={school}/>

        <main className='"container mx-auto px-4 max-w-6xl -mt-16 relative z-10'>
            <div className='bg-white dark:bg-dark-card rounded-3xl shadow-2xl shadow-light-shadow dark:shadow-dark-shadow overflow-hidden'>
                <div className='p-8 space-y-8'>
                        {/*Informacion de la escuela*/}
                        <section>
                            <div className='flex flex-wrap justify-between items-center mb-6'>
                                <div>
                                    <h2 className='text-3xl font-bold text-light-primary dark:text-dark-primary mb-2'>
                                        <FontAwesomeIcon icon = {faSchool} className='mr-3 text-light-accent dark:text-dark-accent'/>
                                        {school.escuela.nombre}
                                    </h2>

                                    <p className='text-light-secondary dark:text-dark-secondary'>
                                        {school.escuela.direccion || 'Direccion no disponible por el momento'}
                                    </p>
                                </div>

                                <div className='text-right'>
                                    <p className='text-3xl font-bold text-light-accent dark:text-dark-accent mb-2'>
                                        {shchool.escuela.telefono || 'Número de telefono no dispnible por el momento'}
                                    </p>
                                    <button className='btn bg-light-success dark:bg-dark-success text-white hover:bg-opacity-90 rounded-full px-6 py-2'>
                                        <FontAwesomeIcon icon = {faUser} className='mr-2'/>
                                        Incribirme
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/*Descripcion*/}

                        <section>
                            <h3 className='text-2xl font-semibold text-light-primary dark:text-dark-primary mb-4'>
                                <FontAwesomeIcon icon = {faMapMarkerAlt} className='mr-3 text-light-warning dark:text-dark-warning'/>
                                Descripcion
                            </h3>
                            <p className='text-light-text dark:text-dark-secondary'>
                                {school.escuela.descripcion || 'Descripcion no disponible por el momento'} 
                            </p>
                        </section>


                </div>
            </div>
        </main>
    </div>
);

};

export default SchoolDetail;