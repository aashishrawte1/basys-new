import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';
const app = express();
const port = 3000;

app.use(bodyParser.json());

const DB_PATH = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_PATH);

db.run(`CREATE TABLE IF NOT EXISTS trades (
  id INTEGER PRIMARY KEY,
  type TEXT,
  user_id INTEGER,
  symbol TEXT,
  shares INTEGER,
  price REAL,
  timestamp INTEGER
)`, function(err) {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table "trades" created successfully');
  }
});


app.post('/trades', (req: Request, res: Response) => {
  const data = req.body;
  console.log("payload=>", data);
  db.run(`INSERT INTO trades (type, user_id, symbol, shares, price, timestamp) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [data.type, data.user_id, data.symbol, data.shares, data.price, data.timestamp],
          function(err) {
            if (err) {
              return res.status(500).send(err.message);
            }
            const trade = { id: this.lastID, ...data };
            res.status(201).json(trade);
          });
})

app.get('/trades', (req: Request, res: Response) => {
  let query = 'SELECT * FROM trades';
  const typeParam = req.query.type as string;
  if (typeParam) {
    query += ` WHERE type = '${typeParam}'`;
  }

  const userIdParam = req.query.user_id as string;
  if (userIdParam) {
    query += `${typeParam ? ' AND' : ' WHERE'} user_id = ${parseInt(userIdParam)}`;
  }

  db.all(query, (err, trades) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(trades);
  });
});

app.get('/trades/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  db.get('SELECT * FROM trades WHERE id = ?', [id], (err, trade) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (trade) {
      res.json(trade);
    } else {
      res.status(404).send('ID not found');
    }
  });
});

app.delete('/trades/:id', (req: Request, res: Response) => {
  res.status(405).send('Method Not Allowed');
});

app.put('/trades/:id', (req: Request, res: Response) => {
  res.status(405).send('Method Not Allowed');
});

app.patch('/trades/:id', (req: Request, res: Response) => {
  res.status(405).send('Method Not Allowed');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
