var atualizarURL = {
    url: 'http://127.0.0.1:5500'
};

var frmLogin = document.getElementById("frmLogin");
var frmLoginTitulo = document.getElementById("frmLoginTitulo");
var frmLoginSubmit = document.getElementById('frmLoginSubmit');

frmCliente = document.getElementById('frmCliente');
frmProduto = document.getElementById('frmProduto');

var login = document.getElementById('login');
var logado = document.getElementById('logado');

var acessar = document.getElementById('acessar');
var cadastrar = document.getElementById('cadastrar');

var carregando = document.getElementById("carregando"); 

var UsuarioLogadoTitulo = document.getElementById('UsuarioLogadoTitulo');

var frmCliente = document.getElementById('frmCliente');
var frmProduto = document.getElementById('frmProduto');

var TituloFormProduto = document.getElementById('TituloFormProduto');
var TituloFormCliente = document.getElementById('TituloFormCliente');

var filtroCliente = document.getElementById('filtroCliente');
var filtroProduto = document.getElementById('filtroProduto');

// Funções

function mostraItem(element) {

    element.style.display="block";
 };
 
 function ocultaItem(element) {
 
    element.style.display="none";
 }

function realizarCadastro() {

    ocultaItem(cadastrar);
    mostraItem(acessar);

    frmLoginTitulo.innerHTML = 'Cadastre uma nova conta';
    frmLoginSubmit.innerHTML = 'Cadastrar';
}

function realizarAcesso() {

    ocultaItem(acessar);
    mostraItem(cadastrar);

    frmLoginTitulo.innerHTML = 'Entre com uma conta existente';
    frmLoginSubmit.innerHTML = 'Entrar';
}