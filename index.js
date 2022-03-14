const { Game, WireObject } = require("@gathertown/gather-game-client");
global.WebSocket = require("isomorphic-ws");
const {
  storeID,
  discordToken,
  gatherAPI,
  guildID,
  channelID,
} = require("./config.json");

//instantiate Gather client, pass in SpaceID (new as of SDk V33.0.2)
var game = new Game(storeID, () => Promise.resolve({ apiKey: gatherAPI }));

//Require in the Discord wrapper
const { Client, Intents } = require("discord.js");

//Instantiate Discord Bot, give it way too many intents/privileges
const client = new Client({ intents: 32767 });
//Login Discord Bot
client.login(discordToken);
//Connect Gather Client
game.connect();
//Set Object equal to Gather's active players object
let object = game.players;

//Listen for the Discord Ready event
client.on("ready", () => {
  //Set guild equal to TestCave's guild ID
  const guild = client.guilds.cache.get(guildID);
  setInterval(() => {
    //Iterate through Gather's Player object, push all usernames to an array(x)
    let x = [];
    for (let key in object) {
      x.push(game.players[key].name);
    }
    //Define activePlayer count as the length of the array
    let activePlayers = x.length;

    //Define voice channel we'll be changing
    const channel = guild.channels.cache.get(channelID);
    //Set voicechannel name
    try {
      channel.setName(`Gather Online: ${activePlayers}`);
    } catch (error) {
      console.error(error);
    }
  }, 60000);
});
