import Inscricao from '../models/Inscricao.js';

class InscricaoDAO {
  async listar(filtros = {}) {
    try {
      let query = {};

      if (filtros.aluno_id) {
        query.aluno = filtros.aluno_id;
      }

      if (filtros.curso_id) {
        query.curso = filtros.curso_id;
      }

      return await Inscricao.find(query)
        .populate({
          path: 'aluno',
          select: 'nome email matricula'
        })
        .populate({
          path: 'curso',
          select: 'titulo carga_horaria',
          populate: {
            path: 'instrutor',
            select: 'nome email'
          }
        })
        .sort({ data_inscricao: -1 });
    } catch (error) {
      throw new Error(`Erro ao listar inscrições: ${error.message}`);
    }
  }

  async buscarPorId(id) {
    try {
      return await Inscricao.findById(id)
        .populate({
          path: 'aluno',
          select: 'nome email matricula'
        })
        .populate({
          path: 'curso',
          select: 'titulo carga_horaria',
          populate: {
            path: 'instrutor',
            select: 'nome email'
          }
        });
    } catch (error) {
      throw new Error(`Erro ao buscar inscrição: ${error.message}`);
    }
  }

  async salvar(dados) {
    try {
      const inscricaoExistente = await Inscricao.findOne({
        aluno: dados.aluno_id,
        curso: dados.curso_id
      });

      if (inscricaoExistente) {
        throw new Error('Aluno já inscrito neste curso!');
      }

      const inscricao = new Inscricao({
        aluno: dados.aluno_id,
        curso: dados.curso_id
      });

      const inscricaoSalva = await inscricao.save();
      return await this.buscarPorId(inscricaoSalva._id);
    } catch (error) {
      throw new Error(`Erro ao salvar inscrição: ${error.message}`);
    }
  }

  async excluir(id) {
    try {
      const inscricao = await Inscricao.findById(id);
      if (!inscricao) {
        throw new Error('Inscrição não encontrada');
      }

      await Inscricao.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Erro ao excluir inscrição: ${error.message}`);
    }
  }

  async gerarRelatorio() {
    try {
      const inscricoes = await Inscricao.find()
        .populate({
          path: 'aluno',
          select: 'nome matricula'
        })
        .populate({
          path: 'curso',
          select: 'titulo',
          populate: {
            path: 'instrutor',
            select: 'nome'
          }
        });

      const relatorioPorCurso = {};

      inscricoes.forEach(inscricao => {
        if (!inscricao.curso) return;

        const cursoId = inscricao.curso._id.toString();
        const cursoTitulo = inscricao.curso.titulo;
        const instrutorNome = inscricao.curso.instrutor?.nome || 'Sem instrutor';

        if (!relatorioPorCurso[cursoId]) {
          relatorioPorCurso[cursoId] = {
            curso_id: cursoId,
            curso_titulo: cursoTitulo,
            instrutor_nome: instrutorNome,
            total_inscricoes: 0,
            alunos: []
          };
        }

        relatorioPorCurso[cursoId].total_inscricoes++;
        if (inscricao.aluno) {
          relatorioPorCurso[cursoId].alunos.push({
            nome: inscricao.aluno.nome,
            matricula: inscricao.aluno.matricula,
            data_inscricao: inscricao.data_inscricao
          });
        }
      });

      return Object.values(relatorioPorCurso).sort((a, b) =>
        b.total_inscricoes - a.total_inscricoes
      );
    } catch (error) {
      throw new Error(`Erro ao gerar relatório: ${error.message}`);
    }
  }
}

export default new InscricaoDAO();