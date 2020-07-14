const commando = require('discord.js-commando');

class RolarDadosComando extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'random',
            memberName: 'roll',
            description: 'Rola um dado'
        });
    }
    
    //bloco em que roda o comando cada vez que for digitado
    async run(message, args) {
        //cortando os decimais com floor podemos utilizar o metodo random (0<1)
        var rolar = Math.floor(Math.random() * 6) + 1; 
        message.reply("Tu rolou " + rolar);
    }
}

module.exports = RolarDadosComando;