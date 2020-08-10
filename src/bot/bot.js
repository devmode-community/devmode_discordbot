const path = require('path');
const Discord = require('discord.js');
const btcValor = require('btc-value');
const Commando = require('discord.js-commando');

const botconfig = require('./schemas/botconfig.json');

const { prefixo } = botconfig;

const result = require('dotenv').config();

//verificar se existe erros no env
if (result.error) {
  throw result.error;
}

// Set the API key
btcValor.setApiKey(process.env.BTC_VALUE_API_KEY);

const bot = new Discord.Client();
const bot_comando = new Commando.Client({
  commandPrefix: prefixo,
  owner: '186519740863217664',
});

const bot_controller = require('./bot_actions')(bot, btcValor);

bot.on('ready', bot_controller.onReady);

// evento em que o bot envia uma mensagem assim que um novo membro é adicionado ao servidor
bot.on('guildMemberAdd', bot_controller.onMemberAdd);

// evento ativado quando o bot recebe uma mensagem
bot.on('message', bot_controller.onMessage);

// habilitando framework de comandos
bot_comando.login(process.env.BOT_TOKEN);

bot_comando.registry
  // Registers your custom command groups
  .registerGroups([
    ['rolardados', 'Rolardados'],
    ['procurarvaga', 'Procurarvaga'],
  ])
  // Registra todos os grupos, comandos e tipos de argumentos pré-construidos pelo framework Discord Commando
  // .registerDefaults() //cuidado, aqui vai ser utilizado os padrões, os padrões são em ingles e captura qualquer msg como se fosse comandos
  /* .registerDefaultCommands({
                    help: false,
                    prefix: false,
                    ping: false,
                    eval: false,
                    unknownCommand: true,
                    commandState: true
                    }) */

  // Aqui registra todos os comandos customizados no diretório ./comandos/
  .registerCommandsIn(path.join(__dirname, 'comandos'));

// tem que ser assim pra utilizar no Heroku
bot.login(process.env.BOT_TOKEN);
