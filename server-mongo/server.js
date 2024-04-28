require('dotenv').config()

const dbConnection = require("./connectionDB.js")
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.SERVER_PORT

const userModel = require('./models/user.model')

app.use(cors())
app.use(express.json())

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    dbConnection.connect();
})

app.post("/user", async(req, res) => {
    try {
        const newUser = new userModel(req.body)
        console.log(req.body);
        newUser.save().then((response) => {
            return res.status(201).json({
                message: "New user created",
                result: response,
                success: true
            })
        }).catch((error) => {
            res.status(500).json({
                error: error,
                success: false
            })
        })
    } catch (error) {
        return res.status(500).json({ message: error})
    }
})

app.get("/users", async(req, res) => {
    try {
        userModel.find().then((users) => {
            if (!users) return res.status(404).json({ message: "There are no users"})
            return res.status(200).json(users)
        })
    } catch (error) {
        return res.status(500).json({ message: error})
    }
})

app.delete("/user", async(req, res) => {
    try {
        if (
            !req.password 
            || req.password != process.env.ADMIN_PASSWORD
        ) return res.status(200).json({message: "Permission denied."}) 

        userModel.findByIdAndDelete(req.userId).then((user) => {
            if (!user) return res.status(404).json({ message: "This user does not exist."})
            return res.status(200).json({
                message: "User deleted"
            }) 
        })
    } catch (error) {
        return res.status(500).json({ message: error})
    }
})