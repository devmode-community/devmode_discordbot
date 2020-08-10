var SERVER = null;
const GUILD_SERVIDOR = '475507684024516608';
const GENERAL_CHANNEL = '475507684024516610';
const swearWords = ['nigga', 'puta'];

const ARGUMENTS_FALLBACK =
  'Por favor, providencie os argumentos necessários no formato exemplo: `' +
  '!addrole' +
  ' developer javascript fullstack`';

// import devmodeserver_roles from './const/devmodeserver_roles';
const devmodeserver_roles = require('./const/devmodeserver_roles')

module.exports = function (bot, btcValor) {
  return {
    getServer: () => {
        return SERVER;
    },
    _getRoles: (args) =>
      new Promise((resolve, reject) => {
        try {
          if (args.length > 0) {
            let output = [];
            for (var i = 0; i < args.length; i++) {
              for (var devmode_role in devmodeserver_roles) {
                if (devmode_role === args[i].toLowerCase()) {
                  const server_role = SERVER.roles.cache.find(
                    (role) => role.id === devmodeserver_roles[devmode_role]
                  );
                  output.push(server_role);
                }
              }
            }
            resolve(output);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.log(error);
          resolve(null);
        }
      }),
    onReady: async () => {
      try {
        console.log(`${bot.user.username} is online`);
        console.log('Estou pronto!');
        // guild/servidor que o bot está(nesse caso DevMode)
        SERVER = bot.guilds.cache.get(GUILD_SERVIDOR);
        // Setando a atividade do bot
        const presence = await bot.user.setActivity('Star Wars', {
          type: 'WATCHING',
        });
        console.log(`Atividade setada para ${presence.activities[0].name}`);
      } catch (error) {
        console.error(error);
      }
    },
    onMemberAdd: async (member) => {
      const channel = member.guild.channels.find(
        (channels) => channels.id === GENERAL_CHANNEL
      );
      if (!channel) return;
      channel.send(`Bem vindo a Dev Mode, ${member}! :wave:`);
      channel.send(
        'Você pode adicionar roles digitando o comando como no exemplo: `' +
          '!addrole' +
          ' developer javascript fullstack`'
      );
    },
    onMessage: async (message) => {
      const mensagemArray = message.content.split(' ');
      if (mensagemArray.length) return;
      const comando = mensagemArray[0].toLowerCase();
      // moderar certas mensagens que contem palavras desrespeitosas
      if (swearWords.some((word) => message.content.includes(word))) {
        message.reply(`Mais respeito <@${message.author.id}>!!!`);
        message.delete().catch((e) => {});
      }
      if (message.author.bot) return;

      switch (message.channel.type) {
        case 'dm':
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
          break;
        case 'addrole':
          const server_role = await this._getRoles(args);
          if (server_role) {
            server_role.forEach((role) => {
              message.member.roles.add(role);
            });
            message.reply('Roles adicionadas :]');
          } else {
            message.reply(ARGUMENTS_FALLBACK);
          }
          break;
        case 'removerole':
          const server_role_remove = await this._getRoles(args);
          if (server_role_remove) {
            server_role_remove.forEach((role) => {
              server_role_remove
                ? message.member.roles.remove(server_role_remove)
                : message.reply(
                    `<@${message.author.id}> não possui a role ${devmode_role}`
                  );
            });
          } else {
            message.reply(ARGUMENTS_FALLBACK);
          }
          break;
      }

      if (comando === `${prefixo}ping`) {
        // WebSocketManager no client.ws.ping
        message.reply(
          'Pong! O ping do bot ao discord é `' + `${bot.ws.ping}` + ' ms`'
        );
        message.reply('O trafego é feito do user ao bot e do bot ao discord');
      }

      if (message.content == `${prefixo}btcdia`) {
        const btcValorAsync = btcValor();
        const percentageAsync = btcValor.getPercentageChangeLastDay();
        Promise.all([btcValorAsync, percentageAsync])
          .then((data) => {
            const value = data[0];
            const percentage = data[1];
            if (percentage > 0) {
              message.channel.send(`<@${message.author.id}>
                      BTC: ${value}$ \nSubiu (ultimo dia): ${percentage}% :hugging:`);
            } else if (percentage < 0) {
              message.channel.send(`<@${message.author.id}>
                      BTC: ${value}$ \nDesceu (ultimo dia): ${percentage}% :sob:`);
            } else {
              message.channel.send(`<@${message.author.id}>
                      BTC: ${value}$ \nManteve (ultimo dia): ${percentage}% :rolling_eyes:`);
            }
          })
          .catch(console.error);
      }

      if (message.content == `${prefixo}btcsemana`) {
        const btcValorAsync = btcValor();
        const percentageAsync = btcValor.getPercentageChangeLastWeek();
        Promise.all([btcValorAsync, percentageAsync])
          .then((data) => {
            const value = data[0];
            const percentage = data[1];
            if (percentage > 0) {
              message.channel.send(
                `BTC: ${value}$ \nSubiu (ultima semana): ${percentage}% :hugging:`
              );
            } else if (percentage < 0) {
              message.channel.send(
                `BTC: ${value}$ \nDesceu (ultima semana): ${percentage}% :sob:`
              );
            } else {
              message.channel.send(
                `BTC: ${value}$ \nManteve (ultima semana): ${percentage}% :rolling_eyes:`
              );
            }
          })
          .catch(console.error);
      }
    },
  };
}
