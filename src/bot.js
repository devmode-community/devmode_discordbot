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

    let id_procurando_vagas = channel_ids.PROCURANDO_VAGAS;
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

            // capturar cadeia de respostas para montar a postagem dep rocura por vaga
            if (message.content == `work`) {
                message.reply(`Então está procurando trabalho? Vou te perguntar algumas coisas e responda corretamente ok?`);
                message.reply(`**Qual seu nome? (Max 128 chars)**`);
                message.reply(`Você pode cancelar a qualquer momento digitando cancelar`);
                // Primeiro argumento é uma função filter - que é feita de condições
                // m é um objeto 'Message'
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    {max: 1, time: 60000}).then(collected => {
                        if (collected.first().content.toLowerCase() === 'cancelar' ||
                            collected.first().content.toLowerCase() === '') {
                            message.reply('Operação cancelada');
                        }
                        // somente aceita mensagens do user que enviou o comando
                        // aceita somente 1 mensagem, e retorna uma promise depois de 60000ms = 60s

                        // first (e, nesse caso, somente) mensagem da collection
                        else {
                            let nome = collected.first().content;
                            message.reply('**Qual a sua área?(Front, Back, FullStack, UX/UI, DataScience, BA, etc**');
                            message.channel.awaitMessages(m => m.author.id == message.author.id,
                                {max: 1, time: 60000}).then(collected => {
                                    if (collected.first().content.toLowerCase() === 'cancelar' ||
                                        collected.first().content.toLowerCase() === '') {
                                        message.reply('Operação cancelada');
                                    }
                                    else {
                                        let area = collected.first().content;
                                        message.reply('**Descreva suas skills e o tipo de trabalho que está procurando. (Max 1024 chars)**');
                                        message.channel.awaitMessages(m => m.author.id == message.author.id,
                                            {max: 1, time: 60000}).then(collected => {
                                                if (collected.first().content.toLowerCase() === 'cancelar' ||
                                                    collected.first().content.toLowerCase() === '') {
                                                    message.reply('Operação cancelada');
                                                }
                                                else {
                                                    let skills = collected.first().content;
                                                    message.reply(`**Favor adicione um link para seu portfolio.**`);
                                                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                                                        {max: 1, time: 60000}).then(collected => {
                                                            if (collected.first().content.toLowerCase() === 'cancelar' ||
                                                                collected.first().content.toLowerCase() === '') {
                                                                message.reply('Operação cancelada');
                                                            }
                                                            else {
                                                                let link = collected.first().content;
                                                                message.reply(`**Como as partes interessadas podem contactar você?**`);
                                                                message.channel.awaitMessages(m => m.author.id == message.author.id,
                                                                    {max: 1, time: 60000}).then(collected => {
                                                                        if (collected.first().content.toLowerCase() === 'cancelar' ||
                                                                            collected.first().content.toLowerCase() === '') {
                                                                            message.reply('Operação cancelada');
                                                                        }
                                                                        else {
                                                                            let contato = collected.first().content;
                                                                            procurador = { nome, area, skills, link, contato }
                                                                            if (["http://", "https://", "www"].indexOf(procurador.link) > -1) {
                                                                                urlformatado = procurador.link;
                                                                            } else {
                                                                                //TODO RegEX
                                                                                urlformatado = 'https://'.concat(procurador.link);
                                                                            }
                                                                            const embed = {
                                                                                color: 0x0099ff,
                                                                                title: procurador.nome,
                                                                                //url: procurador.link,
                                                                                author: {
                                                                                    name: 'Olá, estou procurando oportunidades!',
                                                                                    icon_url: 'https://i.imgur.com/wSTFkRM.png',
                                                                                },
                                                                                description: '**'+procurador.area+'**',
                                                                                fields: [
                                                                                    {
                                                                                        name: 'Habilidades',
                                                                                        value: procurador.skills,
                                                                                    },
                                                                                    /*{
                                                                                        name: '\u200b',
                                                                                        value: '\u200b',
                                                                                        inline: false,
                                                                                    },*/
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
                                                                                    text: '© Dev Mode',},
                                                                            };
                                                                            message.reply(`Solicitado por: <@${message.author.id}>`)
                                                                            message.reply({ embed: embed });
                                                                            message.reply('As informações acima foram enviadas para o canal de texto #procurando-vagas da comunidade Dev Mode!');
                                                                            bot.channels.cache.get(id_procurando_vagas).send(`Solicitado por: <@${message.author.id}>`)
                                                                            bot.channels.cache.get(id_procurando_vagas).send({ embed: embed })
                                                                        }
                                                                    }).catch(err => {console.log(err)});
                                                            }
                                                        }).catch(err => {console.log(err)});
                                                }
                                            }).catch(err => {console.log(err)});
                                    }
                                }).catch(err => {console.log(err)});
                        }
                    }).catch( err => {
                        console.log(err)
                        message.reply('Nenhuma resposta depois de 60s ou resposta invalida, operação cancelada.');
                    });
            }


        // mensagem para quem não é da comunidade e está enviando msg privada pro bot
        // TODO: embed richtext com contatos para inserir-se na comunidade
        } else { 
            message.reply('Desculpe, mas você não faz parte da comunidade Dev Mode de Campos :sob:');
        }
    // fim da Direct Message(DM)    
    };
  	
  	if (comando === `${prefixo}oi`){
  	    return message.channel.send('Eae');
  	}
  	if (comando === `${prefixo}ping`){
  	    //return message.reply('pong');
  	    return message.channel.send('pong');
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

// habilitando framework de comandos se o bot for apenas de comandos
bot_comando.login(process.env.BOT_TOKEN);
bot_comando.registry
    // Registers your custom command groups
    .registerGroups([
        ['rolardados', 'Rolardados'],
    ])

    // Registra todos os grupos, comandos e tipos de argumentos pré-construidos pelo framework Discord Commando
    //.registerDefaults() //cuidado, aqui vai ser utilizado os padrões, os padrões são em ingles e captura qualquer msg como se fosse comandos

    // Aqui registra todos os comandos customizados no diretório ./comandos/
    .registerCommandsIn(path.join(__dirname, 'comandos'));

// tem que ser assim pra utilizar no Heroku
bot.login(process.env.BOT_TOKEN);