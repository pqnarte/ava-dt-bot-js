const Discord = require("discord.js");
const constants = require("./constants.json");
const rp = require('request-promise');
const cheerio = require('cheerio');

const url = 'https://ava-dog-tag.wikia.com/wiki/Category:Weapons';

module.exports.run = async (bot, message, args) => {
  const max_time_ms = 30000;
  if (args.length <= 0){
    message.channel.send("You need the weapon name!").then(msg => {
      setTimeout(function(){ msg.delete() }, max_time_ms);
      return;
    })
  }
  else {
    var data = [];
    var links = [];
    const options = {
      uri: url,
      transform: function (body) {
        return cheerio.load(body);
      }
    };
    await rp(options)
      .then(($) => {
        var j = 0;
        var content = $('.category-page__members').find('a').each(function(i,elem) {
          if ($(this).text().toUpperCase().includes(args.join(' ').toUpperCase())){
          data.push($(this).text())
          links.push('https://ava-dog-tag.wikia.com'+$(this).attr('href'));}
        });
      })
      .catch(function (err) {
        console.log(err);
      });
      if (data.length > 1){
        message.channel.send("Found several weapons! Choose one!").then(async msg => {
          text = "";
          for (var i = 0; i < data.length ; i++){
            text += `(${i+1}) => ${data[i]}\n`
          }
          message.channel.send(text)
          var number = 0;
          const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
          collector.on('collect', async msg => {
            try{
              number = parseInt(msg.content,10);
              if(number == 'NaN'){
                message.channel.send("That's not a number!")
                collector.stop('NaN')
              }
              else if(number < 1 || number > data.length){
                message.channel.send("Number out of bounds!")
                collector.stop('out of bounds')
              }
              else {
                const options = {
                  uri: links[number-1],
                  transform: function (body) {
                    return cheerio.load(body);
                  }
                };
                await rp(options)
                  .then(($) => {
                    var j = 0;
                    image_url = "";
                    var content = $('.mw-content-ltr').find('figure').each(function(i,elem) {
                      image_url = $(this).children().attr('href');
                    });

                    const embed = new Discord.RichEmbed()
                      .setColor(0xffffff)
                      .setTitle('**'+data[number-1]+'**')
                      .setURL(links[number-1])
                    if (image_url.length > 0){embed.setImage(image_url)}
                    var content = $('.mw-content-ltr').find('div').each(function(i,elem) {
                      if($(this).find('h3').text() != ""){
                        embed.addField($(this).find('h3').text(),$(this).find('div').text(), true)
                      }
                    });
                    message.channel.send(embed)
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
                collector.stop('number selected')
              }
            }catch(err) {
              console.log(err);
              message.channel.send('You need to type the number!')
            };
          })
        })
      }else{
        const options = {
          uri: links[0],
          transform: function (body) {
            return cheerio.load(body);
          }
        };
        await rp(options)
          .then(($) => {
            var j = 0;
            image_url = "";
            var content = $('.mw-content-ltr').find('figure').each(function(i,elem) {
              image_url = $(this).children().attr('href');
            });

            const embed = new Discord.RichEmbed()
              .setColor(0xffffff)
              .setTitle('**'+data[0]+'**')
              .setURL(links[0])
            if (image_url.length > 0){embed.setImage(image_url)}
            var content = $('.mw-content-ltr').find('div').each(function(i,elem) {
              if($(this).find('h3').text() != ""){
                embed.addField($(this).find('h3').text(),$(this).find('div').text(), true)
              }
            });
            message.channel.send(embed)
          })
          .catch(function (err) {
            console.log(err);
          });

      }
    }
}

module.exports.help = {
  name: "weapon" // PLACE NAME HERE
}
