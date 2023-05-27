//Includes Dependencies
var env = require('../config/env');
const Sequelize = require('sequelize');
//Includes Specific Libraries
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var express = require('express');

//Initializes App and Router
const router = express.Router();

//Includes Model
var {User, Op} = require('../models/User');

/**
 * User Registartion
 */
router.post('/register', function (req, res) 
{
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    return User.create({
        role: req.body.role,
        username: req.body.username,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        created_by: req.body.created_by,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
        updated_by: req.body.updated_by,
    })
    .then((user) => { //SUCCESS
        const token = jwt.sign({ id: user.id, role: user.role }, env.salt, {
            expiresIn: 86400 // expires in 24 hours
        });
        
        user.update({token: token}).then(() => console.log('updated')).catch(() => console.log('unable to update'));

        res.status(200).send({message:'User has been created successfully'}); 
    })
    .catch((error) => res.status(400).send(error)); //ERROR
});

/**
 * Validate Token
 */
router.get('/validate', function (req, res) 
{
    const token = req.headers['token'];
    if (!token) return res.status(400).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, env.salt, function(err, decoded) {
        if (err) return res.status(400).send({ auth: false, message: 'Failed to authenticate token.'});
        res.status(200).send(decoded);
    });
});

/**
 * Login Request
 */
router.post('/login', function (req, res) 
{
    User.findOne({ where: {username: req.body.username} }).then(user => {

        if (!user) return res.status(200).send({status: 0, message: "No user found" });

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) return res.status(200).send({ status: 0, auth: false , message: "Invalid username or password" });

        var token = jwt.sign({ id: user.id, role: user.role, username:user.username, firstname:user.firstname,lastname:user.lastname}, env.salt, {
          expiresIn: 86400 // expires in 24 hours
        });

        user.update({token: token}).then(() => console.log('updated')).catch(() => console.log('unable to update'));

        res.status(200).send({status:1, token:token});
    }).catch((error) => res.status(400).send(error,{status: 0, message: "Invalid Username or Password" }));
});

/**
 * User Summary
 */
router.get('/', function (req, res) 
{
    let total_records;
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);

    const conditions = {
        username: {
            [Op.like]: '%' +  req.query.username + '%'
            }, 
        firstname: {
            [Op.like]: '%' + req.query.name + '%'
    }};
    

    User.count({where: conditions}).then(c => total_records = c);

    User.findAll({
       where: conditions,
        attributes:['id', 'role', 'username', 'firstname', 'lastname','is_active'],
        order: [
            [req.query.sf, req.query.so],
        ],
        limit:limit, offset: offset
    })
    .then((users) => { 
        users = {'status': 1, 'total_records': total_records, 'data': users};
        res.status(200).send(users); 
    })
    .catch((error) => res.status(400).send(error));
});
/**
 * User Summary Without condition
 */
router.get('/list/full', function (req, res) 
{
    
    const conditions = {
        is_active:1,
    }
    
    User.findAll({
        where:conditions,
        attributes: ['id', [Sequelize.fn('Concat', Sequelize.col('firstname')," ", Sequelize.col('lastname')), 'fullName']],
        order: [
            ['id', 'DESC'],
        ],
    })
    .then((users) => { 
        users = {'status': 1, 'data': users};
        res.status(200).send(users); 
    })
    .catch((error) => res.status(400).send(error))
});

/**
 * User View
 */
router.get('/:id', function (req, res) 
{
    User.findById(req.params.id,{attributes:['id', 'role', 'username', 'firstname', 'lastname','is_active']})
    .then((users) => res.status(200).send(users)).catch((error) => res.status(400).send(error));
});

/**
 * Delete User
 */
router.delete('/:id', function (req, res) 
{
    User.destroy( {where: {id: req.params.id}})
        .then(() => res.status(200).send({message: 'Deleted successfully!'}))
        .catch((error) => res.status(400).send(error));
});

/**
 * Update User
 */
router.put('/:id', function (req, res) 
{
    User.update({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        is_active: req.body.is_active
    }, 
    {where: {id: req.params.id}})
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
    User.update({
        is_active:x  
    },
    {where: {id: req.params.id}})
    .then(() => res.status(200).send({message: 'Status Updated successfully!'}))
    .catch((error) => res.status(400).send(error));
});

module.exports = router;