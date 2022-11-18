const mongoose = require('mongoose');


const productoSchema = mongoose.Schema({

    nombre:{
        type: String,
        required:true
    },
    descripcion:{
        type: String,
        required:true
    },
    precio:{
        type: Number,
        required:true
    },
   
    cantidaddisponible:{
        type: Number,
        required:true
    },
    imagen:
      { 
        data:String,
        url: String, 
        name:String
      }

    
},
{
    statics: {
        findById(_id) {
          return this.find({ _id: _id });
        }
      }
    }
    )

module.exports = mongoose.model("productos",productoSchema);