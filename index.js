const token = require("./secret.json").BOT_TOKEN;
const { join } = require("node:path");
const { Client } = require("discord.js");
const {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	getVoiceConnection,
} = require("@discordjs/voice");

// maximum and minimum intervals (in seconds) between farts, respectively
const MAX_INTERVAL = 600; // default: 600
const MIN_INTERVAL = 10; // default: 10

const client = new Client({
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

client.once("ready", () => console.log("bot is ready"));

client.on("messageCreate", (message) => {
	const content = message.content.toLowerCase();

	if (content == "prepare your butts") {
		// join voice channel
		const channel = message.member.voice.channel;
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});
	} else if (content == "unleash the farts") {
		// begin farting
		const connection = getVoiceConnection(message.guild.id);
		if (connection) {
			const player = createAudioPlayer();
			let fartType;
			let volume;
			if (Math.floor(Math.random() * 100) < 5) {
				fartType = "longfart.mp3";
				volume = 0.75;
			} else {
				fartType = "fart.mp3";
				volume = 1.0;
			}
			const resource = createAudioResource(join(__dirname, fartType), {
				inlineVolume: true,
			});
			resource.volume.setVolume(volume);
			player.play(resource);
			connection.subscribe(player);
			let randomInterval =
				Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL) * 1000;
			const date = new Date();
			let currentTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			date.setMilliseconds(date.getMilliseconds() + randomInterval);
			let nextFart = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			console.log(`Current time is ${currentTime} and the next fart will be at ${nextFart}`);
			setTimeout(() => {
				client.emit("messageCreate", message); // run it back
			}, randomInterval);
		}
	} else if (content == "stop farting") {
		// leave voice channel
		const connection = getVoiceConnection(message.guild.id);
		if (connection) {
			connection.destroy();
		}
	}
});

client.login(token);
