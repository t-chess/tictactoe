import express from 'express';
import { createGame, deleteGame, editGame, getGame, getGames } from '../controllers/games';

const router = express.Router();

router.get('/', getGames);
router.get('/:id', getGame);
router.post('/new', createGame);
router.post('/edit', editGame);
router.get('/delete/:id', deleteGame);

export default router;
