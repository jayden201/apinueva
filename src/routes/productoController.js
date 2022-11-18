const express = require('express');
const productoSchema = require('../schemas/productoSchema');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


//Router
const productoRouter = express.Router();

//Retorna todas las categorias
productoRouter.get('/producto/getall',(req,res) => {
     productoSchema.find().then((data) => {
        var response = {
            code : 200,
            message : "Consulta realizada exitosamente",
            data : data
        }
        res.json(response);
       
    }).catch((error) => {
        var response = {
            code : 500,
            message : "Server error" + error,
            data : error
        }
        res.json(response);
    })
})


//Crear una categoria
productoRouter.post('/producto/create',async(req,res) => {
        //Mapear el esquema recibido en el request, con el esquema de mongoDB
        const newProducto = productoSchema(req.body);
        //console.log(req.body.imagen.name);
        //console.log(newProducto.imagen)
        if(newProducto.imagen.data != null){
            //Tomar los datos del base64
            const fileContents = new Buffer.from(newProducto.imagen.data, 'base64')
            //console.log("content:"+fileContents);
            //Guardo el archivo en una ruta dada.
            
            await fs.writeFileSync(path.join(__dirname, '..','..', 'public/images/') + newProducto.imagen.name, fileContents, err => {
                if (err) {
                    console.error(err);
                }
            });
            
    
            //Limpia la data del base 64
            newProducto.imagen.data = "";
            newProducto.imagen.url = process.env.pathfiles + newProducto.imagen.name;
        }   console.log(newProducto.imagen.url);
        await newProducto.save().then((data) =>{
        
        var response = {
            code : 200,
            message : "Producto registrado exitosamente",
            data : data
        }
        res.json(response)
    }).catch((error) => {
        var response = {
            code : 500,
            message : "Server error" + error,
            data : error
        }
        res.json(response);
    })
})

productoRouter.put('/producto/update/:id',(req,res) => {
    let { id } = req.params;
    const { nombre, descripcion,precio,cantidaddisponible } = req.body;

    productoSchema.updateOne({_id : id}, { $set:{ nombre,descripcion,precio,cantidaddisponible } }).then((data) => {
        //console.log(data);
        console.log(req.body);
        res.json(data);
        
    }).catch((error) => {
        res.json(error);
    })
})

productoRouter.get('/producto/selectbyid/:id',(req,res)=> {
    let { id } = req.params;
    productoSchema.findById(id).then((data) => {
       res.json(data);
    }).catch((error) => {
       res.json(error);
    })
})

productoRouter.delete('/producto/delete/:id',(req,res)=> {
    let { id } = req.params;
    console.log(id);
    productoSchema.remove({_id : id}).then((data) => {
        res.json(data);
    }).catch((error) => {
        res.json(error);
    })
})



module.exports = productoRouter;