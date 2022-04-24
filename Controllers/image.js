const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '773cbdff1bb64f79999f263c8fb400ee'
});

const handleImage = (req, res, db) => {
    const { id } = req.body;
    // find the user based on Id and increment their entries parameter
    db('users').where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(500).json('Unkown Error with updating entries. check API/DB'))
}

// we submit the url through our api 
const handleImageUrl = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('no response from API'))
}

module.exports = {
    handleImage: handleImage,
    handleImageUrl: handleImageUrl
}