firebase.auth().languageCode = 'pt-BR'

frmLogin.onsubmit = function (event) {
   mostraItem(carregando);
   event.preventDefault()
   if (frmLogin.frmLoginSubmit.innerHTML == 'Entrar') {
      firebase.auth().signInWithEmailAndPassword(frmLogin.email.value, frmLogin.senha.value).then(function (user) {
         alert('Acesso realizado com sucesso.');
         console.log(user)
      }).catch(function (error) {
         alert('Falha no Acesso.')
         console.log(error)
         ocultaItem(carregando);
      })
   } else {
    firebase.auth().createUserWithEmailAndPassword(frmLogin.email.value, frmLogin.senha.value).then(function(user) {
       alert('Usuário cadastrado com sucesso.');
       console.log(user);
    }).catch(function(error){
       alert('Falha ao cadastrar usuário.');
       console.log(error);
       ocultaItem(carregando);
    })
 }
};

firebase.auth().onAuthStateChanged(function (user) {

   ocultaItem(carregando);
   if (user) {
       mostraItem(logado);
       ocultaItem(login);
       UsuarioLogadoTitulo.innerHTML = 'Usuário autenticado: ' + user.email;
       imgUsuario.src = user.photoURL ? user.photoURL : 'img/semfoto.png';
       if(user.emailVerified) {
           ocultaItem(EnviaVerificaEmail);
           document.getElementById('verificaEmail').innerHTML = 'E-mail verificado';
       } else {

           mostraItem(EnviaVerificaEmail);
           document.getElementById('verificaEmail').innerHTML = 'E-mail não verificado';
       }
       listaCliente()
       listaProduto()
   } else {

       mostraItem(login);
       ocultaItem(logado);
   }
});

function signOut() {
   firebase.auth().signOut().then(function() {
       alert('O usuário saiu.')
   }).catch(function(error) {
       console.log('Falha ao sair da conta: ');
       console.log(error);
   });
   frmLogin.email.value = '';
   frmLogin.senha.value = '';
};

function verificaEmail() {

   user = firebase.auth().currentUser;
   user.sendEmailVerification().then(function() {
      alert('Email de verificação enviado para ' + user.email)
   }).catch(function(error) {
      alert('Erro ao enviar email de verificação.');
   })
};

function excluirUsuario() {
   var confirma = confirm('Confirma a exclusão de sua conta?');
   if(confirma) {
      firebase.auth().currentUser.delete().then(function() {
         alert('Conta excluída com sucesso.');
      }).catch(function(error) {
         alert('Erro ao excluir a conta.');
         console.log(error);
      })
   }
   signOut();
};

function loginGoogle() {

   mostraItem(carregando);
   firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function(error) {

      console.log(error);
      alert('Erro ao entrar com o Google');
      ocultaItem(carregando);
   })
};