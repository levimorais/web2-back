const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlunoSchema = Schema({
    nomeAluno: String,
    emailAluno: String,
    senhaAluno: String,
    fotoAluno:  String,
});

module.exports = mongoose.model("aluno", AlunoSchema);