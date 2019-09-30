import api from './api'
import CryptoJS from 'crypto-js';
var FileSaver = require('file-saver');
var hash = require('object-hash');

class App {
    constructor() {

        const baseURL = 'https://api.codenation.dev/v1/challenge/dev-ps'
        this.answer
        this.submitForm()

    }

    submitForm() {
        this.formEl.onsubmit = event => this.run(event)
    }

    saveJson(content) {
        let blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
        //FileSaver.saveAs(blob, "./answer.json");

        return blob
    }

    charCodeDescriptografado(char_code_criptografado, numero_casas) {
        let caracter_decode
        if (char_code_criptografado >= 97 && char_code_criptografado <= 122) {
            caracter_decode = char_code_criptografado - numero_casas;
            //console.log('char_code_criptografado: ' + char_code_criptografado)
            //console.log('caracter_decode:' + caracter_decode)
            if (caracter_decode < 97) {
                let offset = 97 - caracter_decode;
                //console.log('offset:' + offset)
                caracter_decode = 123 - offset
                //console.log('caracter_decode:' + caracter_decode)
            }
        } else {
            caracter_decode = char_code_criptografado
        }

        return caracter_decode;
    }


    async run() {
        const tokenInput = this.inputEl.value

        if (tokenInput.length === 0)
            return

        try {
            const response = await api.get(`/generate-data?token=${tokenInput}`)
            let { numero_casas, token, cifrado, decifrado, resumo_criptografico } = response.data

            //let cifrado = 'bpm jmab bpqvo ijwcb i jwwtmiv qa mdmv qn gwc izm ezwvo, gwc izm wvtg wnn jg i jqb. cvsvwev'
            //let decifrado = 'the best thing about a boolean is even if you are wrong, you are only off by a bit. unknown'
            let array_decrifrado = []
            let caracter_decode
            for (let i = 0; i < cifrado.length; i++) {
                caracter_decode = this.charCodeDescriptografado(cifrado.charCodeAt(i), numero_casas)
                array_decrifrado.push(caracter_decode)
            }
            decifrado = String.fromCharCode(...array_decrifrado)

            let hash = CryptoJS.SHA1(decifrado)
            resumo_criptografico = hash.toString()
            

            this.answer = {
                numero_casas, token, cifrado, decifrado, resumo_criptografico
            }



            console.log(this.answer)


            const responsePost = await api.post(`/submit-solution?token=${tokenInput}`, file, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            console.log(responsePost)

        } catch (err) {
            alert('Token invalido!')
        }
    }
}
new App()