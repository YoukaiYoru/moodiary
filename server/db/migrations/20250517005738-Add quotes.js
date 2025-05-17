'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insertar frases
    const frases = [
      // Alegría
      'La alegría es la chispa que enciende el alma, ¡déjala brillar siempre!',
      'Sigue irradiando esa felicidad, tu energía positiva contagia a todos.',
      'La vida es más hermosa cuando sonríes, nunca dejes de hacerlo.',
      'Celebra cada pequeño momento, la alegría está en los detalles.',
      'Tu alegría es un regalo para el mundo, compártelo sin miedo.',
      'Cada día es una nueva oportunidad para ser feliz.',
      'La felicidad es una decisión, elige ser alegre hoy.',
      'Mantén tu corazón ligero y tu espíritu elevado.',
      'La risa es la mejor medicina, no olvides recetártela a diario.',
      'La alegría auténtica viene de agradecer lo que tienes.',
      // Calma
      'En la calma encuentras la fuerza que necesitas para seguir.',
      'Respira profundo, la paz interior es tu mejor refugio.',
      'La tranquilidad del alma es el mayor tesoro que puedes cultivar.',
      'Aprende a disfrutar de los momentos de silencio y serenidad.',
      'La calma no es ausencia de tormenta, sino poder mantenerse firme en ella.',
      'Cada respiro consciente te acerca más a la paz.',
      'La paciencia y la calma son las aliadas de la sabiduría.',
      'En la serenidad encuentras claridad para tomar mejores decisiones.',
      'Deja que la calma inunde tu mente y tu corazón.',
      'La calma es el lenguaje que tu alma habla cuando la escuchas.',
      // Tristeza
      'Está bien sentirse triste, pero recuerda que después de la tormenta sale el sol.',
      'Cada lágrima es un paso hacia la sanación.',
      'No estás solo; la tristeza también es parte del crecimiento.',
      'Permítete sentir, para luego poder sanar y avanzar.',
      'El dolor es temporal, la esperanza es eterna.',
      'La tristeza es el eco de un corazón que busca luz.',
      'Abraza tu tristeza y déjala enseñarte algo valioso.',
      'Después de la noche más oscura, siempre llega el amanecer.',
      'El tiempo cura las heridas, confía en el proceso.',
      'Deja que tu tristeza sea semilla de fuerza y transformación.',
      // Ansiedad
      'Respira hondo, la calma está a solo un instante de distancia.',
      'Un paso a la vez, la ansiedad perderá terreno.',
      'No luches contra la ansiedad, aprende a observarla sin miedo.',
      'Eres más fuerte que cualquier tormenta interna.',
      'La serenidad comienza con un solo respiro consciente.',
      'Permítete pausar y reconectar con tu paz interior.',
      'La ansiedad no define quién eres; eres mucho más que eso.',
      'Enfócate en el presente, ahí reside tu poder.',
      'Cada pequeño acto de autocuidado es un paso hacia la calma.',
      'Confía en que la ansiedad pasará y la paz volverá a ti.',
      // Enojo
      'La verdadera fuerza está en controlar la ira, no en dejarse dominar por ella.',
      'Respira y canaliza esa energía hacia algo positivo.',
      'El enojo es natural, pero no permitas que controle tus acciones.',
      'Aprende a expresar tu enojo con respeto y claridad.',
      'Cada momento de ira es una oportunidad para crecer en paciencia.',
      'La calma después del enojo es donde reside la sabiduría.',
      'No dejes que el enojo cierre puertas; úsalo para abrir caminos.',
      'La paz interior comienza cuando decides soltar la rabia.',
      'Reconoce tu enojo, pero no te identifiques con él.',
      'El autocontrol es la victoria más grande sobre el enojo.',
    ];

    const scoreMap = [5, 4, 1, 3, 2];
    const data = frases.map((message, index) => ({
      message,
      mood_score_target: scoreMap[Math.floor(index / 10)],
      created_at: new Date(),
    }));

    await queryInterface.bulkInsert('motivational_quotes', data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.bulkDelete(
      'motivational_quotes',
      {
        mood_score_target: [1, 2, 3, 4, 5], // solo los insertados
      },
      {},
    );
  },
};
