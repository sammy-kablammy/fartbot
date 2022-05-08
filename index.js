
const token = require('./secret.json').BOT_TOKEN;
const { join } = require('node:path');
const { Client } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, generateDependencyReport, AudioPlayerStatus } = require('@discordjs/voice');

const client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES']
});

client.once('ready', () => console.log('bot is ready'));

client.on('messageCreate', message => {
    const content = message.content;
    console.log('message contents: ' + content);

    if (content == 'join') {
        const channel = message.member.voice.channel;
        console.log('attempting to join ' + message.member + ' in ' + channel);

        const player = createAudioPlayer();
        const resource = createAudioResource(join(__dirname, 'fart.mp3'))

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        player.play(resource);
        connection.subscribe(player);

        // player.on(AudioPlayerStatus.Idle, () => {
        //     connection.destroy();
        // });

    }

})

client.login(token);
// console.log(generateDependencyReport());