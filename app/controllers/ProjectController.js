//Includes Specific Libraries
var express = require('express');

//Initializes App and Router
const router = express.Router();

//Includes Model
var {Project, Op} = require('../models/Project');

/**
 * New Project
 */
router.post('/', function (req, res) {

    return Project.create({
        team_id: req.body.team_id,
        name: req.body.name,
        url: req.body.url,
        created_by: req.body.created_by,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
        updated_by: req.body.updated_by,
        })
    .then((project) => res.status(201).send({message:"Project has been created successfully"}))
    .catch((error) => res.status(400).send(error));
});

/**
 * Project Summary
 */
router.get('/', function (req, res) {
    let total_records;
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);
    const conditions = {
        name: {
            [Op.like]: '%' + req.query.name + '%'
    }};
    
    Project.count({where: conditions}).then(c => total_records = c);

    Project.findAll(
    {
        where:conditions,
        attributes:['id','name', 'url', 'is_active'],
        order: [
            [req.query.sf, req.query.so],
        ],
        limit:limit, offset: offset
    })
    .then((projects) => 
    {
        projects = {'status':1, 'total_records':total_records,'data':projects}
        res.status(200).send(projects)
    })
    .catch((error) => res.status(400).send(error));
});

/**
 * Project Summary without condition
 */

router.get('/list/full', function (req, res) {
    const conditions = {
        is_active:1,
        }
    Project.findAll(
    {
        where:conditions,
        attributes:['id','name'],
        order: [
            ['id', 'DESC'],
        ],
    })
    .then((projects) => 
    {
        projects = {'status':1, 'data':projects}
        res.status(200).send(projects)
    })
    .catch((error) => res.status(400).send(error));
});

/**
 * Project View
 */
router.get('/:id', function (req, res) {
    Project.findById(req.params.id,{attributes:["id",'name', 'url', 'is_active']})
    .then((projects) => res.status(200).send(projects)).catch((error) => res.status(400).send(error));
});

/**
 * Delete Project
 */
router.delete('/:id', function (req, res) {
    Project.destroy({where:{id:req.params.id}})
        .then(()=>{res.status(200).send({message:"Project deleted successfully"})})
        .catch((error) => res.status(400).send(error));
  
});

/**
 * Update Project
 */
router.put('/:id', function (req, res) {
    Project.update({
        name:req.body.name,
        url: req.body.url,
        completion_date:req.body.completion_date
     },
     {where : {id:req.params.id}})
     .then(() => res.status(200).send({message: 'Updated successfully!'}))
     .catch((error) => res.status(400).send(error));
});

/**
 * Update Status
 */
router.get('/toggle/:id/:status', function (req, res) 
{
    var x = req.params.status == true ? 0 : 1;
       console.log(x);
    Project.update({
        is_active:x  
    },
    {where: {id: req.params.id}})
    .then(() => res.status(200).send({message: 'Status Updated successfully!'}))
    .catch((error) => res.status(400).send(error));
});

module.exports = router;