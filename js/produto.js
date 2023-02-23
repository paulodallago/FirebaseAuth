frmProduto.onsubmit = function (event) {

    if (TituloFormProduto.innerHTML == 'Adicionar novo produto') {

        event.preventDefault()

        if(frmProduto.pro_nome.value == '') {
    
            alert('O nome do produto não pode estar em branco.')
            frmProduto.pro_nome.focus();
        } else if(frmProduto.pro_qtd.value == '') {
    
            alert('A quantidade do produto não pode estar em branco.')
            frmProduto.pro_qtd.focus();
        } else if(frmProduto.pro_valor.value == '') {
    
            alert('O valor do produto não pode estar em branco.')
            frmProduto.pro_valor.focus();
        } else if(frmProduto.pro_fornecedor.value == '') {
    
            alert('O fornecedor do produto não pode estar em branco.')
            frmProduto.pro_fornecedor.focus();
        }  else {
    
            firebase.firestore().collection('produtos').add({
                Nome: frmProduto.pro_nome.value,
                NomeMinusculo: frmProduto.pro_nome.value.toLowerCase(),
                Quantidade: frmProduto.pro_qtd.value,
                Valor: frmProduto.pro_valor.value,
                Fornecedor: frmProduto.pro_fornecedor.value
            })
            .then((docRef) => {
                console.log('Produto cadastrado com ID: ', docRef.id);
                alert('Produto cadastrado com sucesso.')
                frmProduto.pro_nome.value = ''
                frmProduto.pro_qtd.value = ''
                frmProduto.pro_valor.value = ''
                frmProduto.pro_fornecedor.value = ''
            })
            .catch((error) => {
                console.error('Erro ao adicionar um documento: ', error);
            });
        }
    } else {

        event.preventDefault();
        var confirmation = confirm('Confirma a alteração dos dados?')
        if(confirmation) {
            firebase.firestore().collection('produtos').doc(updateKey).update({
                Nome: frmProduto.pro_nome.value,
                Quantidade: frmProduto.pro_qtd.value,
                Valor: frmProduto.pro_valor.value,
                Fornecedor: frmProduto.pro_fornecedor.value,
                NomeMinusculo: frmProduto.pro_nome.value.toLowerCase() 
            }).then(function () {
                alert('Registro alterado com sucesso.')
            }).catch(function (error) {
                console.log('Falha ao alterar os dados: ', error)
            })
        }
        cancelaUpdate()
    }
}

function listaProduto() {

    firebase.firestore().collection('produtos').orderBy('Nome').onSnapshot(function (dataSnapshot) {
        geraListaProduto(dataSnapshot)
    })
    filtroProduto.onkeyup = function() {
        if (filtroProduto.value != '') {
            var textoFiltro = filtroProduto.value.toLowerCase();
            firebase.firestore().collection('produtos').orderBy('NomeMinusculo').startAt(textoFiltro).endAt(textoFiltro + '\uf8ff')
            .get().then(function(dataSnapshot) {
                geraListaProduto(dataSnapshot);
            })
        } else {
            firebase.firestore().collection('produtos')
            .orderBy('Nome').onSnapshot(function (dataSnapshot) {
                geraListaProduto(dataSnapshot);
            })
        }
    }
}

function geraListaProduto(dataSnapshot) {
    ulListaProdutos.innerHTML = ''
    var num = dataSnapshot.size

    contaProduto.innerHTML = 'Total de registros: ' + num + (num > 1 ? ' produtos' : ' produto' + '.')
    dataSnapshot.forEach(function (item) {
        var value = item.data()
    
        var li = document.createElement('li')
        li.id = item.id 

        var spanLi = document.createElement('span')
        spanLi.appendChild(document.createTextNode(value.Nome))
        li.appendChild(spanLi)

        var liUpdateBtn = document.createElement('button')
        liUpdateBtn.appendChild(document.createTextNode('Alterar'))
        liUpdateBtn.setAttribute('onclick', 'alteraProduto(\"' + item.id + '\")')

        li.appendChild(liUpdateBtn)

        var liRemoveBtn = document.createElement('button')
        liRemoveBtn.appendChild(document.createTextNode('Excluir'))
        liRemoveBtn.setAttribute('class', 'btnDeletar')
        liRemoveBtn.setAttribute('onclick', 'excluiProduto(\"' + item.id + '\")')

        li.appendChild(liRemoveBtn)

        ulListaProdutos.appendChild(li)
    })
}

//Exclui o produto

function excluiProduto(key) {

    var nomeProd = null;

    firebase.firestore().collection('produtos').doc(key).get().then(function (dados) {

            var prod = dados.data();
            nomeProd = prod.Nome;

            var confirmation = confirm('Realmente deseja remover o produto \"' + nomeProd + '\"?')

            if (confirmation) {
                firebase.firestore().collection('produtos').doc(key).delete().then(function () {
                   alert('Produto "' + nomeProd + '" removido com sucesso.')
                }).catch(function (error) {
                   console.log('Falha ao remover tarefa: ', error)
                })
             }
    });
    cancelaUpdate()
 }

 var updateKey = null

function alteraProduto(key) {

    updateKey = key;
    firebase.firestore().collection('produtos').doc(key).get().then(function (dados) {
        if(dados.exists) {
            var prod = dados.data();
            pro_nome.value = prod.Nome;
            pro_qtd.value = prod.Quantidade;
            pro_valor.value = prod.Valor;
            pro_fornecedor.value = prod.Fornecedor;
    
            TituloFormProduto.innerHTML = 'Editar o produto: ' + prod.Nome
            ocultaItem(frmProdutoBtnGravar)
            mostraItem(frmProdutoBtnAlterar)
        }
    })
}

function cancelaUpdate() {
    TituloFormProduto.innerHTML = 'Adicionar novo produto'
    ocultaItem(frmProdutoBtnAlterar)
    mostraItem(frmProdutoBtnGravar)
    frmProdutoBtnGravar.style.display = 'initial'
    frmProduto.pro_nome.value = '';
    frmProduto.pro_qtd.value = '';
    frmProduto.pro_valor.value = '';
    frmProduto.pro_fornecedor.value = ''
}