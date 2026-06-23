/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Verifica que la API esté en línea
 *     responses:
 *       200:
 *         description: API funcionando
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: hincha01
 *               password:
 *                 type: string
 *                 example: miPassword123
 *     responses:
 *       201:
 *         description: Usuario creado
 *       409:
 *         description: Username ya registrado
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: hincha01
 *               password:
 *                 type: string
 *                 example: miPassword123
 *     responses:
 *       200:
 *         description: Login exitoso (devuelve token JWT)
 *       401:
 *         description: Credenciales incorrectas
 */

/**
 * @openapi
 * /api/teams:
 *   get:
 *     tags: [Tournament]
 *     summary: Lista de equipos del torneo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/matches:
 *   get:
 *     tags: [Tournament]
 *     summary: Calendario de partidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de partidos
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/players:
 *   get:
 *     tags: [Tournament]
 *     summary: Jugadores de un equipo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de jugadores
 *       400:
 *         description: teamId inválido o faltante
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/me:
 *   get:
 *     tags: [Me]
 *     summary: Datos del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actual
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/me/fixture:
 *   get:
 *     tags: [Me]
 *     summary: Fixture personal del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fixture del usuario
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/me/matches/{matchId}/result:
 *   post:
 *     tags: [Me]
 *     summary: Cargar resultado de un partido
 *     description: No permite cargar dos veces el mismo partido sin borrarlo antes.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [home_goals, away_goals]
 *             properties:
 *               home_goals:
 *                 type: integer
 *                 example: 2
 *               away_goals:
 *                 type: integer
 *                 example: 0
 *               extra_time:
 *                 type: integer
 *                 example: 0
 *               penalties:
 *                 type: integer
 *                 example: 0
 *               penalty_winner:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               goal_events:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [player_id, event_type]
 *                   properties:
 *                     player_id:
 *                       type: integer
 *                     event_type:
 *                       type: string
 *                       enum: [goal, assist]
 *           example:
 *             home_goals: 2
 *             away_goals: 0
 *             goal_events:
 *               - player_id: 10
 *                 event_type: goal
 *               - player_id: 19
 *                 event_type: goal
 *     responses:
 *       201:
 *         description: Resultado cargado
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El partido ya tiene resultado
 *       401:
 *         description: No autenticado
 *   delete:
 *     tags: [Me]
 *     summary: Borrar resultado de un partido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Resultado eliminado
 *       404:
 *         description: No hay resultado para este partido
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/me/standings:
 *   get:
 *     tags: [Me]
 *     summary: Tablas de posiciones de todos los grupos
 *     description: Calcula PJ, PG, PE, PP, GF, GC, DG y PTS según los resultados cargados por el usuario. Orden FIFA.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tablas por grupo (A a H)
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/me/standings/{groupLetter}:
 *   get:
 *     tags: [Me]
 *     summary: Tabla de posiciones de un grupo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupLetter
 *         required: true
 *         schema:
 *           type: string
 *         example: A
 *     responses:
 *       200:
 *         description: Tabla del grupo solicitado
 *       400:
 *         description: Grupo inválido
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/me/bracket:
 *   get:
 *     tags: [Me]
 *     summary: Llave de eliminación directa
 *     description: Devuelve octavos, cuartos, semis, tercer puesto y final. Los equipos se resuelven desde los grupos y avanzan automáticamente al cargar resultados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bracket completo por ronda
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/me/stats/scorers:
 *   get:
 *     tags: [Me]
 *     summary: Top goleadores del torneo
 *     description: Ranking de jugadores según los goal_events cargados en los resultados del usuario.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista ordenada de goleadores
 *       401:
 *         description: No autenticado
 */

/**
 * @openapi
 * /api/me/stats/assisters:
 *   get:
 *     tags: [Me]
 *     summary: Top asistidores del torneo
 *     description: Ranking de jugadores según las asistencias registradas en los resultados del usuario.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista ordenada de asistidores
 *       401:
 *         description: No autenticado
 */

export {};
