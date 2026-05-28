import type {Request, Response, RequestHandler} from 'express'
import type{ Client, ApiResponse, Repos, PayloadId } from '../dataTypes/favorite'
import {supabase} from '../database/supabase'

export const allFavorites: RequestHandler <
{}, //params
ApiResponse<Client[]>,//res.body,
{}//req.body
> = async(req, res) => {
    const userId: string = res.locals.user.id
    try {
        const allData = await supabase.query<Client>(`
            SELECT repo_name, repo_url, description, rating 
            FROM favorite_repos 
            WHERE user_id = $1`, [userId]);
        res.status(200).json(allData.rows)//if user has empty [], means user doesn't have favorites yet, therefore valid status
    }catch(err) {
        console.log("Error in retrieving Data")
        res.status(500).json({message: "Error in retrieving Data"})
    }
}

export const addFavorite: RequestHandler<{}, ApiResponse<Client[]>>= async(req, res) => {
    const userId = res.locals.user.id
    const {repo_id, repo_name, repo_url, description, rating} = req.body;
    if(!repo_id || !repo_name || !repo_url || !description || !rating) {
        console.log("Missing Fields");
        return res.status(400).json({message: "Missing Fields"})
    }
    try {
        const adding = await supabase.query<Client[]>(`INSERT INTO favorite_repos(user_id, repo_id, repo_name, repo_url, description, rating) 
            VALUES($1, $2, $3, $4, $5, $6) 
            RETURNING repo_name, repo_url, description, rating`, 
            [userId, repo_id, repo_name, repo_url, description, rating]);
        if (adding.rows && adding.rows.length > 0) {
            res.status(201).json(adding.rows[0])
        } else {
            res.status(500).json({message: "Insert succeeded but no data returned"})
        }
    } catch(err) {
        res.status(500).json({message: "Unable to add favorite"})
    }
}

export const deleteFavorite: RequestHandler<{id:string}, ApiResponse<Client>> = async(req, res) => {
    const repoId: string = req.params.id//repo that is being deleted
    const userId: string = res.locals.user.id//who is deleting it

    if(!repoId) {
        console.log("Missing repo param in url");
        return res.status(400).json({message: "Repo does not exist"})//400 bad request
    }

    try {
        const deleting = await supabase.query(`DELETE FROM favorite_repos WHERE repo_id = $1 and user_id = $2`, [repoId, userId]);
        if(!deleting.rows || deleting.rows.length === 0) {
            console.log("Favorite not found or already deleted");
            res.status(404).json({message: "Favorite not found or already deleted"})
        }
        res.status(200).json({
            message: "Successfully deleted repo",
            deleted: deleting.rows[0]
        })
    }catch(err) {
        console.log("unable to delete repo");
        res.status(500).json({message: "unable to delete repo"})
    }
}