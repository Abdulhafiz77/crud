const { Router } = require('express')
const pool = require('../config/db')
const router = Router()


//get employers
router.get('/', async (req, res) => {
try {
    const employers = await pool.query("SELECT * FROM employer");
    res.status(200).json(employers.rows)
} catch (error) {
    res.status(500).json({message: error.message})
}
})

//get by id 
router.get('/:id', async (req, res) => {
    try {
        const employer = await pool.query(`SELECT 
        employer.name, employer.salary, employer.degree, job.title 
        FROM employer LEFT JOIN job ON job.id = employer.job_id 
        WHERE employer.id = $1`, [req.params.id])
        res.status(200).json(employer.rows[0])
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//create employer
router.post('/add', async (req, res) => {
    try {
        const {name, salary, degree, job_id} = req.body
        const newEmployer = await pool.query("INSERT INTO employer (name, salary, degree, job_id) VALUES ($1, $2, $3, $4) ", 
        [name, salary, degree, job_id])
      res.status(201).json(newEmployer.rows)  
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//update employer
router.put('/:id', async (req, res) => {
    try {
        const {name, salary, degree, job_id} = req.body
        const { id } = req.params

        const oldEmployer = await pool.query('SELECT * FROM employer WHERE id = $1', [id])

        const updateEmployer = await pool.query(
            'UPDATE employer SET name = $1, salary = $2, degree = $3, job_id = $4 WHERE id = $5 RETURNING *', 
        [name ? name : oldEmployer.rows[0].name,
         salary ? salary : oldEmployer.rows[0].salary,
          degree ? degree : oldEmployer.rows[0].degree,
           job_id ? job_id : oldEmployer.rows[0].job_id,
            id
        ])
      res.status(201).json(updateEmployer.rows[0])  
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//delete employers
router.delete('/:id', async (req, res) => {
    try {
        await pool.query("DELETE FROM employer WHERE id = $1", [req.params.id]);
        res.status(200).json({message: "Employer delete succesfull"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    })
    


module.exports = router