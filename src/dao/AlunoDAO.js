import Aluno from "../models/Aluno.js";
import Endereco from "../models/Endereco.js";
import Telefone from "../models/Telefone.js";

class AlunoDAO {
  gerarMatricula() {
    const ano = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${ano}${numero}`;
  }

  async listar(filtros = {}) {
    try {
      let query = {};

      if (filtros.nome) {
        query.nome = { $regex: filtros.nome, $options: 'i' };
      }

      return await Aluno.find(query)
        .populate('endereco')
        .populate('telefones')
        .sort({ nome: 1 });
    } catch (error) {
      throw new Error(`Erro ao listar alunos: ${error.message}`);
    }
  }

  async buscarPorId(id) {
    try {
      return await Aluno.findById(id)
        .populate('endereco')
        .populate('telefones');
    } catch (error) {
      throw new Error(`Erro ao buscar aluno: ${error.message}`);
    }
  }

  async salvar(dados) {
    try {
      let enderecoId = null;
      if (dados.endereco) {
        const endereco = new Endereco(dados.endereco);
        const enderecoSalvo = await endereco.save();
        enderecoId = enderecoSalvo._id;
      }

      let telefonesIds = [];
      if (dados.telefones && dados.telefones.length > 0) {
        for (const tel of dados.telefones) {
          const telefone = new Telefone(tel);
          const telefoneSalvo = await telefone.save();
          telefonesIds.push(telefoneSalvo._id);
        }
      }

      const aluno = new Aluno({
        nome: dados.nome,
        email: dados.email,
        cpf: dados.cpf,
        data_nascimento: dados.data_nascimento,
        matricula: this.gerarMatricula(),
        endereco: enderecoId,
        telefones: telefonesIds
      });

      const alunoSalvo = await aluno.save();
      return await this.buscarPorId(alunoSalvo._id);
    } catch (error) {
      throw new Error(`Erro ao salvar aluno: ${error.message}`);
    }
  }

  async atualizar(id, dados) {
    try {
      const aluno = await Aluno.findById(id);
      if (!aluno) {
        throw new Error('Aluno não encontrado');
      }

      if (dados.endereco) {
        if (aluno.endereco) {
          await Endereco.findByIdAndUpdate(aluno.endereco, dados.endereco);
        } else {
          const endereco = new Endereco(dados.endereco);
          const enderecoSalvo = await endereco.save();
          aluno.endereco = enderecoSalvo._id;
        }
      }

      if (dados.telefones && dados.telefones.length > 0) {
        if (aluno.telefones && aluno.telefones.length > 0) {
          await Telefone.deleteMany({ _id: { $in: aluno.telefones } });
        }

        let telefonesIds = [];
        for (const tel of dados.telefones) {
          const telefone = new Telefone(tel);
          const telefoneSalvo = await telefone.save();
          telefonesIds.push(telefoneSalvo._id);
        }
        aluno.telefones = telefonesIds;
      }

      aluno.nome = dados.nome;
      aluno.email = dados.email;
      aluno.cpf = dados.cpf;
      aluno.data_nascimento = dados.data_nascimento;

      await aluno.save();
      return await this.buscarPorId(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar aluno: ${error.message}`);
    }
  }

  async excluir(id) {
    try {
      const aluno = await Aluno.findById(id);
      if (!aluno) {
        throw new Error('Aluno não encontrado');
      }

      if (aluno.endereco) {
        await Endereco.findByIdAndDelete(aluno.endereco);
      }

      if (aluno.telefones && aluno.telefones.length > 0) {
        await Telefone.deleteMany({ _id: { $in: aluno.telefones } });
      }

      await Aluno.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Erro ao excluir aluno: ${error.message}`);
    }
  }
}

export default new AlunoDAO();