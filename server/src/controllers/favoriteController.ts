import type {Request, Response, RequestHandler} from 'express'
import type{ Client, ApiResponse, Repos, PayloadId } from '../dataTypes/favorite'
import {supabase} from '../database/supabase'

export const allFavorites: RequestHandler <
{}, //params
ApiResponse<Client[]>,//res.body,
{}//req.body
> = async(req, res) => {
    const userId: string = res.locals.user.id
    if(!userId) {
        console.log("Couldn't find user");
        return res.status(500).json({message: "Could not find user"})
    }
    try {
        const allData = await supabase.query<Client>(`
            SELECT repo_name, repo_url, description, rating 
            FROM favorite_repos 
            WHERE user_id = $1`, [userId]);
        if(!allData.rows) {
            console.log("User doesn not exist");
            return res.status(404).json({message: "User could not be found"})
        }
        res.status(200).json(allData.rows)
    }catch(err) {
        console.log("Error in retrieving Data")
        res.status(500).json({message: "Error in retrieving Data"})
    }
}

export const addFavorite: RequestHandler<{}, ApiResponse<Client[]>>= async(req, res) => {
    const userId = res.locals.user.id
    const {repo_id, repo_name, repo_url, description, rating} = req.body;
    console.log(res.locals.user.id)
    if(!repo_name || !repo_url || !description || !rating) {
        console.log("Missing Fields");
        return res.status(401).json({message: "Mising Fields"})
    }
    try {
        const adding = await supabase.query<Client[]>(`INSERT INTO favorite_repos(user_id, repo_id, repo_name, repo_url, description, rating) 
            VALUES($1, $2, $3, $4, $5, $6) 
            RETURNING repo_name, repo_url, description, rating`, 
            [userId, repo_id, repo_name, repo_url, description, rating]);
        console.log("hi")
        res.status(200).json(adding.rows[0])
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Unable to add favorite"})
    }
}

export const deleteFavorite: RequestHandler<{id:string}, ApiResponse<Client>> = async(req, res) => {
    const repoId: string = req.params.id//repo that is being deleted
    const userId: string = res.locals.user.id//who is deleting it

    if(!repoId) {
        console.log("Repo does not exist");
        return res.status(401).json({message: "Repo does not exist"})
    }

    try {
        const deleting = await supabase.query(`DELETE FROM favorite_repos WHERE repo_id = $1 and user_id = $2`, [repoId, userId]);
        res.status(200).json({
            message: "Successfully deleted repo",
            deleted: deleting.rows[0]
        })
    }catch(err) {
        console.log("unable to delete repo");
        res.status(500).json({message: "unable to delete repo"})
    }
}