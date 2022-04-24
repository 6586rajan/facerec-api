const handleRegister = (req, res, db, bcrypt) => {
    const {email, password, name} = req.body;
    // encrypt the given password and store it in the database
    if(!email || !password || !name){
       return res.status(400).json('incorrect format or insufficent information');
    }
    let hashedPass = bcrypt.hashSync(password);
    // insert into db a new user with the given details
    // you create a transaction when you have to do more than one action in a database
    db.transaction(trx => {
        // Use the Trx object to perfom the operations sequentially
        // first we insert into login table with hashedpass and email
        // we then return the email to use in the second step.
        trx.insert({
            hash: hashedPass,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            // use the return object and the trx object to perform the second step
            // insert into user with user details and return * from that user.
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        // the transaction is not complete until it it committed to the Db.
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('email is not valid or already exists, please try again'))

    // respond with the user details
    // res.json(database.users[database.users.length-1]);
}

module.exports = {
    handleRegister: handleRegister
}