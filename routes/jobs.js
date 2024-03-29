const { Router } = require('express')
const pool = require('../config/db')
const router = Router()


//get
router.get('/', async (req, res) => {
try {
    const jobs = await pool.query("SELECT * FROM job");
    res.status(200).json(jobs.rows)
} catch (error) {
    res.status(500).json({message: error.message})
}
})


//create
router.post('/add', async (req, res) => {
    try {
        const newJob = await pool.query("INSERT INTO job (title) VALUES ($1) ", 
        [req.body.title])
      res.status(201).json(newJob.rows)  
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//delete job
router.delete('/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM employer WHERE job_id = $1` [req.params.id])
        await pool.query(`DELETE FROM job WHERE id = $1` [req.params.id])
    res.status(200).json({message: "Job delete"})    
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


module.exports = router