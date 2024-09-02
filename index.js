const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
var crypto = require("crypto");
var cors = require("cors");

const app = express();

const connection = mongoose.connect("mongodb://127.0.0.1:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to db"));
app.use(
  cors({
    headers: ["Content-Type"],
  })
);
app.use(express.json());

app.listen(27017, () => console.log("server started"));

///sacar esto de aca arriba, se va hacia un json, con una extension rara. .bin por ejemplo
/// array de objetos y cada objeto un paso en la historias
let story = [
  {
    step: 0,
    content:
      '<b>Capítulo 1</b> <br> El zumbido constante del avión era lo único que se interponía entre Alex Hunter y el mar de dudas que le carcomía. Experto en nuevas tecnologías, sí, pero ¿aceptar una invitación a un proyecto ultrasecreto en el desierto de Gobi? <img src="https://i.imgur.com/Goigj2R.jpeg" /> Sentía que había cruzado una línea invisible, la que separaba su cómoda vida en Florida de un thriller de espionaje.<br><br>La invitación había llegado sin previo aviso el 17 de Octubre, 2025 a las 7:30 PM, el correo electrónico lacónico, su remitente: Laura Chen, de una empresa de la que nunca había oído hablar: "Proyecto Nomad". Le ofrecían una cantidad exorbitante por sus servicios como programador, con la única condición de mantener una absoluta confidencialidad. Alex, acostumbrado a las luces de los escenarios y a los aplausos tras sus conferencias sobre pensamiento lateral, aún no sabía si lo que lo había convencido tan rápido era el dinero, o el ego de ser elegido para algo tan exclusivo.<br><br>El “Three Camel Lodge” no era lo que esperaba. Imaginaba un hotel tosco, perdido en la inmensidad del desierto. En cambio, justo una semana después de aquél email, se encontró con un oasis de lujo, una mezcla de arquitectura tradicional mongola y comodidades modernas. Alrededor, las dunas de arena se extendían como un océano infinito, cambiando de color con la luz del sol.<br><br>El aire seco y frío le golpeó el rostro al bajar del Land Cruiser 4x4 que lo había recogido en el pequeño aeropuerto y conducido por más de una hora entre médanos y arena. Una mezcla de excitación y aprehensión le recorrió la espina dorsal. ¿En qué lío se había metido?<br><br>Mientras Chen, una mujer menuda y eficiente, le daba la bienvenida y le mostraba su yurta, Alex no pudo evitar sentir una punzada de inquietud. El silencio del desierto era absoluto, roto solo por el silbido del viento que comenzaba a soplar con fuerza. Algo no encajaba, como una nota discordante en una melodía perfecta.<br><br>"No se preocupe, señor Hunter", le dijo Laura con una sonrisa amable. "Aquí estará a salvo de la tormenta de arena que se avecina. Dicen que será la mayor en décadas, pero las habitaciones de este hotel están preparadas para resistir cualquier embate de la naturaleza.".<br> Alex asintió, forzando una sonrisa. Tormenta de arena, proyecto secreto, un hotel en medio de la nada... Definitivamente, había entrado en un territorio desconocido. Y presentía que lo que le esperaba era mucho más grande que él.',
    question_title:
      'tirame una respuesta, o dos, tambien me sirve...<a href="https://www.w3schools.com/html/html_links.asp">link text</a> ',
    right_answer: ["hola", "hi", "30/01/2025"],
  },
  {
    step: 1,
    content:
      "<b>Capítulo 2</b> <br> bla bla bla  bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla bla",
    question_title:
      'segunda respuesta .<a href="https://www.w3schools.com/html/html_links.asp"> pls',
    right_answer: ["eeea", "sss", "hello"],
  },
  {
    step: 1,
    content: "bla bla bla",
    question_title: "no sigas porque me voy de rango",
    right_answer: ["andate", "vete", "hello"],
  },
];
const userSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
    },
    perficientEmail: {
      type: String,
      required: true,
    },
    step: {
      type: String,
      required: true,
    },
  },
  { collection: "Users" }
);

const userMode = mongoose.model("Users", userSchema);

app.post("/login", async (req, res) => {
  //para el endpoint login desde el front viene el hash y el useremail,
  // hago query para ver si ya hay user con ese hash en la database, si no hay, inserto hash, perficientemail y step = 0, para arrancar el juego
  // en cualquiera de los dos casos tengo el current step, agarro el texto que viene desde un array, desde 0 hasta el current step,
  // si vas avanzado en el game te trae todo el texto, si no te trae solo el 0,
  // el front recibe el chorrete de texto
  let hash = req.body.hash;
  let userEmail = req.body.perficientEmail;
  let index = req.body.index;
  console.log("--->", hash, " ", userEmail, " ", index);

  try {
    var finalHash = crypto.createHash("md5").update(hash).digest("hex");
    console.log(finalHash); //
    let userData = await userMode.findOne({ hash: finalHash });

    if (userData == null) {
      userData = await userMode.create({
        hash: finalHash,
        perficientEmail: userEmail,
        step: "0",
      });
    } else {
      //ya tengo el hash, no hago nada
    }

    let wholeHistoryToSend = [];
    console.log("userData.step", userData.step);
    for (let i = 0; i <= userData.step; i++) {
      wholeHistoryToSend.push(story[i].content);
    }

    res.status(200);
    res.json({
      story: wholeHistoryToSend,
      currentQuestion: story[+userData.step].question_title,
    });
  } catch (err) {
    console.error("Error fetching DATA:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/answer", async (req, res) => {
  //endpoint que se llama cuando se da click en send answer en el front
  // me llega el hash del que esta jugando, si la respuesta de la persona corresponde con la respuesta del current step, avanzo un step y updateo el mismo en la base de datos, con el hash de la persona que esta jugando
  //, devuevo un 200 y el siguiente texto que corresponde en el array
  // si la respuesta es incorrecta de momento solo devuelvo un 201, de lo demas se encarga el front
  try {
    var finalHash = crypto
      .createHash("md5")
      .update(req.body.hash)
      .digest("hex");
    console.log(finalHash);
    const userData = await userMode.findOne({ hash: finalHash });

    console.log("req userdata step --->", story[userData.step]);
    console.log(
      req.body.answer,
      "req userdata step --->",
      story[userData.step].right_answer.includes(req.body.answer)
    );
    if (story[userData.step].right_answer.includes(req.body.answer)) {
      console.log("respuesta correcta, ", userData.step);
      //avanzar el step en respuesta y en base de datos updatear registro de usuario

      let nuevoStep = +userData.step + 1;
      const updatedUser = await userMode.findOneAndUpdate(
        {
          hash: finalHash,
        },
        { step: nuevoStep },
        { new: true }
      );

      console.log("updated user step to: ", updatedUser);
      res.status(200).json({
        newText: story[nuevoStep].content,
        newQuestion: story[nuevoStep].question_title,
      });
    } else {
      res.status(201).json("respuesta incorrecta");
    }
  } catch (err) {
    console.error("Error fetching DATA:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
