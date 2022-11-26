const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GrupoDeEstudoModelSchema = Schema({
    nomeGrupo: String,
    metaGrupo: String,
    descricaoGrupo: String,
    encontroGrupo: String,
    materialGrupo: String,
    membrosGrupo: [String]
    
});

module.exports = mongoose.model("grupo", GrupoDeEstudoModelSchema);