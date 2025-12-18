import express from 'express';
import InscricaoDAO from '../dao/InscricaoDAO.js';

const router = express.Router();
const dao = InscricaoDAO;

router.get('/', async (req, res) => {
  try {
    res.json(await dao.listar(req.query));
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get('/relatorio', async (req, res) => {
  try {
    res.json(await dao.gerarRelatorio());
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const inscricao = await dao.buscarPorId(req.params.id);
    if (!inscricao) {
      return res.status(404).json({ erro: 'Inscrição não encontrada' });
    }
    res.json(inscricao);
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

router.delete('/:id', async (req, res) => {
  try {
    await dao.excluir(req.params.id);
    res.json({ mensagem: 'Inscrição removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
