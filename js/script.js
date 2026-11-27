console.log("QR script v2 carregado");

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
        container.innerHTML = ""
        new QRCode (container,{
            text: texto,
            width: 160,
            height: 160,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        })
        load.style.display = "none";
        container.style.display = "block";
    } 
    
    //gera o QR code
    btngerar.addEventListener('click',function(){
        container.style.display = "none"
        container.innerHTML = ""
        img.style.display = "none";
        load.style.display = "block";
        const texto =inputtext.value.trim()
        if(texto !== ""){
            gerar(texto)
            inputtext.value= ""
            dica.style.display = "block" 

            
        }else if(s_wifi.value && n_wifi.value !== ""){

            if (selecionado) {
                const esc = (v) => v.replace(/([\\;,:"])/g, "\\$1")
                const tipoWifi = selecionado === "NENHUMA" ? "nopass" : selecionado
                let conteudo = `WIFI:T:${tipoWifi};S:${esc(n_wifi.value)};P:${esc(s_wifi.value)};H:false;;`;
                console.log(conteudo)
                n_wifi.value = ""
                s_wifi.value=""
                formradio.forEach(radio => radio.checked = false);
                gerar(conteudo) 
            } else {
            alert("Selecione o tipo de criptografia")
            img.style.display = "block";
            load.style.display = "none";
            return
            }
        } else{

            fotoqr()

        }
    })

    async function fotoqr() {

        if (!file_update) {
            alert('Selecione um arquivo primeiro!');
            img.style.display = "block";
            load.style.display = "none";
            return;
      
          }
      
          const formData = new FormData();
          formData.append('file', file_update);

      
          try {
            const response = await fetch(window.config.URL, {
              method: 'POST',
              body: formData,
            });
      
            if (!response.ok) throw new Error('Servidor respondeu ' + response.status);
            const result = await response.json();
            gerar(result.url) // A URL do arquivo enviado
  
          } catch (erro) {
            console.error('Erro ao enviar arquivo:', erro);
            alert('Não foi possível enviar o arquivo. Tente novamente.');
            img.style.display = "block";
            load.style.display = "none";
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
    // Desenha o QR num canvas (fundo branco + margem), gera um PNG de verdade (Blob)
    // e baixa. No celular usa o menu nativo de compartilhar/salvar quando existir.
    function qrParaBlob() {
        return new Promise((resolve, reject) => {
            const origem = container.querySelector("canvas") || container.querySelector("img")
            if (!origem) { reject(new Error("QR Code não encontrado")); return }

            const tamanho = 600
            const margem = 40
            const canvas = document.createElement("canvas")
            canvas.width = tamanho + margem * 2
            canvas.height = tamanho + margem * 2
            const ctx = canvas.getContext("2d")
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.imageSmoothingEnabled = false

            const desenhar = () => {
                ctx.drawImage(origem, margem, margem, tamanho, tamanho)
                canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Falha ao gerar PNG")), "image/png")
            }

            if (origem.tagName === "CANVAS" || origem.complete) {
                desenhar()
            } else {
                origem.onload = desenhar
                origem.onerror = () => reject(new Error("Falha ao carregar a imagem do QR"))
            }
        })
    }

    btnbaixar.addEventListener("click", async () => {
        try {
            const blob = await qrParaBlob()
            const arquivo = new File([blob], "qrcode.png", { type: "image/png" })

            // Celular: abre o menu nativo (Salvar imagem / Arquivos / Compartilhar)
            if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
                try {
                    await navigator.share({ files: [arquivo], title: "QR Code" })
                    return
                } catch (e) {
                    if (e.name === "AbortError") return // usuário fechou o menu
                    // se falhar por outro motivo, cai no download normal abaixo
                }
            }

            // PC e navegadores sem share: download por Blob URL
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "qrcode.png"
            link.style.display = "none"
            document.body.appendChild(link) // precisa estar no DOM em vários navegadores móveis
            link.click()
            document.body.removeChild(link)
            setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch (erro) {
            console.error(erro)
            alert("QR Code não encontrado. Gere um QR Code primeiro.")
        }
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






