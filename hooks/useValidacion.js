import React, { useState, useEffect } from 'react';

const useValidacion = (stateInicial, validar, fn) => {

  const [valores, guardarValores] = useState(stateInicial);
  const [errores, guardarErrorres ] = useState({});
  const [ submitForm, guardarSubmitForm] = useState(false);
  
  useEffect(() => {
    if(submitForm) {
      const noErrores = Object.keys(errores).length === 0;
      if(noErrores) {
        fn() 
        //fn= funcion que se ejcuta en el componente
      }
      guardarSubmitForm(false)
    }
  }, [errores])

  //funcion que se ejecuta conforme el usario escribe algo
  const handleChange = e => {
    guardarValores({
      ...valores,
      [e.target.name] : e.target.value
    })
  }
  
  //funcion que se ejecuta cuando se hace un submit
  const handleSubmit = e => {
    e.preventDefault()
    const erroresValidacion = validar(valores);
    guardarErrorres(erroresValidacion);
    guardarSubmitForm(true);
  }

  // cuando se realiza el evento de blur
  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    guardarErrorres(erroresValidacion);
  }


  return { 
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  };
};

export default useValidacion;