import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { FirebaseContext} from '../../firebase'
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;
const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`


const Producto = () => {

  //state del  componente
  const [producto, gurdarProducto] = useState({});
  const [error, guardarError] = useState(false);

  //roting para obtener el id actual
  const router = useRouter()
  const { query: { id }} = router;

  //context del firebase
  const { firebase, usuario } = useContext(FirebaseContext)

  useEffect(() => {
    if(id){
      const obtenerProducto = async () => {
        const productQuery = await firebase.db.collection('productos').doc(id);
        const producto = await productQuery.get();
        if(producto.exists){
          gurdarProducto(producto.data())
        }else {
          guardarError(true);
        }
        
      }
      obtenerProducto();
    }
  })

  if(Object.keys(producto).length === 0) return 'cargando...'

  const {  comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador } = producto

  return ( 
    <Layout>
      <>
        {error && <Error404 />}

        <div className="contenedor">
          <h1 css={css`
            text-align: center;
            margin-top: 5rem;
          `}
          >
            {nombre}
          </h1>
          
          <ContenedorProducto>
            <div>
              <p>Publicado hace: { formatDistanceToNow( new Date(creado), {locale: es} )} </p>
              <p>Publicado por: {creador.nombre} de: {empresa}</p>
              <img src={urlimagen} />
              <p>{descripcion}</p>

              { usuario && (
                <>
                  <h2>Arega tu comentario</h2>
                  <form>
                    <Campo>
                      <input 
                        type="text"
                        name="mensaje"
                      />
                    </Campo>
                    <InputSubmit 
                      type="submit"
                      value="Agregar Comentario"
                    />
                  </form>
                </>
                )}

              <h2 css={css`
                margin: 2rem 0;
              `}>Comentarios</h2>
              {comentarios.map(comentario => {
                <li>
                  <p>{comentario.nombre}</p>
                  <p>Escrito por: {comentario.usuarioNombre}</p>
                </li>
              })}
            </div>
            <aside>
              <Boton
                target="_blank"
                bgColor="true"
                href={url}
              >
                Visistar URL
              </Boton>
              
              <div css={css`
                margin-top: 5rem;
              `}>
                <p css={css`
                  text-align: center;
                `}>{votos} Votos</p>

                {usuario && (
                  <Boton>Votar</Boton>
                )}
                
              </div>
              
            </aside>
          </ContenedorProducto>
        </div>
      </>
    </Layout>
   );
}
 
export default Producto;