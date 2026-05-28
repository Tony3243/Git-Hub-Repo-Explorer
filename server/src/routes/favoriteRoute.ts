import express from 'express'
import type { IRouter } from 'express'
import {allFavorites, addFavorite, deleteFavorite} from '../controllers/favoriteController'
import {tokenCheck} from '../middleware/authMiddleware'

export const favoriteRoute: IRouter = express.Router();

favoriteRoute.get('/favorites', tokenCheck, allFavorites)
favoriteRoute.post('/favorites', tokenCheck, addFavorite)
favoriteRoute.delete('/favorites/:id', tokenCheck, deleteFavorite)