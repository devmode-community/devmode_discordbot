const channel_ids = require('./channel_ids.json');
const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
const btcValor = require('btc-value');
const Commando = require('discord.js-commando');

require('dotenv').config();
// Set the API key
btcValor.setApiKey(process.env.BTC_VALUE_API_KEY);

const prefixo = botconfig.prefixo;

const path = require('path');
const bot = new Discord.Client();
const bot_comando = new Commando.Client({
    commandPrefix: prefixo,
    owner: '186519740863217664'
});

bot.on('ready', async () => {
    console.log(`${bot.user.username} is online`);
    console.log('Estou pronto!');
    // guild/servidor que o bot está(nesse caso DevMode)
    SERVER = bot.guilds.cache.get("475507684024516608");
    //console.log(bot.guilds.cache.get("475507684024516608"));
    // Setando a atividade do bot
    bot.user.setActivity('Star Wars', { type: 'WATCHING' })
    .then(presence => console.log(`Atividade setada para ${presence.activities[0].name}`))
    .catch(console.error);
});

bot.on('message', async message => {

  	let mensagemArray = message.content.split(" ");
  	let comando = mensagemArray[0];
    let args = mensagemArray.slice(1);
  	
    if (message.author.bot) return;
      
    // em caso de mensagem privada(direct message)
  	if (message.channel.type === "dm"){
        // Necessário verificar se o user faz parte da comunidade no discord
        if (SERVER.member(message.author.id)) {
            // existe um membro do servidor/guild com essa ID
            //console.log('esse user faz parte da guild')
            //console.log(message.author.id)

        // mensagem para quem não é da comunidade e está enviando msg privada pro bot
        // TODO: embed richtext com contatos para inserir-se na comunidade
        } else { 
            message.reply('Desculpe, mas você não faz parte da comunidade Dev Mode de Campos :sob:');
        }
    // fim da Direct Message(DM)    
    };
  	
  	if (comando === `${prefixo}ping`){
        //WebSocketManager no client.ws.ping
        message.reply("Pong! O ping do bot ao discord é `" + `${bot.ws.ping}` + " ms`");
        message.reply("O trafego é feito do user ao bot e do bot ao discord");
  	}
  	
  	if (message.content == `${prefixo}btcdia`) {
        btcValor().then(value => {
        btcValor.getPercentageChangeLastDay().then(percentage => {
            var perc = percentage
            if (perc > 0){
                message.channel.send(`<@${message.author.id}>
                BTC: ${value}$ \nSubiu (ultimo dia): ${perc}% :hugging:`)
               } else if (perc < 0){
                message.channel.send(`<@${message.author.id}>
                BTC: ${value}$ \nDesceu (ultimo dia): ${perc}% :sob:`)
               } else {
                message.channel.send(`<@${message.author.id}>
                BTC: ${value}$ \nManteve (ultimo dia): ${perc}% :rolling_eyes:`)
               }
            });
        });
  	}
  	
  	if (message.content == `${prefixo}btcsemana`) {
        btcValor().then(value => {
        btcValor.getPercentageChangeLastWeek().then(percentage => {
            var perc = percentage
            if (perc > 0){
                message.channel.send(`BTC: ${value}$ \nSubiu (ultima semana): ${perc}% :hugging:`);
               } else if (perc < 0){
                message.channel.send(`BTC: ${value}$ \nDesceu (ultima semana): ${perc}% :sob:`);
               } else {
                message.channel.send(`BTC: ${value}$ \nManteve (ultima semana): ${perc}% :rolling_eyes:`);
               }
            });
        });
  	}
});

// habilitando framework de comandos
bot_comando.login(process.env.BOT_TOKEN);
bot_comando.registry
    // Registers your custom command groups
    .registerGroups([
        ['rolardados', 'Rolardados'],
        ['procurarvaga', 'Procurarvaga'],
    ])

    // Registra todos os grupos, comandos e tipos de argumentos pré-construidos pelo framework Discord Commando
    //.registerDefaults() //cuidado, aqui vai ser utilizado os padrões, os padrões são em ingles e captura qualquer msg como se fosse comandos
    /*.registerDefaultCommands({
        help: false, 
        prefix: false, 
        ping: false,
        eval: false,
        unknownCommand: true, 
        commandState: true
        })*/

    // Aqui registra todos os comandos customizados no diretório ./comandos/
    .registerCommandsIn(path.join(__dirname, 'comandos'));

// tem que ser assim pra utilizar no Heroku
bot.login(process.env.BOT_TOKEN);