import exercisesJson from '../data/exercises.json';

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Mapeamento de grupos compostos para grupos reais do JSON
const grupoExpandido = {
  'Superior': ['Peitoral', 'Costas', 'Ombros', 'Bíceps', 'Tríceps'],
  'Inferior': ['Quadríceps', 'Posterior de Coxa', 'Glúteos'],
  'Corpo inteiro': ['Peitoral', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Quadríceps', 'Posterior de Coxa', 'Glúteos', 'Core'],
  'Peitoral/Ombros/Tríceps': ['Peitoral', 'Ombros', 'Tríceps'],
  'Costas/Bíceps': ['Costas', 'Bíceps'],
  'Pernas/Posterior': ['Quadríceps', 'Posterior de Coxa'],
  'Core/Cardio': ['Core', 'Cardio']
};

// 🧠 Define divisão por dia com base na frequência semanal
function obterDivisaoPersonalizada(dias) {
  if (dias <= 2) return Array(dias).fill({ 'Corpo inteiro': 4 });

  if (dias === 3) return [
    { 'Peitoral/Ombros/Tríceps': 3, 'Costas/Bíceps': 3 },
    { 'Pernas/Posterior': 4, 'Glúteos': 2, 'Core': 2 },
    { 'Peitoral/Ombros/Tríceps': 2, 'Costas/Bíceps': 2, 'Cardio': 2 }
  ];

  if (dias === 4) return [
    { 'Superior': 4 },
    { 'Inferior': 4 },
    { 'Superior': 4 },
    { 'Inferior': 4 }
  ];

  if (dias >= 5) {
    const split = [
      { 'Peitoral/Ombros/Tríceps': 3 },
      { 'Costas/Bíceps': 3 },
      { 'Quadríceps': 3, 'Glúteos': 2 },
      { 'Posterior de Coxa': 3, 'Core': 2 },
      { 'Cardio': 2 }
    ];
    if (dias > 5) split.push({ 'Corpo inteiro': 3 });
    if (dias > 6) split.push({ 'Core/Cardio': 3 });
    return split.slice(0, dias);
  }

  return obterDivisaoPersonalizada(3);
}

// Retorna os parâmetros do exercício com base no objetivo
function obterParametrosDoExercicio(objetivo) {
  switch ((objetivo || '').toLowerCase()) {
    case 'força':
      return { series: 4, repeticoes: 5, carga: 90, descanso: 180 };
    case 'hipertrofia':
      return { series: 4, repeticoes: 10, carga: 75, descanso: 60 };
    case 'emagrecimento':
    case 'resistência':
      return { series: 3, repeticoes: 15, carga: 60, descanso: 30 };
    case 'potência':
      return { series: 3, repeticoes: 4, carga: 50, descanso: 120 };
    case 'saúde':
    default:
      return { series: 3, repeticoes: 10, carga: 65, descanso: 45 };
  }
}

// 🧠 Função principal: gera plano com parâmetros e divisão
export function gerarPlano(anamnese) {
  const {
    local,
    lesao,
    regiaoLesao,
    frequencia,
    objetivo
  } = anamnese;

  const dias = parseInt(frequencia);
  const divisao = obterDivisaoPersonalizada(dias);
  const parametrosGerais = obterParametrosDoExercicio(objetivo || 'saúde');
  const plano = [];

  for (let i = 0; i < divisao.length; i++) {
    const diaNome = `Dia ${i + 1}`;
    const grupos = divisao[i];
    const exerciciosDoDia = [];

    for (const [grupo, qtd] of Object.entries(grupos)) {
      const gruposAlvo = grupoExpandido[grupo] || [grupo];

      gruposAlvo.forEach((musculo) => {
        let lista = exercisesJson.filter(
          (ex) =>
            ex.grupo_muscular === musculo &&
            ex.local.toLowerCase() === local.toLowerCase() &&
            (!lesao || ex.grupo_muscular !== regiaoLesao) &&
            !ex.reabilitacao
        );

        lista = embaralhar(lista).slice(0, Math.ceil(qtd / gruposAlvo.length));

        lista = lista.map((ex) => ({
          ...ex,
          series: parametrosGerais.series,
          repeticoes: parametrosGerais.repeticoes,
          carga_percentual: parametrosGerais.carga,
          descanso_segundos: parametrosGerais.descanso
        }));

        exerciciosDoDia.push(...lista);

        if (lesao === 'sim' && musculo === regiaoLesao) {
          const reab = exercisesJson.find(
            (ex) =>
              ex.grupo_muscular === musculo &&
              ex.reabilitacao &&
              ex.local.toLowerCase() === local.toLowerCase()
          );
          if (reab) {
            exerciciosDoDia.unshift({
              ...reab,
              series: 2,
              repeticoes: 12,
              carga_percentual: 40,
              descanso_segundos: 60
            });
          }
        }
      });
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
