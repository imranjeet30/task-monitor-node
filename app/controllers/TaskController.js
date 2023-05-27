//Includes Specific Libraries
var express = require('express');

//Includes dependency file
const schema = require('../db');

//Initializes App and Router
const router = express.Router();

//Includes Model
var  Task = require('../models/Task');
var User = require('../models/User');

/**
 * New Task
 */
router.post('/', function (req, res) {

    return Task.create({
        user_id: req.body.user_id,
        project_id: req.body.project_id,
        category_id: req.body.category_id,
        title: req.body.title,
        completion_date: req.body.completion_date,
    })
        .then((task) => res.status(201).send(task))
        .catch((error) => res.status(400).send(error));
});

/**
 * Task Summary
 */
router.get('/', function (req, res) {
    let total_records;
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);
    var where = "";
    var order = "";

    if (req.query.title)
    {
        where += " tasks.title LIKE '%"+ req.query.title + "%'";
    }

    if (req.query.user_id) 
    {
        where += (where) ? " AND" : "";
        where += " tasks.user_id = "+ req.query.user_id;
    }

    if (req.query.project_id) 
    {
        where += (where) ? " AND" : "";
        where += " tasks.project_id = "+ req.query.project_id;
    }

    if (req.query.category_id)
    {
        where += (where) ? " AND" : "";
        where += " tasks.category_id = "+ req.query.category_id;
    }

    if (req.query.from_date)
    {
        where += (where) ? " AND" : "";
        where += " tasks.completion_date >= '"+ req.query.from_date + "'";
    }

    if (req.query.to_date)
    {
        where += (where) ? " AND" : "";
        where += " tasks.completion_date <= '"+ req.query.to_date + "'";
    }
    
    var sql="SELECT tasks.id , CONCAT(firstname, ' ', lastname) as fullName, projects.name as Project,";
        sql+="tasks.category_id, tasks.title,tasks.completion_date " ;
        sql+="FROM tasks INNER JOIN users ON tasks.user_id= users.id INNER JOIN projects ON tasks.project_id= projects.id";

    if(where)
    {
        sql += ' WHERE ' + where;
    }

    if(req.query.limit)
    {
        sql += ' LIMIT ' +  req.query.limit;
    }

    if(req.query.offset)
    {
        sql += ' OFFSET ' +  req.query.offset + ';';
    }

    //Count total no of records for pagination
    var sql_count = "SELECT COUNT(*) as total_records from tasks INNER JOIN users ON tasks.user_id= users.id INNER JOIN projects ON tasks.project_id= projects.id";
    if(where)
    {
        sql_count += ' WHERE ' + where;
    }
    schema.query(sql_count, { type: schema.QueryTypes.SELECT})
    .then(total =>
    {
        this.total_records = total[0].total_records;
    })
    .catch( error =>
    {
        res.status(400).send(error)
    });

    schema.query(sql, { type: schema.QueryTypes.SELECT})
         .then(tasks => {
            tasks = {'status': 1, 'total_records': this.total_records, 'data': tasks};
            res.status(200).send(tasks); 
         })
         .catch(error=>{
            res.status(400).send(error)
         })
    
});
    
    /**
     * Task View
     */
    router.get('/:id', function (req, res) {
        Task.findById(req.params.id, { attributes: ['id', 'user_id', 'project_id', 'category_id', 'title', 'completion_date', 'is_active'] },).
        then((tasks) => res.status(200).send(tasks))
        .catch((error) => res.status(400).send(error));
    });

    /**
     * Delete Task
     */
    router.delete('/:id', function (req, res) {

        Task.destroy({ where: { id: req.params.id } })
            .then(() => { res.status(200).send({ message: "Task deleted successfully" }) })
            .catch((error) => res.status(400).send(error));

    });

    /**
     * Update Task
     */
    router.put('/:id', function (req, res) {
        Task.update({
            user_id: req.body.user_id,
            title: req.body.title,
            category_id:req.body.category_id,
            completion_date: req.body.completion_date
        },
            { where: { id: req.params.id } })
            .then(() => res.status(200).send({ message: 'Updated successfully!' }))
            .catch((error) => res.status(400).send(error));

    });

    module.exports = router;