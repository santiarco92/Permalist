import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "misprimos92",
  port: 5432,
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  // { id: 1, title: "Buy milk" },
  // { id: 2, title: "Finish homework" },
];

db.connect()
.then(() => console.log('Conectado a la base de datos'))
.catch(err => console.error('Error al conectar a la base de datos', err.stack));
  
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({title: item});
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//UPDATE items SET title = req
app.post("/edit", async (req, res) => {

  const id = req.body.updatedItemId;
  const edit = req.body.updatedItemTitle;

  console.log( "este es id: " + id);
  console.log("este es edit: " + edit);
  try {
    const result = db.query(`UPDATE items SET title = ($1) WHERE id=$2`,[edit, id]);
    res.redirect("/");
  }catch (err) {
    console.log(err);
  }

});



app.post("/delete", async (req, res) => {

  const idDelete = req.body.deleteItemId;

  console.log( "this is the id to be deleted: " + idDelete);

  try {
    const result = db.query("DELETE FROM items WHERE id = $1", [idDelete]);
    res.redirect("/");
  }catch (err) {
    console.log(err);
  }

});





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
