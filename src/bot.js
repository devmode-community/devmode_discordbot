const path = require('path');
const Discord = require('discord.js');
const btcValor = require('btc-value');
const Commando = require('discord.js-commando');
const channel_ids = require('./channel_ids.json');
const botconfig = require('./botconfig.json');

require('dotenv').config();
// Set the API key
btcValor.setApiKey(process.env.BTC_VALUE_API_KEY);

const { prefixo } = botconfig;

const bot = new Discord.Client();
const bot_comando = new Commando.Client({
  commandPrefix: prefixo,
  owner: '186519740863217664',
});

const devmodeserver_roles = {
  // areas
  developer: '732607336451014669',
  datascientist: '732607450204733621',
  devops: '732607609068060753',
  infra: '732607758980874290',
  uxui: '732613392912613378',
  coach: '732608475049230396',
  business: '732608526874312754',
  gestor: '732608722068701235',
  rh: '732608699218002010',
  // especialidades
  fullstack: '732607560221196340',
  mobile: '732610332950003835',
  backend: '732607499491868724',
  frontend: '732607536934682704',
  // linguagens
  java: '732607292951887993',
  javascript: '732607042304344095',
  python: '732607821333659729',
  ruby: '732612456014282762',
  php: '732612770679226521',
  dotnet: '732608002900754483',
  sap: '732608366266023957',
};

bot.on('ready', async () => {
  console.log(`${bot.user.username} is online`);
  console.log('Estou pronto!');
  // guild/servidor que o bot está(nesse caso DevMode)
  SERVER = bot.guilds.cache.get('475507684024516608');
  // console.log(bot.guilds.cache.get("475507684024516608"));
  // Setando a atividade do bot
  bot.user
    .setActivity('Star Wars', { type: 'WATCHING' })
    .then((presence) =>
      console.log(`Atividade setada para ${presence.activities[0].name}`)
    )
    .catch(console.error);
});

// evento em que o bot envia uma mensagem assim que um novo membro é adicionado ao servidor
bot.on('guildMemberAdd', (member) => {
  const channel = member.guild.channels.find(
    (c) => c.id === '475507684024516610'
  ); // ou c.name, nesse nosso caso, GERAL
  if (!channel) return;

  channel.send(`Bem vindo a Dev Mode, ${member}! :wave:`);
  channel.send(
    'Você pode adicionar roles digitando o comando como no exemplo: `' +
      '!addrole' +
      ' developer javascript fullstack`'
  );
});

// evento ativado quando o bot recebe uma mensagem
bot.on('message', async (message) => {
  const mensagemArray = message.content.split(' ');
  const comando = mensagemArray[0].toLowerCase();
  // let args = mensagemArray.slice(1);

  const args = message.content.slice(1).trim().split(/ +/g);
  const comando_com_arg = args.shift().toLowerCase();

  // moderar certas mensagens que contem palavras desrespeitosas
  const swearWords = ['nigga', 'puta'];
  if (swearWords.some((word) => message.content.includes(word))) {
    message.reply(`Mais respeito <@${message.author.id}>!!!`);
    message.delete().catch((e) => {});
  }

  if (message.author.bot) return;

  // em caso de mensagem privada(direct message)
  if (message.channel.type === 'dm') {
    // Necessário verificar se o user faz parte da comunidade no discord
    if (SERVER.member(message.author.id)) {
      // existe um membro do servidor/guild com essa ID
      // console.log('esse user faz parte da guild')
      // console.log(message.author.id)
      // mensagem para quem não é da comunidade e está enviando msg privada pro bot
      // TODO: embed richtext com contatos para inserir-se na comunidade
    } else {
      message.reply(
        'Desculpe, mas você não faz parte da comunidade Dev Mode de Campos :sob:'
      );
    }
    // fim da Direct Message(DM)
  }

  if (comando_com_arg === 'addrole') {
    if (args.length > 0) {
      for (var i = 0; i < args.length; i++) {
        for (var devmode_role in devmodeserver_roles) {
          if (devmode_role === args[i].toLowerCase()) {
            var server_role = SERVER.roles.cache.find(
              (role) => role.id === devmodeserver_roles[devmode_role]
            );
            message.member.roles.add(server_role);
          }
        }
      }
      message.reply('Roles adicionadas :]');
    } else {
      message.reply(
        'Por favor, providencie os argumentos necessários no formato exemplo: `' +
          '!addrole' +
          ' developer javascript fullstack`'
      );
    }
  }

  if (comando_com_arg === 'removerole') {
    if (args.length > 0) {
      for (var i = 0; i < args.length; i++) {
        for (var devmode_role in devmodeserver_roles) {
          if (devmode_role === args[i].toLowerCase()) {
            var server_role = SERVER.roles.cache.find(
              (role) => role.id === devmodeserver_roles[devmode_role]
            );
            server_role
              ? message.member.roles.remove(server_role)
              : message.reply(
                  `<@${message.author.id}> não possui a role ${devmode_role}`
                );
          }
        }
      }
      message.reply('Roles removidas :]');
    } else {
      message.reply(
        'Por favor, providencie os argumentos necessários no formato exemplo: `' +
          '!addrole' +
          ' developer javascript fullstack`'
      );
    }
  }

  if (comando === `${prefixo}ping`) {
    // WebSocketManager no client.ws.ping
    message.reply(
      'Pong! O ping do bot ao discord é `' + `${bot.ws.ping}` + ' ms`'
    );
    message.reply('O trafego é feito do user ao bot e do bot ao discord');
  }

  if (message.content == `${prefixo}btcdia`) {
    btcValor().then((value) => {
      btcValor.getPercentageChangeLastDay().then((percentage) => {
        const perc = percentage;
        if (perc > 0) {
          message.channel.send(`<@${message.author.id}>
                BTC: ${value}$ \nSubiu (ultimo dia): ${perc}% :hugging:`);
        } else if (perc < 0) {
          message.channel.send(`<@${message.author.id}>
                BTC: ${value}$ \nDesceu (ultimo dia): ${perc}% :sob:`);
        } else {
          message.channel.send(`<@${message.author.id}>
                BTC: ${value}$ \nManteve (ultimo dia): ${perc}% :rolling_eyes:`);
        }
      });
    });
  }

  if (message.content == `${prefixo}btcsemana`) {
    btcValor().then((value) => {
      btcValor.getPercentageChangeLastWeek().then((percentage) => {
        const perc = percentage;
        if (perc > 0) {
          message.channel.send(
            `BTC: ${value}$ \nSubiu (ultima semana): ${perc}% :hugging:`
          );
        } else if (perc < 0) {
          message.channel.send(
            `BTC: ${value}$ \nDesceu (ultima semana): ${perc}% :sob:`
          );
        } else {
          message.channel.send(
            `BTC: ${value}$ \nManteve (ultima semana): ${perc}% :rolling_eyes:`
          );
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
