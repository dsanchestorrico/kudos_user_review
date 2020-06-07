const { Router } = require('express');
const router = Router();

const connection = require('../models/connectMysql');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM usuario';
    connection.query(sql,(error,resultado)=>{
        if (error) throw error;
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.send('No hay registros');
        }
    });
});
// router.get('/:idUser', (req, res) => {
//     res.send('welcome');
// });
router.post('/create', (req, res) => {
    const sql = 'INSERT INTO usuario SET ?';
    const usuario = {
        nickname: req.body.nickname,
        realname: req.body.realname,
        kudosqty: 0
    }
    connection.query(sql,usuario,error=>{
        if (error) throw error; 
        res.send(usuario);

    });
});
router.get('/find', (req, res) => {
    const sql = 'SELECT * FROM usuario WHERE lower(nickname) like lower(\'%' + req.body.input + '%\') OR  lower(realname) like lower(\'%' + req.body.input +'%\') ';
    
    connection.query(sql,(error,resultado)=>{
        if (error) throw error; 
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.send('No se encontraron registros para '+ req.body.input);
        }

    });
});
router.delete('/:idUser', (req, res) => {
    const {idUser} = req.params;
    const sql = `DELETE FROM usuario WHERE id = ${idUser}`;
    connection.query(sql, error => {
        if (error) throw error;
        res.send(`Usuario ${idUser} eliminado`);

    });
});

module.exports = router;