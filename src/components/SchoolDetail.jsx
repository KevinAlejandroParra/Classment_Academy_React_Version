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

