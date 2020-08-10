const commando = require('discord.js-commando');
const channel_ids = require('../../schemas/channel_ids.json');

class RolarDadosComando extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'work',
      group: 'procurarvaga',
      memberName: 'work',
      description:
        'Montar uma apresentação resumida informando a procura por emprego',
    });
  }

  checkCancelar(collected) {
    if (
      collected.first().content.toLowerCase() === 'cancelar' ||
      collected.first().content.toLowerCase() === ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  createEmbed(procurador) {
    let urlformatado = procurador.link;
    if (['http://', 'https://', 'www'].indexOf(procurador.link) > -1) {
      urlformatado = procurador.link;
    } else {
      // TODO RegEX
      urlformatado = 'https://'.concat(procurador.link);
    }
    return {
      color: 0x0099ff,
      title: procurador.nome,
      // url: procurador.link,
      author: {
        name: 'Olá, estou procurando oportunidades!',
        icon_url: 'https://i.imgur.com/wSTFkRM.png',
      },
      description: `**${procurador.area}**`,
      fields: [
        {
          name: 'Habilidades',
          value: procurador.skills,
        },
        /* {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        }, */
        {
          name: 'Portifólio',
          value: urlformatado,
          inline: true,
        },
        {
          name: 'Contato',
          value: procurador.contato,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: '© Dev Mode',
      },
    };
  }

  async getAuthorMessage(message) {
    try {
      // Primeiro argumento é uma função filter - que é feita de condições
      // msg é um objeto 'Message'
      return await message.channel.awaitMessages(
        (msg) => msg.author.id == message.author.id,
        {
          max: 1,
          time: 60000,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  // bloco em que roda o comando cada vez que for digitado
  async run(message, args) {
    const id_procurando_vagas = channel_ids.PROCURANDO_VAGAS;
    // em caso de mensagem privada(direct message)
    if (message.channel.type === 'dm') {
      // Necessário verificar se o user faz parte da comunidade no discord
      if (SERVER.member(message.author.id)) {
        // capturar cadeia de respostas para montar a postagem dep rocura por vaga
        [
          'Então está procurando trabalho? Vou te perguntar algumas coisas e responda corretamente ok?',
          '**Qual seu nome? (Max 128 chars)**',
          'Você pode cancelar a qualquer momento digitando `' + 'cancelar`',
        ].forEach((msg) => {
          message.reply(msg);
        });
        try {
          const collected_1 = await this.getAuthorMessage(message);

          if (this.checkCancelar(collected_1)) {
            message.reply('Operação cancelada');
          }

          // somente aceita mensagens do user que enviou o comando
          // aceita somente 1 mensagem, e retorna uma promise depois de 60000ms = 60s
          const nome = collected_1.first().content;
          message.reply(
            '**Qual a sua área?(Front, Back, FullStack, UX/UI, DataScience, BA, etc**'
          );
          //pega mensagem do usuário
          const collected_2 = await this.getAuthorMessage(message);

          if (this.checkCancelar(collected_2)) {
            message.reply('Operação cancelada');
          }

          const area = collected_2.first().content;
          message.reply(
            '**Descreva suas skills e o tipo de trabalho que está procurando. (Max 1024 chars)**'
          );
          //pega mensagem do usuário
          const collected_3 = await this.getAuthorMessage(message);

          if (this.checkCancelar(collected_3)) {
            message.reply('Operação cancelada');
          }

          const skills = collected_3.first().content;
          message.reply('**Favor adicione um link para seu portfolio.**');

          //pega mensagem do usuário
          const collected_4 = await this.getAuthorMessage(message);

          if (this.checkCancelar(collected_4)) {
            message.reply('Operação cancelada');
          }

          const link = collected_4.first().content;
          message.reply(
            '**Como as partes interessadas podem contactar você?**'
          );

          //pega mensagem do usuário
          const collected_5 = await this.getAuthorMessage(message);

          if (this.checkCancelar(collected_5)) {
            message.reply('Operação cancelada');
          }

          const contato = collected_5.first().content;
          const procurador = {
            nome,
            area,
            skills,
            link,
            contato,
          };
          const embed = this.createEmbed(procurador);
          message.reply(`Solicitado por: <@${message.author.id}>`);
          message.reply({
            embed,
          });
          message.reply(
            'As informações acima foram enviadas para o canal de texto #procurando-vagas da comunidade Dev Mode!'
          );

          this.client.channels.cache
            .get(id_procurando_vagas)
            .send(`Solicitado por: <@${message.author.id}>`);
          this.client.channels.cache.get(id_procurando_vagas).send({
            embed,
          });
        } catch (error) {
          console.log(err);
          message.reply(
            'Nenhuma resposta depois de 60s ou resposta invalida, operação cancelada.'
          );
        }
      } else {
        message.reply(
          'Desculpe, mas você não faz parte da comunidade Dev Mode de Campos :sob:'
        );
      }
    }
  }
}

module.exports = RolarDadosComando;
