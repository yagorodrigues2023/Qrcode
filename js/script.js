
document.addEventListener("DOMContentLoaded",function(){

    const container = document.getElementById("container")
    const load = document.getElementById("load")
    const li = document.querySelectorAll("#selecao li")
    const inputtext = document.getElementById("input-text")
    const inputcont = document.getElementById("input-cont")
    const btngerar = document.getElementById("btn-gerar")
    const btnbaixar = document.getElementById("btn-baixar")
    const img = document.getElementById("img")
    const dica = document.getElementById("dica")
    const wifi = document.getElementById("wifi")
    const text = document.getElementById("div-input")
    const divupload = document.getElementById("div-upload")
    const divuploadup = document.getElementById("div-upload-up")
    const upp = document.getElementById("up-p")
    const dicaup = document.getElementById("dica-up")
    const formradio = document.querySelectorAll('input[type="radio"]')
    const n_wifi = document.getElementById("nomerede")
    const s_wifi =document.getElementById("nomesenha")

    let selecionado 
    let file_update
    let arquivocom =''


    

//Cria o QR code

    function gerar(texto){
        container.style.display = "none"
        container.innerHTML = ""
        img.style.display = "none";
        load.style.display = "block";
        new QRCode (container,{
            text: texto,
            width: 160,
            height: 160,
            colorDark: "#000000",
            colorLight: "#ffffff00",
            correctLevel: QRCode.CorrectLevel.H
        })
            setTimeout(() => {
            load.style.display = "none";
            container.style.display = "block";
        }, 5000);
    } 
    
    //gera o QR code
    btngerar.addEventListener('click',function(){
        const texto =inputtext.value.trim()
        if(texto){
            gerar(texto)
            inputtext.value= ""
            dica.style.display = "block" 

            
        }else if(s_wifi.value && n_wifi.value !== ""){

            if (selecionado !=="") {
                let conteudo = `WIFI:T:${selecionado};S:${n_wifi.value};P:${s_wifi.value};H:false;`;
                console.log(conteudo)
                n_wifi.value = ""
                s_wifi.value=""
                formradio.forEach(radio => radio.checked = false);
                gerar(conteudo) 
            } else {
            alert("selecione um opção")
            return
            }
        } else{

            fotoqr()

        }
    })

    async function fotoqr() {

        if (!file_update) {
            alert('Selecione um arquivo primeiro!');
            return;
          }
      
          const formData = new FormData();
          formData.append('file', file_update);
      
          try {
            const response = await fetch(window.config.URL, {
              method: 'POST',
              body: formData,
            });
      
            const result = await response.json();
            gerar(result.url) // A URL do arquivo enviado
  
          } catch (err) {
            console.error('Erro ao enviar arquivo:', err);
          }
        
    }
    formradio.forEach((radio) => {
        radio.addEventListener('change',() =>{ 
        if (radio.checked) {
                selecionado = radio.value.toUpperCase()
                console.log(selecionado)

        } 
         })
    });


   

    //Ajusta o campo input
    inputtext.addEventListener('focus',()=>{
            dica.style.display = "none"

    })

    inputtext.addEventListener('input',() =>{

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

    //verificar tipo

    const verificar ={
        wifi: () => {
            inputcont.value=''
            arquivocom='' 
            text.style.display= "none"
            wifi.style.display= "flex" 
            divupload.style.display = "none"
            divuploadup.style.display = "none"
        },
        texto: () => {
            inputcont.value=''
            arquivocom='' 
            wifi.style.display= "none"
            text.style.display = "block"
            dica.style.display = "block"
            divupload.style.display = "block"
            divuploadup.style.display = "none"
            inputtext.placeholder= "Insira o texto aqui"
        },
        link: () => {
            inputcont.value=''
            arquivocom='' 
            wifi.style.display= "none"
            text.style.display = "block"
            dica.style.display = "block"
            divupload.style.display = "block"
            inputtext.style.display = "block"
            divuploadup.style.display = "none"
            inputtext.placeholder= "Insira seu website"

        },
        foto: () =>{
            text.style.display = "none"
            wifi.style.display= "none"
            divupload.style.display = "block"
            divuploadup.style.display = "block"
            if(arquivocom !==''){
                if(arquivocom.includes("image")){
                    upp.innerHTML=arquivocom
                    dicaup.style.display = "none"
                    
                }
                else{
                    inputcont.value=''
                    arquivocom='' 
                    upp.style.display= "block"
                    dicaup.style.display = "block"
                    dicaup.style.margin= "0.27rem 0 0 0"   
                    upp.innerText="Araste o foto e solte aqui"}
            }else{
                upp.style.display= "block"
                dicaup.style.display = "block"
                dicaup.style.margin= "0.27rem 0 0 0"          
                upp.innerHTML="Araste o foto e solte aqui"}


        },
        video: () =>{
            text.style.display = "none"
            wifi.style.display= "none"
            divupload.style.display = "block"
            divuploadup.style.display = "block"
            if(arquivocom !==''){
                if(arquivocom.includes("video")){
                    upp.innerHTML=arquivocom
                    dicaup.style.display = "none"
                }
                else{
                    inputcont.value=''
                    arquivocom='' 
                    upp.style.display= "block"
                    dicaup.style.display = "block"
                    dicaup.style.margin= "0.27rem 0 0 0" 
                    upp.innerText="Araste o video e solte aqui"}
            }else{
                upp.style.display= "block"
                dicaup.style.display = "block"
                dicaup.style.margin= "0.27rem 0 0 0" 
                upp.innerHTML="Araste o video e solte aqui"}
        },
        mp3: () =>{
            text.style.display = "none"
            wifi.style.display= "none"
            divupload.style.display = "block"
            divuploadup.style.display = "block"
            if(arquivocom !==''){
                if(arquivocom.includes("mp3")){
                    upp.innerHTML=arquivocom
                    dicaup.style.display = "none"
                }
                else{
                    inputcont.value=''
                    arquivocom=''
                    dica.style.display = "block"
                    upp.innerText="Araste o MP3 e solte aqui"}
            }else{
                upp.style.display= "block"
                dicaup.style.display = "block"
                dicaup.style.margin= "0.27rem 0 0 0" 
                upp.innerHTML="Araste o MP3 e solte aqui"}
        },
        pdf:()=>{
            text.style.display = "none"
            wifi.style.display= "none"
            divupload.style.display = "block"
            divuploadup.style.display = "block"
            if(arquivocom !==''){

                if(arquivocom.includes("pdf")){
                    upp.innerHTML=arquivocom
                    dicaup.style.display = "none"
                    }
                    else{
                        inputcont.value=''
                        arquivocom='' 
                        upp.style.display= "block"
                        dicaup.style.display = "block"
                        dicaup.style.margin= "0.27rem 0 0 0" 
                        upp.innerText="Araste o PDF e solte aqui"}
            }else{
                upp.style.display= "block"
                dicaup.style.display = "block"
                dicaup.style.margin= "0.27rem 0 0 0" 
                upp.innerHTML="Araste o PDF e solte aqui"}
            
        }
    }
   

    li.forEach((item,index) =>{
        item.addEventListener('click',() =>{
            console.log(item)
            let opcao = item.textContent.replace(item.querySelector('span').textContent,"").trim()

            li.forEach((el) => {
       
                el.removeAttribute("id")})

            item.setAttribute("id",`selecionado-${index}`)
            console.log(opcao)

            if(verificar[opcao]){
                verificar[opcao]()

            }

         

        })
        // Verifica se o arquivo foi arastado 
        if(divuploadup){
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(envetname =>{
                divuploadup.addEventListener(envetname,(evento)=>{
                    evento.preventDefault();
                    

                    if(envetname ==='dragenter' || envetname === 'dragover' ){
                        divuploadup.style.backgroundColor = ('rgba(95, 95, 95,0.4)')
                        console.log(envetname)
                    } else if (envetname ==='dragleave'){
                        divuploadup.style.backgroundColor = ('rgba(95, 95, 95,0.068)');
                    }else if (envetname === 'drop') {
                        const file = evento.dataTransfer.files;
                        let nome = ''
                        let tipo = ''

                        Array.from(file).forEach(file =>{
                            nome = file.name || 'Nome não identificado';
                            tipo = file.type || 'Tipo não identificado';
                            arquivocom =  `Nome do arquivo: ${nome}<br>Tipo: ${tipo}`
                            file_update = file
                        })
                        if(type[tipo]){
                            type[tipo]()
                        }

                        divuploadup.style.backgroundColor = ('rgba(95, 95, 95,0.068)');
                        console.log('Item foi solto na área!');}


                })
            })
        }
        const type = {
            "image/png": ()=>{li[3].click()},

            "image/jpg": ()=>{li[3].click()},

            "image/jpeg": ()=>{li[3].click()},

            "video/mp4": ()=>{li[4].click()},

            "video/mov": ()=>{li[4].click()},

            "application/pdf": ()=>{li[5].click()},

            "audio/mpeg": ()=>{li[6].click()},

            "audio/mp3": ()=>{li[6].click()},
        }
   

        
        /// verifica se foi feito upload
        inputcont.addEventListener('change', (e) => {
             file = e.target.files[0]; 

            
        if (file) {
                // Se o arquivo foi selecionado, exibe o nome e tipo
                const nome = file.name || 'Nome não identificado';
                const tipo = file.type || 'Tipo não identificado'
                arquivocom = `Nome do arquivo: ${nome}<br>Tipo: ${tipo}`
                if(type[tipo]){
                    type[tipo]()
                }
                file_update = file
            } else {
                console.log("Nenhum arquivo selecionado.");
            }
        });
    })

})






