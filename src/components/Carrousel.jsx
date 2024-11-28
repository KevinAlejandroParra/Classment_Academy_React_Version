import { useState, useEffect } from "react";


function Carrousel() {
  const [cursos, setCursos] = useState([]);

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

return (

<div className="container m-5">
<h1>Cursos</h1>
<div className="grid grid-cols-3 gap-4">
  {cursos.map((curso) => (
    <div key={curso.curso_id} className="border p-4">
      <h2>{curso.curso_nombre}</h2>
      <p>{curso.curso_descripcion}</p>
    </div>
  ))}
</div>
</div>
)}

export default Carrousel;