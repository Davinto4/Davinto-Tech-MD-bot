const express = require('express');
const similarity = require('string-similarity');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const knowledge = JSON.parse(fs.readFileSync('./knowledgeBase.json', 'utf8'));
const allPhrases = knowledge.flatMap(item => item.variations);

app.post('/message', (req, res) => {
  const { sender, message } = req.body;
  const msg = message.toLowerCase();

  const match = similarity.findBestMatch(msg, allPhrases).bestMatch;
  let reply = `Sorry, I no understand "${message}". Can you try again?`;

  if (match.rating >= 0.4) {
    const item = knowledge.find(i => i.variations.includes(match.target));
    reply = item.reply;
  }

  console.log(`[DavintoTech MD] ${sender}: "${message}" → ${reply}`);
  res.json({ reply });
});

app.get('/', (_req, res) => res.send('DavintoTech MD is online!'));
app.listen(port, () => console.log(`Bot running on port ${port}`));
