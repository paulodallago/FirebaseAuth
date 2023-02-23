frmCliente.onsubmit = function (event) {

    if (TituloFormCliente.innerHTML == 'Adicionar novo cliente'){

        event.preventDefault()

        if(frmCliente.cli_nome.value == '') {
    
            alert('O nome do cliente não pode estar em branco.')
            frmCliente.cli_nome.focus();
        } else if(frmCliente.cli_endereco.value == '') {
    
            alert('O endereco do cliente não pode estar em branco.')
            frmCliente.cli_endereco.focus();
        } else if(frmCliente.cli_cpf.value == '') {
    
            alert('O cpf do cliente não pode estar em branco.')
            frmCliente.cli_cpf.focus();
        } else if(frmCliente.cli_fone.value == '') {
    
            alert('O telefone do cliente não pode estar em branco.')
            frmCliente.cli_fone.focus();
        }  else {
    
            firebase.firestore().collection('clientes').add({
                Nome: frmCliente.cli_nome.value,
                NomeMinusculo: frmCliente.cli_nome.value.toLowerCase(),
                Endereço: frmCliente.cli_endereco.value,
                CPF: frmCliente.cli_cpf.value,
                Telefone: frmCliente.cli_fone.value
            })
            .then((docRef) => {
                console.log('Cliente cadastrado com ID: ', docRef.id);
                alert('Cliente cadastrado com sucesso.')
                frmCliente.cli_nome.value = ''
                frmCliente.cli_endereco.value = ''
                frmCliente.cli_cpf.value = ''
                frmCliente.cli_fone.value = ''
            })
            .catch((error) => {
                console.error('Erro ao adicionar um documento: ', error);
            });
        }
    } else {

        event.preventDefault();
        var confirmation = confirm('Confirma a alteração dos dados?')
        if(confirmation) {
            firebase.firestore().collection('clientes').doc(updateKey).update({
                Nome: frmCliente.cli_nome.value,
                Endereço: frmCliente.cli_endereco.value,
                CPF: frmCliente.cli_cpf.value,
                Telefone: frmCliente.cli_fone.value,
                NomeMinusculo: frmCliente.cli_nome.value.toLowerCase() 
            }).then(function () {
                alert('Registro alterado com sucesso.')
            }).catch(function (error) {
                console.log('Falha ao alterar os dados: ', error)
            })
        }
        cancelaUpdateCli()
    }
}

function listaCliente() {

    firebase.firestore().collection('clientes')
    .orderBy('Nome').onSnapshot(function (dataSnapshot) {
        geraListaCliente(dataSnapshot)
    })
    filtroCliente.onkeyup = function() {
        if (filtroCliente.value != '') {
            var textoFiltro = filtroCliente.value.toLowerCase();
            firebase.firestore().collection('clientes').orderBy('NomeMinusculo').startAt(textoFiltro).endAt(textoFiltro + '\uf8ff')
            .get().then(function(dataSnapshot) {
                geraListaCliente(dataSnapshot);
            })
        } else {
            firebase.firestore().collection('clientes')
            .orderBy('Nome').onSnapshot(function (dataSnapshot) {
                geraListaCliente(dataSnapshot);
            })
        }
    }
}

function geraListaCliente(dataSnapshot) {
    ulListaClientes.innerHTML = ''
    var num = dataSnapshot.size

    contaCliente.innerHTML = 'Total de registros: ' + num + (num > 1 ? ' clientes' : ' cliente' + '.')
    dataSnapshot.forEach(function (item) {
        var value = item.data()
    
        var li = document.createElement('li')
        li.id = item.id 

        var spanLi = document.createElement('span')
        spanLi.appendChild(document.createTextNode(value.Nome))
        li.appendChild(spanLi)

        var liUpdateBtn = document.createElement('button')
        liUpdateBtn.appendChild(document.createTextNode('Alterar'))
        liUpdateBtn.setAttribute('onclick', 'alteraCliente(\"' + item.id + '\")')

        li.appendChild(liUpdateBtn)

        var liRemoveBtn = document.createElement('button')
        liRemoveBtn.appendChild(document.createTextNode('Excluir'))
        liRemoveBtn.setAttribute('class', 'btnDeletar')
        liRemoveBtn.setAttribute('onclick', 'excluiCliente(\"' + item.id + '\")')
        
        li.appendChild(liRemoveBtn)

        ulListaClientes.appendChild(li)
    })
}

//Exclui o Cliente

function excluiCliente(key) {

    var nomeCli = null;

    firebase.firestore().collection('clientes').doc(key).get().then(function (dados) {

            var cid = dados.data();
            nomeCli = cid.Nome;

            var confirmation = confirm('Realmente deseja remover o cliente \"' + nomeCli + '\"?')

            if (confirmation) {
               firebase.firestore().collection('clientes').doc(key).delete().then(function () {
                  alert('Produto "' + nomeCli + '" removido com sucesso.')
               }).catch(function (error) {
                  console.log('Falha ao remover tarefa: ', error)
               })
            }
    });
    cancelaUpdateCli()
 }

 var updateKey = null

 function alteraCliente(key) {
 
     updateKey = key;
     firebase.firestore().collection('clientes').doc(key).get().then(function (dados) {
         if(dados.exists) {
             var cli = dados.data();
             cli_nome.value = cli.Nome;
             cli_endereco.value = cli.Endereço;
             cli_cpf.value = cli.CPF;
             cli_fone.value = cli.Telefone;
     
             TituloFormCliente.innerHTML = 'Editar o cliente: ' + cli.Nome
             ocultaItem(frmClienteBtnGravar)
             mostraItem(frmClienteBtnAlterar)
         }
     })
 }
 
 function cancelaUpdateCli() {
     TituloFormCliente.innerHTML = 'Adicionar novo cliente'
     ocultaItem(frmClienteBtnAlterar)
     mostraItem(frmClienteBtnGravar)
     frmClienteBtnGravar.style.display = 'initial'
     frmCliente.cli_nome.value = '';
     frmCliente.cli_endereco.value = '';
     frmCliente.cli_cpf.value = '';
     frmCliente.cli_fone.value = ''
 }