import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_ueX6nZjw5GbW@ep-orange-tree-aqjbei2j.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
});

const initDB = async () => {
  try {
    await pool.query(
      `
      CREATE TABLE IF NOT EXISTS users(
      id  SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(20) NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      
      created_at TIMESTAMP DEFAULT NOW(),
      update TIMESTAMP DEFAULT NOW()

      )
      `,
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

initDB();
app.get("/", (req: Request, res: Response) => {
  // res.send("Hello World!");
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

app.post("/", async (req: Request, res: Response) => {
  // console.log("req", typeof req.body);
  const { name, email, password } = req.body;
  res.status(201).json({
    message: "Created",
    data: {
      name,
      email,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
