const commando = require('discord.js-commando');
const channel_ids = require('../../channel_ids.json');

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

  // bloco em que roda o comando cada vez que for digitado
  async run(message, args) {
    const id_procurando_vagas = channel_ids.PROCURANDO_VAGAS;
    // em caso de mensagem privada(direct message)
    if (message.channel.type === 'dm') {
      // Necessário verificar se o user faz parte da comunidade no discord
      if (SERVER.member(message.author.id)) {
        // capturar cadeia de respostas para montar a postagem dep rocura por vaga

        message.reply(
          'Então está procurando trabalho? Vou te perguntar algumas coisas e responda corretamente ok?'
        );
        message.reply('**Qual seu nome? (Max 128 chars)**');
        message.reply(
          'Você pode cancelar a qualquer momento digitando `' + 'cancelar`'
        );
        // Primeiro argumento é uma função filter - que é feita de condições
        // m é um objeto 'Message'
        message.channel
          .awaitMessages((m) => m.author.id == message.author.id, {
            max: 1,
            time: 60000,
          })
          .then((collected) => {
            if (
              collected.first().content.toLowerCase() === 'cancelar' ||
              collected.first().content.toLowerCase() === ''
            ) {
              message.reply('Operação cancelada');
            }
            // somente aceita mensagens do user que enviou o comando
            // aceita somente 1 mensagem, e retorna uma promise depois de 60000ms = 60s

            // first (e, nesse caso, somente) mensagem da collection
            else {
              const nome = collected.first().content;
              message.reply(
                '**Qual a sua área?(Front, Back, FullStack, UX/UI, DataScience, BA, etc**'
              );
              message.channel
                .awaitMessages((m) => m.author.id == message.author.id, {
                  max: 1,
                  time: 60000,
                })
                .then((collected) => {
                  if (
                    collected.first().content.toLowerCase() === 'cancelar' ||
                    collected.first().content.toLowerCase() === ''
                  ) {
                    message.reply('Operação cancelada');
                  } else {
                    const area = collected.first().content;
                    message.reply(
                      '**Descreva suas skills e o tipo de trabalho que está procurando. (Max 1024 chars)**'
                    );
                    message.channel
                      .awaitMessages((m) => m.author.id == message.author.id, {
                        max: 1,
                        time: 60000,
                      })
                      .then((collected) => {
                        if (
                          collected.first().content.toLowerCase() ===
                            'cancelar' ||
                          collected.first().content.toLowerCase() === ''
                        ) {
                          message.reply('Operação cancelada');
                        } else {
                          const skills = collected.first().content;
                          message.reply(
                            '**Favor adicione um link para seu portfolio.**'
                          );
                          message.channel
                            .awaitMessages(
                              (m) => m.author.id == message.author.id,
                              {
                                max: 1,
                                time: 60000,
                              }
                            )
                            .then((collected) => {
                              if (
                                collected.first().content.toLowerCase() ===
                                  'cancelar' ||
                                collected.first().content.toLowerCase() === ''
                              ) {
                                message.reply('Operação cancelada');
                              } else {
                                const link = collected.first().content;
                                message.reply(
                                  '**Como as partes interessadas podem contactar você?**'
                                );
                                message.channel
                                  .awaitMessages(
                                    (m) => m.author.id == message.author.id,
                                    {
                                      max: 1,
                                      time: 60000,
                                    }
                                  )
                                  .then((collected) => {
                                    if (
                                      collected
                                        .first()
                                        .content.toLowerCase() === 'cancelar' ||
                                      collected
                                        .first()
                                        .content.toLowerCase() === ''
                                    ) {
                                      message.reply('Operação cancelada');
                                    } else {
                                      const contato = collected.first().content;
                                      const procurador = {
                                        nome,
                                        area,
                                        skills,
                                        link,
                                        contato,
                                      };
                                      let urlformatado = procurador.link;
                                      if (
                                        ['http://', 'https://', 'www'].indexOf(
                                          procurador.link
                                        ) > -1
                                      ) {
                                        urlformatado = procurador.link;
                                      } else {
                                        // TODO RegEX
                                        urlformatado = 'https://'.concat(
                                          procurador.link
                                        );
                                      }
                                      const embed = {
                                        color: 0x0099ff,
                                        title: procurador.nome,
                                        // url: procurador.link,
                                        author: {
                                          name:
                                            'Olá, estou procurando oportunidades!',
                                          icon_url:
                                            'https://i.imgur.com/wSTFkRM.png',
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
                                      message.reply(
                                        `Solicitado por: <@${message.author.id}>`
                                      );
                                      message.reply({
                                        embed,
                                      });
                                      message.reply(
                                        'As informações acima foram enviadas para o canal de texto #procurando-vagas da comunidade Dev Mode!'
                                      );
                                      this.client.channels.cache
                                        .get(id_procurando_vagas)
                                        .send(
                                          `Solicitado por: <@${message.author.id}>`
                                        );
                                      this.client.channels.cache
                                        .get(id_procurando_vagas)
                                        .send({
                                          embed,
                                        });
                                    }
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              }
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
            message.reply(
              'Nenhuma resposta depois de 60s ou resposta invalida, operação cancelada.'
            );
          });

        // mensagem para quem não é da comunidade e está enviando msg privada pro bot
        // TODO: embed richtext com contatos para inserir-se na comunidade
        // TODO: Refactor, essa mensagem vai ser repedita sempre que tiver um comando novo...
      } else {
        message.reply(
          'Desculpe, mas você não faz parte da comunidade Dev Mode de Campos :sob:'
        );
      }
    }
  }
}

module.exports = RolarDadosComando;
