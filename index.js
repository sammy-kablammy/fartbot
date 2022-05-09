const token = require('./secret.json').BOT_TOKEN;
const { join } = require('node:path');
const { Client } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, generateDependencyReport, getVoiceConnection } = require('@discordjs/voice');

// maximum and minimum intervals (in seconds) between farts, respectively
const MAX_INTERVAL = 600; // default: 600
const MIN_INTERVAL = 30; // default: 30

const client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES']
});

client.once('ready', () => console.log('bot is ready'));

client.on('messageCreate', message => {
    const content = message.content.toLowerCase();

    if (content == 'prepare your butts') {
        // join voice channel
        const channel = message.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
    }
    else if (content == 'unleash the farts') {
        // begin farting
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            const player = createAudioPlayer();
            const resource = createAudioResource(join(__dirname, 'fart.mp3'))
            player.play(resource);
            connection.subscribe(player);

            let randomInterval = Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL) * 1000;
            console.log('randomInterval is ' + randomInterval);
            setTimeout(() => {
                client.emit('messageCreate', message); // run it back
            }, randomInterval);
        }
    }
    else if (content == 'stop farting') {
        // leave voice channel
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            connection.destroy();
        }
    }

});

client.login(token);
// console.log(generateDependencyReport());