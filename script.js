document.addEventListener("DOMContentLoaded",function(){

    const container = document.getElementById("container")
    const selecao = document.getElementById("selecao")
    const inputtext = document.getElementById("input-text")
    const inputcont = document.getElementById("input-cont")
    const btngerar = document.getElementById("btn-gerar")
    const btnbaixar = document.getElementById("btn-baixar")
    const img = document.getElementById("img")
    const dica = document.getElementById("dica")

//Cria o QR code

    function gerar(texto){

        container.innerHTML = ""
        new QRCode (container,{
            text: texto,
            width: 160,
            height: 160,
            colorDark: "#000000",
            colorLight: "#ffffff00",
            correctLevel: QRCode.CorrectLevel.H
        })
    }    
    btngerar.addEventListener('click',function(){
        
        const texto =inputtext.value.trim()
        if(texto){
            gerar(texto)
            img.style.display = "none"
            container.style.display = "block"

        }else{
            alert("Por favor, insira algum texto para gerar o QR Code.");
        }
    })
    //Ajusta o campo input
    inputtext.addEventListener('focus',()=>{
            dica.style.display = "none"

    })
    inputtext.addEventListener('input',() => {
        if(inputtext.value.trim() ===""){
            dica.style.display = "block"
        }else{
        dica.style.display = "none"}
    })

    //Faz Download Do Qrcode

    btnbaixar.addEventListener("click",() => {   
        const qrimg = container.querySelector("img")

    if(!qrimg){
        alert("QR Code não encontrado")
        return}

    const link = document.createElement("a")
    link.href = qrimg.src
    link.download = "qrcode.png"
    link.click()
})

})


