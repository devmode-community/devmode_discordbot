const commando = require('discord.js-commando');

class RolarDadosComando extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'rolar',
            group: 'rolardados',
            memberName: 'rolar',
            description: 'Rola um dado'
        });
    }

    //bloco em que roda o comando cada vez que for digitado
    async run(message, args) {
        if (SERVER.member(message.author.id)) {
            //cortando os decimais com floor podemos utilizar o metodo random (0<1)
            var rolar = Math.floor(Math.random() * 6) + 1; 
            message.reply("Tu rolou " + rolar);
        } else { 
            message.reply('Desculpe, mas você não faz parte da comunidade Dev Mode de Campos :sob:');
        }
	}
}

module.exports = RolarDadosComando;