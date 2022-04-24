const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json('incorrect format or insufficent information');
    }
    db.select('email', 'hash').from('login')
    .where('email', email)
    .then(data => {
        let passCheck = bcrypt.compareSync(password, data[0].hash);
        if (passCheck) {
            return db.select('*').from('users')
            .where('email', email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('cannot get user'));         
         }
         else{
            return res.status(401).json('Sign in Failed');
        }
    })
    .catch(err => res.status(401).json('Sign in Failed'));

}

module.exports = {
    handleSignin : handleSignin
}