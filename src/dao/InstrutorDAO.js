import Instrutor from '../models/Instrutor.js';
import Endereco from '../models/Endereco.js';
import Telefone from '../models/Telefone.js';

class InstrutorDAO {
  async listar(filtros = {}) {
    try {
      let query = {};

      if (filtros.nome) {
        query.nome = { $regex: filtros.nome, $options: 'i' };
      }

      return await Instrutor.find(query)
        .populate('endereco')
        .populate('telefones')
        .sort({ nome: 1 });
    } catch (error) {
      throw new Error(`Erro ao listar instrutores: ${error.message}`);
    }
  }

  async buscarPorId(id) {
    try {
      return await Instrutor.findById(id)
        .populate('endereco')
        .populate('telefones');
    } catch (error) {
      throw new Error(`Erro ao buscar instrutor: ${error.message}`);
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

      const instrutor = new Instrutor({
        nome: dados.nome,
        email: dados.email,
        cpf: dados.cpf,
        data_nascimento: dados.data_nascimento,
        especialidades: dados.especialidades || [],
        endereco: enderecoId,
        telefones: telefonesIds
      });

      const instrutorSalvo = await instrutor.save();
      return await this.buscarPorId(instrutorSalvo._id);
    } catch (error) {
      throw new Error(`Erro ao salvar instrutor: ${error.message}`);
    }
  }

  async atualizar(id, dados) {
    try {
      const instrutor = await Instrutor.findById(id);
      if (!instrutor) {
        throw new Error('Instrutor não encontrado');
      }

      if (dados.endereco) {
        if (instrutor.endereco) {
          await Endereco.findByIdAndUpdate(instrutor.endereco, dados.endereco);
        } else {
          const endereco = new Endereco(dados.endereco);
          const enderecoSalvo = await endereco.save();
          instrutor.endereco = enderecoSalvo._id;
        }
      }

      if (dados.telefones && dados.telefones.length > 0) {
        if (instrutor.telefones && instrutor.telefones.length > 0) {
          await Telefone.deleteMany({ _id: { $in: instrutor.telefones } });
        }

        let telefonesIds = [];
        for (const tel of dados.telefones) {
          const telefone = new Telefone(tel);
          const telefoneSalvo = await telefone.save();
          telefonesIds.push(telefoneSalvo._id);
        }
        instrutor.telefones = telefonesIds;
      }

      instrutor.nome = dados.nome;
      instrutor.email = dados.email;
      instrutor.cpf = dados.cpf;
      instrutor.data_nascimento = dados.data_nascimento;
      instrutor.especialidades = dados.especialidades || [];

      await instrutor.save();
      return await this.buscarPorId(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar instrutor: ${error.message}`);
    }
  }

  async excluir(id) {
    try {
      const instrutor = await Instrutor.findById(id);
      if (!instrutor) {
        throw new Error('Instrutor não encontrado');
      }

      if (instrutor.endereco) {
        await Endereco.findByIdAndDelete(instrutor.endereco);
      }

      if (instrutor.telefones && instrutor.telefones.length > 0) {
        await Telefone.deleteMany({ _id: { $in: instrutor.telefones } });
      }

      await Instrutor.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Erro ao excluir instrutor: ${error.message}`);
    }
  }
}

export default new InstrutorDAO();