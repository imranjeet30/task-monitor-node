//Includes Specific Libraries
var express = require('express');

//Includes dependency file
const schema = require('../db');

//Initializes App and Router
const router = express.Router();

//Includes Model
var  Team = require('../models/Team');

/**
 * New Team
 */
router.post('/', function (req, res) {

    return Team.create({
        team_leader_id: req.body.team_leader_id,
        name: req.body.name,
        is_active: req.body.is_active,
        created_by: req.body.created_by,
        created_at: req.body.created_at,
        updated_by: req.body.updated_by,
        updated_by: req.body.updated_by,
    })
        .then((team) => res.status(201).send({message:"Team Created Successfully"}))
        .catch((error) => res.status(400).send(error));
});

/**
 * Team Summary
 */
router.get('/', function (req, res) {
    let total_records;
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);
    
    var sql="SELECT Team.id AS team_id, Team.name as team_name, TeamLeader.firstname AS team_leader, GROUP_CONCAT(Member.firstname) AS team_member FROM team_members AS TeamMember";
        sql+= "    INNER JOIN users AS Member ON TeamMember.user_id = Member.id";
        sql+= "   INNER JOIN teams AS Team ON Team.id = TeamMember.team_id";
        sql+= "  INNER JOIN users AS TeamLeader ON Team.team_leader_id = TeamLeader.id GROUP BY Team.id";

      //Count total no of records for pagination
    var sql_count = "SELECT COUNT(*) as total_records from teams INNER JOIN users ON teams.team_leader_id= users.id ";
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
         .then(teams => {
            teams = {'status': 1, 'total_records': this.total_records, 'data': teams};
            res.status(200).send(teams); 
         })
         .catch(error=>{
            res.status(400).send(error)
         })
    
});
    
    /**
     * Team View
     */
    router.get('/:id', function (req, res) {
        var sql="select teams.name, CONCAT(firstname, ' ', lastname) as Leader,teams.is_active FROM teams"
        sql+= " INNER JOIN users ON teams.team_leader_id = users.id where teams.id=" +req.params.id;
        schema.query(sql, { type: schema.QueryTypes.SELECT})
        .then((teams) => res.status(200).send(teams))
        .catch((error) => res.status(400).send(error));
    });

    /**
     * Delete Team
     */
    router.delete('/:id', function (req, res) {

        Team.destroy({ where: { id: req.params.id } })
            .then(() => { res.status(200).send({ message: "Team deleted successfully" }) })
            .catch((error) => res.status(400).send(error));

    });

    /**
     * Update Team
     */
    router.put('/:id', function (req, res) {
        Team.update({
            team_leader_id: req.body.team_leader_id,
            is_active: req.body.is_active,
        },
            { where: { id: req.params.id } })
            .then(() => res.status(200).send({ message: 'Updated successfully!' }))
            .catch((error) => res.status(400).send(error));

    });

    module.exports = router;