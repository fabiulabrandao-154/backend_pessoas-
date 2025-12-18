import Curso from '../models/Curso.js';

class CursoDAO {
  async listar(filtros = {}) {
    try {
      let query = {};

      if (filtros.titulo) {
        query.titulo = { $regex: filtros.titulo, $options: 'i' };
      }

      if (filtros.instrutor_id) {
        query.instrutor = filtros.instrutor_id;
      }

      return await Curso.find(query)
        .populate({
          path: 'instrutor',
          select: 'nome email cpf especialidades'
        })
        .sort({ titulo: 1 });
    } catch (error) {
      throw new Error(`Erro ao listar cursos: ${error.message}`);
    }
  }

  async buscarPorId(id) {
    try {
      return await Curso.findById(id)
        .populate({
          path: 'instrutor',
          select: 'nome email cpf especialidades'
        });
    } catch (error) {
      throw new Error(`Erro ao buscar curso: ${error.message}`);
    }
  }

  async salvar(dados) {
    try {
      const curso = new Curso({
        titulo: dados.titulo,
        descricao: dados.descricao,
        carga_horaria: dados.carga_horaria,
        instrutor: dados.instrutor_id
      });

      const cursoSalvo = await curso.save();
      return await this.buscarPorId(cursoSalvo._id);
    } catch (error) {
      throw new Error(`Erro ao salvar curso: ${error.message}`);
    }
  }

  async atualizar(id, dados) {
    try {
      const curso = await Curso.findById(id);
      if (!curso) {
        throw new Error('Curso não encontrado');
      }

      curso.titulo = dados.titulo;
      curso.descricao = dados.descricao;
      curso.carga_horaria = dados.carga_horaria;
      curso.instrutor = dados.instrutor_id;

      await curso.save();
      return await this.buscarPorId(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar curso: ${error.message}`);
    }
  }

  async excluir(id) {
    try {
      const curso = await Curso.findById(id);
      if (!curso) {
        throw new Error('Curso não encontrado');
      }

      await Curso.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Erro ao excluir curso: ${error.message}`);
    }
  }
}

export default new CursoDAO();