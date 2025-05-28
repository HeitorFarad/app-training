import exercisesJson from '../data/exercises.json';

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 🔁 Nova função: divisão personalizada por dias
function obterDivisaoPersonalizada(dias) {
  const divisao = {
    1: [{ "Corpo inteiro": 3, "Core": 2, "Cardio": 2 }],
    2: [
      { "Peitoral": 3, "Quadríceps": 2, "Glúteos": 1 },
      { "Costas": 3, "Posterior de Coxa": 2, "Core": 2 }
    ],
    3: [
      { "Peitoral": 3, "Tríceps": 2, "Ombros": 2 },
      { "Costas": 3, "Bíceps": 2, "Core": 2 },
      { "Quadríceps": 3, "Posterior de Coxa": 2, "Glúteos": 2 }
    ],
    4: [
      { "Peitoral": 3, "Ombros": 2 },
      { "Costas": 3, "Core": 2 },
      { "Quadríceps": 3, "Posterior de Coxa": 2 },
      { "Bíceps": 2, "Tríceps": 2, "Glúteos": 2 }
    ],
    5: [
      { "Peitoral": 3, "Ombros": 2 },
      { "Costas": 3, "Core": 2 },
      { "Quadríceps": 3, "Glúteos": 2 },
      { "Posterior de Coxa": 2, "Bíceps": 2 },
      { "Tríceps": 2, "Cardio": 2 }
    ],
    6: [
      { "Peitoral": 3, "Tríceps": 2 },
      { "Costas": 3, "Bíceps": 2 },
      { "Quadríceps": 3, "Glúteos": 2 },
      { "Ombros": 2, "Core": 2 },
      { "Posterior de Coxa": 2, "Cardio": 2 },
      { "Corpo inteiro": 2 }
    ],
    7: [
      { "Peitoral": 3 },
      { "Costas": 3 },
      { "Quadríceps": 3 },
      { "Bíceps": 2, "Tríceps": 2 },
      { "Glúteos": 2, "Core": 2 },
      { "Posterior de Coxa": 2, "Ombros": 2 },
      { "Cardio": 3 }
    ]
  };
  return divisao[dias] || divisao[3]; // fallback para 3 dias
}

export function gerarPlano(anamnese) {
  const {
    local,
    lesao,
    regiaoLesao,
    frequencia
  } = anamnese;

  const dias = parseInt(frequencia);
  const divisao = obterDivisaoPersonalizada(dias);

  const plano = [];

  for (let i = 0; i < divisao.length; i++) {
    const diaNome = `Dia ${i + 1}`;
    const grupos = divisao[i];
    const exerciciosDoDia = [];

    for (const [grupo, qtd] of Object.entries(grupos)) {
      let lista = exercisesJson.filter(
        (ex) =>
          ex.grupo_muscular === grupo &&
          ex.local === local &&
          (!lesao || ex.grupo_muscular !== regiaoLesao) &&
          !ex.reabilitacao
      );

      lista = embaralhar(lista).slice(0, qtd);
      exerciciosDoDia.push(...lista);

      if (lesao === 'sim' && grupo === regiaoLesao) {
        const reab = exercisesJson.find(
          (ex) => ex.grupo_muscular === grupo && ex.reabilitacao
        );
        if (reab) {
          exerciciosDoDia.unshift(reab);
        }
      }
    }

    if (exerciciosDoDia.length > 0) {
      plano.push({
        dia: diaNome,
        exercicios: exerciciosDoDia
      });
    }
  }

  return plano;
}
