const handleProfile = (req, res, db) => {
    const { id } = req.params;
    // send a query to the database for the user given id
    db.select('*').from('users').where('id', id)
    .then(user => {
        if (user.length) {
            res.json(user[0]);    
        }
        else {
            res.status(404).json('User not found');
        }
    })
    .catch(err => res.status(500).json('Unkown Error with get profile by ID. check API/DB'))
}

module.exports = {
    handleProfile: handleProfile
}