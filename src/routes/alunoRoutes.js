import express from 'express';
import AlunoDAO from '../dao/AlunoDAO.js';

const router = express.Router();
const dao = AlunoDAO;

router.get('/', async (req, res) => {
  try {
    res.json(await dao.listar(req.query));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const aluno = await dao.buscarPorId(req.params.id);
    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await dao.salvar(req.body));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    res.json(await dao.atualizar(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await dao.excluir(req.params.id);
    res.json({ mensagem: 'Aluno removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
