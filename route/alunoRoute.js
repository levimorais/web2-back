const alunoRoute = require('express').Router();
const express = require('express');
const aluno = require('../model/alunoModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

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

alunoRoute.post('/aluno/cadastrar/', async(req, res) => {
    try{
        const {nomeAluno, emailAluno, senhaAluno, fotoAluno} = req.body
        const senhac = await bcrypt.hash(senha, 10)

        //verificando campos
        if(nomeAluno === undefined || emailALuno === undefined|| senhaAluno == undefined|| nomeAluno === "" || emailAluno === ""|| senhaAluno == ""){
            res.json({mensagem: 'Todos os campos são obrigatórios'});  

        }else{
            if(await aluno.findOne({emailAluno})!=null){
                res.json({mensagem: 'Este email já está em uso!'});
                
            }else{
                await aluno.create({
                    nomeAluno,
                    emailAluno,
                    senha: senhac,
                    fotoAluno
                });

                res.json({mensagem: 'Cadastro realizado com sucesso'})
            }
        }

    }catch(erro){
        res.json({mensagem: 'Houve um erro durante o cadastro, tente novamente'});
        console.log(erro);
    }
});

alunoRoute.post("/aluno/entrar", async (req, res) => {
    const {emailAluno, senhaAluno} = req.body;
  
    const user = await aluno.findOne({ emailAluno });

    if (!user) {
      return res.json({ error: "Erro: Este usuário não existe" });
    }

    if (await bcrypt.compare(senhaAluno, user.senhaAluno)) { 
      const token = jwt.sign({ email: user.emailAluno }, process.env.JWT_SECRET, {expiresIn: 900000});
  
      if (res.status(201)) {
        const body = {
            idAluno: user._idAluno,
            nomeAluno:user.nomeAluno, 
            emailAluno: user.emailAluno, 
            fotoAluno: user.fotoAluno
        }

        return res.json({ status: "ok", data: token, body: body});
    
      } else {
        return res.json({ error: "error" });
      }
    }
    res.json({ status: "error", error: "Senha inválida!" });
  });

alunoRoute.put('/aluno/atualizarFoto/id=:id', verificaToken, async (req, res) => {
    try {
        //recupera informações
        const {fotoAluno, token} = req.body

        //verifica informações
        if (await aluno.findOneAndUpdate({"_id": req.params.id}, req.body, {new:true}))
            res.json({mensagem: 'Foto atualizada com sucesso!', foto: foto});
    } catch (error) {
        res.json({mensagem: 'Houve um erro ao atualizar a foto, tente novamente'});
    }
});

alunoRoute.delete('/aluno/excluirAluno/id=:id', verificaToken, async (req, res) => {
    try {
        const {token} = req.body

        if(await aluno.findOne({"_id": req.params.id})!=null){
            await aluno.deleteOne({"_id": req.params.id});
            res.json({mensagem: 'Aluno foi excluído com sucesso'});
          }else{
            res.json({mensagem: 'Erro: O aluno não existe'});
          } 
    } catch (error) {
        res.json({mensagem: 'Houve um erro ao excluir o aluno, tente novamente'});
    }
});

alunoRoute.put('/aluno/atualizarSenha/', async (req, res) => {
    try {
        const {email, senha} = req.body
        const senhac = await bcrypt.hash(senha, 10)

        if (await aluno.findOneAndUpdate({"email": emailAluno}, {"senha": senhac}, {new:true}))
            res.json({mensagem: 'Senha atualizada com sucesso!'})
        else{
            res.json({mensagem: 'Falha ao atualizar senha! Email não encontrado!'})
        }
    } catch (error) {
        res.json({mensagem: 'Erro na atualização!'});
    }
});



module.exports = alunoRoute;