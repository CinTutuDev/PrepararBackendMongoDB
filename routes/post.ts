import { Router, Request, Response } from "express";
import { verificaToken } from "../middlewares/autentication";
import { Post } from "../models/postModel";

const postRoutes = Router();

//--------------------------CREACION DE UNA ENTRADA DE POSTEOS--------------------------------

postRoutes.post("/", [verificaToken], (req: any, res: Response) => {
  //en el body se obtiene la inf que se le pasa
  const body = req.body;
  body.usuario = req.usuario._id;

  //---------------Para CREAR/GRABAR en BD------------------

  Post.create(body)
    .then(async (postDB) => {
      //
      //Aparezca todo el objeto del usuario, para que no aparezca el pass cpn (-)
      await postDB.populate("usuario", "-password");

      res.json({
        ok: true,
        post: postDB,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        mensaje: "Incorrecto",
        err,
      });
    });
});

//--------------------------------------------------------POST PAGINADOS-------------------------------------------------
//con get peticion public
postRoutes.get("/", async (req: any, res: Response) => {
  //obtengo todos los registros y guardo en variable
  //Sacar todos reg de fomra descendente ---> const posts = await Post.find().sort({ _id: -1 }).exec();
  //que me regrese los ultimos 10 --> .limit(10)
  //Buscar paginas --> skip
  let pg = Number(req.query.pg) || 1; //si regresa NAN o null
  let skip = pg - 1;
  skip = skip * 10;

  const posts = await Post.find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(10)
    .populate("usuario", "-password")
    .exec();

  res.json({
    ok: true,
    pg,
    posts,
  });
});

//--------------------------------------------------------SUBIR ARCHIVOS IMAGENES------------------------------

postRoutes.post("/upload", [verificaToken], (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No se subió ningún archivo 👽",
    });
  }

  const file = req.files.image;

  res.json({
    ok: true,
    mansaje: '✔️',
    file
  });
});

export default postRoutes;
