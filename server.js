const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/whatsappChats', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const chatSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

app.post('/api/chats', async (req, res) => {
    const { phoneNumber, message } = req.body;
    const chat = new Chat({ phoneNumber, message });

    try {
        await chat.save();
        res.status(201).send(chat);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/api/chats', async (req, res) => {
    try {
        const chats = await Chat.find();
        res.status(200).send(chats);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
