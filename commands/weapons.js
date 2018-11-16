const Discord = require('discord.js');
const constants = require("./constants.json");
const rp = require('request-promise');
const cheerio = require('cheerio');

const url = 'https://ava-dog-tag.wikia.com/wiki/Category:';

module.exports.run = async (client, message, args) => {

  var data = [];
  var links = [];

  categories = constants.weapon_categories;
  message.channel.send('Getting weapons...')
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
          var content = $('.category-page__members').find('a').each(function(i,elem) {
            //text += $(this).text()+'\n'
            text += '['+$(this).text()+'](https://ava-dog-tag.wikia.com'+$(this).attr('href')+')\n'
            text2 += 'https://ava-dog-tag.wikia.com'+$(this).attr('href')+'\n';
          });
          data[i] = text;
          links[i] = text2;
        })
        .catch(function (err) {
          console.log(err);
        });
      }

      msg.edit('Found them!\nYou won\'t be able to change pages after 1 minute.');
      let category_pages = categories;
      let pages = 1;

      let page = 1;
      let category_page = 1;
      const max_per_page = 5;
      const max_time_ms = 60000;

      const embed = new Discord.RichEmbed()
        .setColor(0xffffff)
        .setTitle('**'+category_pages[category_page-1]+'**')
        .setURL(url+category_pages[category_page-1])

        weapons = data[category_page-1].split('\n')
        weapons.pop()
        pages = Math.ceil(weapons.length/5)
        if(weapons.length > 5){
          embed.setDescription(weapons.slice(0,5).join('\n'))
        }
        else{
          embed.setDescription(weapons.join('\n'))
        }
        embed.setFooter(`Page ${page} of ${pages} - ${category_pages[category_page-1]}`)
      message.channel.send(embed).then(async msg => {
        const pointman_icon = await client.emojis.get("454611806804246528");
        const rifleman_icon = await client.emojis.get("454611807202705408");
        const sniper_icon = await client.emojis.get("454611807059968013");
        await msg.react('◀')
        await msg.react('▶')
        await msg.react(pointman_icon.id)
        await msg.react(rifleman_icon.id)
        await msg.react(sniper_icon.id)
        await msg.react('🔫')
        await msg.react('🔪')

          const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
          const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
          const PointmanFilter = (reaction, user) => reaction.emoji.id === pointman_icon.id && user.id === message.author.id;
          const RiflemanFilter = (reaction, user) => reaction.emoji.id === rifleman_icon.id && user.id === message.author.id;
          const SniperFilter = (reaction, user) => reaction.emoji.id === sniper_icon.id && user.id === message.author.id;
          const SecondaryFilter = (reaction, user) => reaction.emoji.name === '🔫' && user.id === message.author.id;
          const MeleeFilter = (reaction, user) => reaction.emoji.name === '🔪' && user.id === message.author.id;

          const backwards = msg.createReactionCollector(backwardsFilter, { time: max_time_ms });
          const forwards = msg.createReactionCollector(forwardsFilter, { time: max_time_ms });
          const Pointman = msg.createReactionCollector(PointmanFilter, { time: max_time_ms });
          const Rifleman = msg.createReactionCollector(RiflemanFilter, { time: max_time_ms });
          const Sniper = msg.createReactionCollector(SniperFilter, { time: max_time_ms });
          const Secondary = msg.createReactionCollector(SecondaryFilter, { time: max_time_ms });
          const Melee = msg.createReactionCollector(MeleeFilter, { time: max_time_ms });

          backwards.on('collect', r => {
            if(page === 1) return;
            page--;
            lower = (page-1)*max_per_page;
            higher = page*max_per_page;
            embed.setDescription(weapons.slice(lower,higher))
            embed.setFooter(`Page ${page} of ${pages} - ${category_pages[category_page-1]}`)
            msg.edit(embed);
          })

          forwards.on('collect', r => {
            if(page === pages) return;
            page++;
            lower = (page-1)*max_per_page;
            higher = page*max_per_page;
            embed.setDescription(weapons.slice(lower,higher))
            embed.setFooter(`Page ${page} of ${pages} - ${category_pages[category_page-1]}`)
            msg.edit(embed);
          })

          Pointman.on('collect', r => {
            if(category_page === 1) return;
            page = 1;
            category_page = 1;
            embed.setTitle('**'+category_pages[category_page-1]+'**')
            embed.setURL(url+category_pages[page-1])
            weapons = data[category_page-1].split('\n')
            weapons.pop()
            pages = Math.ceil(weapons.length/max_per_page)
            embed.setDescription(weapons.slice(0,max_per_page).join('\n'))
            embed.setFooter(`Page ${page} of ${pages} - ${category_pages[category_page-1]}`)
            msg.edit(embed);
          })

          Rifleman.on('collect', r => {
            if(category_page === 2) return;
            page = 1;
            category_page = 2;
            embed.setTitle('**'+category_pages[category_page-1]+'**')
            embed.setURL(url+category_pages[page-1])
            weapons = data[category_page-1].split('\n')
            weapons.pop()
            pages = Math.ceil(weapons.length/max_per_page)
            embed.setDescription(weapons.slice(0,max_per_page).join('\n'))
            embed.setFooter(`Page ${page} of ${pages} - ${category_pages[category_page-1]}`)
            msg.edit(embed);
          })

          Sniper.on('collect', r => {
            if(category_page === 3) return;
            page = 1;
            category_page = 3;
            embed.setTitle('**'+category_pages[category_page-1]+'**')
            embed.setURL(url+category_pages[page-1])
            weapons = data[category_page-1].split('\n')
            weapons.pop()
            pages = Math.ceil(weapons.length/max_per_page)
            embed.setDescription(weapons.slice(0,max_per_page).join('\n'))
            embed.setFooter(`Page ${page} of ${pages} - ${category_pages[category_page-1]}`)
            msg.edit(embed);
          })

          Secondary.on('collect', r => {
            if(category_page === 4) return;
            page = 1;
            category_page = 4;
            embed.setTitle('**'+category_pages[category_page-1]+'**')
            embed.setURL(url+category_pages[page-1])
            weapons = data[category_page-1].split('\n')
            weapons.pop()
            pages = Math.ceil(weapons.length/max_per_page)
            embed.setDescription(weapons.slice(0,max_per_page).join('\n'))
            embed.setFooter(`Page ${page} of ${pages} - ${category_pages[category_page-1]}`)
            msg.edit(embed);
          })

          Melee.on('collect', r => {
            if(category_page === 5) return;
            page = 1;
            category_page = 5;
            embed.setTitle('**'+category_pages[category_page-1]+'**')
            embed.setURL(url+category_pages[page-1])
            weapons = data[category_page-1].split('\n')
            weapons.pop()
            pages = Math.ceil(weapons.length/max_per_page)
            embed.setDescription(weapons.slice(0,max_per_page).join('\n'))
            embed.setFooter(`Page ${page} of ${pages} - ${category_pages[category_page-1]}`)
            msg.edit(embed);
          })
        setTimeout(function(){ msg.clearReactions() }, max_time_ms);
      })
      setTimeout(function(){ msg.delete() }, max_time_ms);
    });

  // outside RichEmbed ⏪ ⏩ 🕸 🦂 🍃 ♠ ♥ ♦ ♣
  // <:pointman:454611806804246528> <:rifleman:454611807202705408> <:sniper:454611807059968013> 🔫


}

module.exports.help = {
  name: "weapons"
}
