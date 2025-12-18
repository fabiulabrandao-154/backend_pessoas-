import express from 'express';
import CursoDAO from '../dao/CursoDAO.js';

const router = express.Router();
const dao = CursoDAO;

router.get('/', async (req, res) => {
  try {
    res.json(await dao.listar(req.query));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const curso = await dao.buscarPorId(req.params.id);
    if (!curso) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    res.json(curso);
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
    res.json({ mensagem: 'Curso removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
