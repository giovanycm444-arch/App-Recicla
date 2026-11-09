Documento del MVP: EcoRecicla (Aplicación de Gestión de Reciclaje y Recompensas)

# 1. Nombre del Proyecto

EcoRecicla

# 2. Objetivo del Proyecto

Desarrollar una aplicación web y móvil interactiva que incentive el reciclaje ciudadano mediante un sistema de recolección inteligente, permitiendo a los usuarios registrar sus materiales reciclables (PET, cartón, aluminio, vidrio), acumular puntos por peso o volumen, y canjearlos por descuentos o beneficios en comercios locales. Asimismo, la plataforma otorgará a los centros de acopio y administradores un panel de control para validar entregas, gestionar inventario de materiales y auditar recompensas.

# 3. Requerimientos del Sistema

• Autenticación Única: Acceso al perfil mediante número de cuenta, matrícula institucional o correo electrónico verificado.

• Registro y Clasificación de Residuos: Formulario interactivo para seleccionar el tipo de material reciclable (Plástico PET, Cartón, Aluminio, Vidrio, Papel), estimar la cantidad/peso y programar la entrega o depósito.

• Sistema de Peseo y Geolocalización: Módulo para ubicar los centros de acopio autorizados más cercanos mediante mapas interactivos y horarios de atención.

• Billetera de Eco-Puntos: Conversión automática de los materiales entregados a puntos digitales acreditados en el perfil del usuario tras la validación física en el centro de acopio.

• Catálogo de Canje de Recompensas: Interfaz de canje donde los usuarios pueden intercambiar sus eco-puntos por cupones de descuento, productos ecológicos o beneficios con patrocinadores locales.

• Panel de Administración y Centros de Acopio: Módulo protegido para que los operadores validen el pesaje real de los residuos recibidos, aprueben la acreditación de puntos y gestionen la logística de recolección.

# 4. Roles de Usuario

## Ciudadano / Participante

• Inicia sesión en su cuenta personal.

• Consulta el mapa y localiza centros de acopio cercanos.

• Registra el tipo y cantidad estimada de residuos que planea reciclar.

• Muestra su código QR digital en el centro de acopio para registrar su entrega.

• Consulta su saldo de eco-puntos e intercambia recompensas en el catálogo.

## Operador / Centro de Acopio

• Escanea el código QR del ciudadano al recibir los materiales.

• Ingresa el peso real validado en báscula de los residuos.

• Confirma la transacción para liberar los puntos en la cuenta del usuario.

## Administrador General

• Gestiona el alta y baja de centros de acopio y operadores.

• Da de alta los comercios patrocinadores y las recompensas del catálogo.

• Monitorea las estadísticas globales de reciclaje (kilogramos recolectados por tipo de material).

# 5. Criterios de Aceptación (Acceptance Criteria)

• CA-01: Validación de Registro y Acceso  
\- DADO QUE un usuario ingresa sus credenciales en la aplicación.  
\- CUANDO el correo y la contraseña coinciden con los registros de la base de datos.  
\- ENTONCES la aplicación permitirá el acceso al panel principal mostrando el perfil y el saldo actual de eco-puntos.

• CA-02: Geolocalización de Centros de Acopio  
\- DADO QUE el usuario accede a la sección de mapa.  
\- CUANDO otorga permisos de ubicación o ingresa su código postal.  
\- ENTONCES el sistema desplegará los centros de acopio activos más cercanos con dirección, estatus (Abierto/Cerrado) y materiales aceptados.

• CA-03: Registro y Depósito de Materiales  
\- DADO QUE el usuario entrega sus residuos y el operador escanea su QR.  
\- CUANDO el operador ingresa el peso verificado en báscula.  
\- ENTONCES el sistema calculará los eco-puntos correspondientes y actualizará el balance de forma inmediata.

• CA-04: Restricción y Canje de Recompensas  
\- DADO QUE el usuario navega por el catálogo con puntos suficientes.  
\- CUANDO selecciona un cupón y confirma el canje.  
\- ENTONCES el sistema descontará los puntos y generará un código único para el establecimiento.

• CA-05: Reportes y Métricas Administrativas  
\- DADO QUE el administrador general ingresa al panel de control.  
\- CUANDO selecciona el rango de fechas para el reporte de impacto ambiental.  
\- ENTONCES la plataforma arrojará el total de kilogramos reciclados por categoría y usuarios activos.