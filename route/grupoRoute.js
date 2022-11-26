const grupoRoute = require('express').Router()
const { json } = require('express');
const express = require('express');
const { $where } = require('../model/grupoModel');
const jwt = require('jsonwebtoken');
const grupo = require('../model/grupoModel')

const verificaToken = (req, res, next) => {
    const token = req.body.token;
    if (!token){
        res.json({logado: false, mensagem: 'Erro: Token de Segurança não pôde ser enviado'});

    } else { 
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.json({locado: false, mensagem: 'Erro: Houve um erro durante a autenticação, tente novamente'});
            }
            next();
        });
    }
   
}

function verificaTokenHeader(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) {
        res.json({ logado: false, mensagem: 'Erro: Token de Segurança não pôde ser enviado' });

    } else {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
            res.json({ logado: false, mensagem: 'Erro: Houve um erro durante a autenticação, tente novamente' });
            }
                
            next();
        });
    }
}

grupoRoute.post('/grupo/cadastrar', verificaToken, async(req, res) => {
    try {
        const{nomeGrupo, metaGrupo, descricaoGrupo, encontroGrupo, materialGrupo, membroGrupo, token} = req.body;

        if(nomeGrupo == undefined || metaGrupo == undefined || descricaoGrupo == undefined || encontroGrupo == undefined || materialGrupo == undefined || membroGrupo == undefined || nomeGrupo === "" || metaGrupo === "" || descricaoGrupo === "" || encontroGrupo === "" || materialGrupo ==="" || membroGrupo === ""){
            res.json({mensagem: 'Todos os campos são obrigatórios'});

        }else{
            if(await grupo.findOne({nomeGrupo}) != null){
                res.json({mensagem: "Um grupo de estudos com este nome já existe, tente outro"});

            }else{
                await grupo.create({
                    nomeGrupo,
                    metaGrupo,
                    descricaoGrupo,
                    data_encontrosGrupo,
                    materialGrupo,
                    membroGrupo
                });

                await grupo.findOneAndUpdate({"nome": nomeGrupo}, {$push:{membrosGrupo:membrosGrupo}}, {new:true});

                res.json({mensagem: "Grupo de estudos criado com sucesso"});
            }
        }

    }catch(erro){
        res.json({mensagem: "Houve um erro durante a criação do grupo de estudo, tente novamente"});
    }
});

grupoRoute.get('/gruposDeEstudo', verificaTokenHeader, async(req, res) => {
    try{
        const resultado = await grupo.find({})
        res.json(resultado)

    }catch(erro){
        res.json({mensagem: "Houve um erro durante a a busca dos grupos de estudo já criados, tente novamente"})
        console.log(erro)
    }
});

grupoRoute.put('/grupo/atualizarMembros/id=:id', verificaTokenHeader, async(req, res) => {
    try {
        const {membroGrupo, token} = req.body;

        if(await grupo.findOneAndUpdate({"_id": req.params.id}, {$push:{membrosGrupo:membroGrupo}}, {new:true}))
            res.json({mensagem: 'Grupo atualizado com sucesso', membroGrupo: membroGrupo })

    } catch (error) {
        res.json({mensagem: 'Houve um erro durante a atualização da lista de alunos deste grupo, tente novamente'});
    }
});

grupoRoute.put('/grupo/removerMembro/id=:id', verificaTokenHeader, async(req, res) => {
    try {
        const {membrosGrupo, token} = req.body

        if(await grupo.findOneAndUpdate({"_id": req.params.id}, req.body, {new:true}))
            res.json({mensagem: 'Aluno removido do grupo com sucesso', membrosGrupo:membrosGrupo})

    } catch (error) {
        res.json({mensagem: 'Houve um erro durante a remoção do aluno, tente novamente'});
    }
});

grupoRoute.delete('/deletarGrupo/id=:id', verificaTokenHeader, async (req, res) => {
    try {
        if(await grupo.findOne({"_id": req.params.id})!=null){
            await grupo.deleteOne({"_id": req.params.id});
            res.json({mensagem: 'Grupo de estudo removido com sucesso'});
          }else{
            res.json({mensagem: 'Erro: O grupo de estudo não existe'});
          } 
    } catch (error) {
        res.json({mensagem: 'Houve um erro na remoção do grupo, tente novamente'});
    }
});

module.exports = grupoRoute;