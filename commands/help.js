const Discord = require("discord.js");
const constants = require("./constants.json");
const rp = require('request-promise');
const cheerio = require('cheerio');

const url = 'https://ava-dog-tag.wikia.com/wiki/Category:Weapons';

module.exports.run = async (bot, message, args) => {
  // CODE HERE
  text = """```fix
-------------------------------------------------------------------------------------------
---------------------------------------Help Commands---------------------------------------
-------------------------------------------------------------------------------------------```
__**AVA Dog Tag commands:**__
```md
# .weapons
> Presents you a simple list of all the weapons available
# .weapon <weapon_name_here>
> Shows all the stats about the weapon you select
# .maps
> Presents you a simple list of all the maps available
# .map <map_name_here>
> Shows all the info about the map you select```"""
  message.author.send(text);
}

module.exports.help = {
  name: "help" // PLACE NAME HERE
}
