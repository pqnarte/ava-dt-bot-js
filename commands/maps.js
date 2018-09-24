const Discord = require('discord.js');
const constants = require("./constants.json");
const rp = require('request-promise');
const cheerio = require('cheerio');

const url = 'https://ava-dog-tag.wikia.com/wiki/Category:';

module.exports.run = async (client, message, args) => {

  var data = [];
  var links = [];

  categories = constants.map_categories;
  message.channel.send('Getting maps...')
  .then(async msg => {
    for (var i = 0; i < categories.length; i++){
      const options = {
        uri: url+categories[i],
        transform: function (body) {
          return cheerio.load(body);
        }
      };
      await rp(options)
        .then(($) => {
          text = "";
          text2 = "";
          var j = 0;
          var content = $('.mw-content-ltr').find('li').each(function(i,elem) {
            text += $(this).text()+'\n'
            text2 += '#https://ava-dog-tag.wikia.com'+$(this).children().attr('href')+'\n';
          });
          data[i] = text;
          links[i] = text2;
        })
        .catch(function (err) {
          console.log(err);
        });
      }

      msg.edit('Found them!\nYou won\'t be able to change pages after 1 minute.');
      let pages = categories;
      let page = 1;
      const max_time_ms = 60000;

      const embed = new Discord.RichEmbed()
        .setColor(0xffffff)
        .setTitle('**'+pages[page-1]+'**')
        .setURL(url+pages[page-1])
        maps = data[page-1].split('\n')
        maps.pop()
        embed.setDescription(maps.join('\n'))
        embed.setFooter(`Page ${page} of ${pages.length}`)
      message.channel.send(embed).then(msg => {

        msg.react('◀').then( r => {
          msg.react('▶').then( r => {

          const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
          const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

          const backwards = msg.createReactionCollector(backwardsFilter, { time: max_time_ms });
          const forwards = msg.createReactionCollector(forwardsFilter, { time: max_time_ms });

          backwards.on('collect', r => {
            if(page === 1) return;
            page--;
            maps = data[page-1].split('\n')
            maps.pop()
            embed.setDescription(maps.join('\n'))
            embed.setFooter(`Page ${page} of ${pages.length}`)
            embed.setTitle('**'+pages[page-1]+'**')
            msg.edit(embed);
          })

          forwards.on('collect', r => {
            if(page === pages) return;
            page++;
            maps = data[page-1].split('\n')
            maps.pop()
            embed.setDescription(maps.join('\n'))
            embed.setFooter(`Page ${page} of ${pages.length}`)
            embed.setTitle('**'+pages[page-1]+'**')
            msg.edit(embed);
          })



        })});
        setTimeout(function(){ msg.clearReactions() }, max_time_ms);
      })
      setTimeout(function(){ msg.delete() }, max_time_ms);
    });

  // outside RichEmbed ⏪ ⏩ 🕸 🦂 🍃 ♠ ♥ ♦ ♣


}

module.exports.help = {
  name: "maps"
}
