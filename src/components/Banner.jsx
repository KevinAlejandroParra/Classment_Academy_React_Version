import { Container } from "postcss"

export const Banner = () => {
return (
  <section className="banner" id="home">
    <Container>
      <row className="align-items-center">
        <Col xs={12} md={6} xl={7}>
        <span className="tagline">Forjando Grandes deportistas desde cualquier lugar!</span>
        
        <h1>{`¡Bienvenido a Classment Academy!`}<span className="wrap">Cumple con tus objetivos nosotros te ayudamos</span></h1>
        <p>Desarrolla tu potencial deportivo con nuestra plataforma de entrenamiento personalizado y acondicionamiento fisico. En Classment Academy, nos preocupamos por tus objetivos y te ayudamos a alcanzarlos.</p>
        <button onClick={() => console.log('connect')}>Conectar con nosotros <ArrowRightCircle size={25} /></button>
        </Col>
      </row>
    </Container>
  </section>
)
}