| METHOD        | URL                                 | DESCRIPTION                                                     |
| ------------- | ------------------------------------| --------------------------------------------------|
| GET           | /                                   | `Introducción a la web api`   |
| GET           | /register                           | `Vista con form de registro`   |
| POST          | /register                           | `Se ejecuta el registro y te lleva a tu perfil`   |
| GET           | /login                              | `Vista con form de logueo`   |
| POST          | /login                              | `Inicia sesión y te lleva a la lista de partidos`   |
| GET           | /profile                            | `Detalles del perfil que ha iniciado sesión`   |
| POST          | /profile                            | `El usuario puede editar su perfil`   |
| POST          | /profile/:id/comment                | `Deja un comentario en el perfil deseado`   |
| POST          | /profile/:id/edit                   | `El rol de admin puede acceder y editar dicho usuario`   |
| POST          | /profile/:id/delete                 | `El rol de admin puede acceder y borrar dicho usuario`   |
| GET           | /matches                            | `Lista completa de partidos disponibles`   |
| POST          | /matches/:id/join                   | `El usuario se une al match deseado`   |
| POST          | /matches/:id/drop-out               | `El usuario se desapunta de un partido`   |
| POST          | /matches/create                     | `Crea un partido`   |
| GET           | /matches/match-details              | `Ver los detalles de un partido` |
| POST          | /matches/match-details/:id/delete   | `El organizador o admin puede eliminar el partido seleccionado`  |
| POST          | /matches/match-details/:id/edit     | `El organizador o admin puede editar el partido seleccionado`  |
| GET           | /leaderboard                        | `Número de victorias ordenadas por usuario` |
