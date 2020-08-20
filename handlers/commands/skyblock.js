const Discord = require('discord.js');
const colors = require('../../bot/colors.json');
const fetch = require('cross-fetch');
const fs = require('fs');
const nbt = require('prismarine-nbt');
const beautify = require('beautify');
const {
    api_key
} = require('../../bot/config.json');

module.exports = {
    name: 'skyblock',
    aliases: ['sb'],
    notReady: true,
    async execute(message, args, client) {

        if (args[0]) {

            try {

                fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`)
                    .then(result => result.json())
                    .then(({
                        id
                    }) => {

                        fetch(`https://api.hypixel.net/skyblock/profiles?uuid=${id}&key=${api_key}`)
                            .then(result => result.json())
                            .then(({
                                success,
                                profiles
                            }) => {

                                try {

                                    var emoji = '';

                                    if (profiles[0].cute_name == 'Apple') {
                                        emoji = '🍏';
                                    } else if (profiles[0].cute_name == 'Banana') {
                                        emoji = '🍌'
                                    } else if (profiles[0].cute_name == 'Grapes') {
                                        emoji = '🍇'
                                    } else if (profiles[0].cute_name == 'Pear') {
                                        emoji = '🍐'
                                    } else if (profiles[0].cute_name == 'Zucchini') {
                                        emoji = '🥒'
                                    } else if (profiles[0].cute_name == 'Pineapple') {
                                        emoji = '🍍'
                                    } else if (profiles[0].cute_name == 'Watermelon') {
                                        emoji = '🍉'
                                    } else if (profiles[0].cute_name == 'Lemon') {
                                        emoji = '🍋'
                                    } else if (profiles[0].cute_name == 'Tomato') {
                                        emoji = '🍅'
                                    } else if (profiles[0].cute_name == 'Coconut') {
                                        emoji = '🥥'
                                    } else if (profiles[0].cute_name == 'Orange') {
                                        emoji = '🍊'
                                    } else if (profiles[0].cute_name == 'Kiwi') {
                                        emoji = '🥝'
                                    } else if (profiles[0].cute_name == 'Pomegranate') {
                                        emoji = '🥭'
                                    }

                                    let encoded = profiles[0].members[id].inv_armor.data
                                    let buf = Buffer.from(encoded, 'base64');

                                    nbt.parse(buf, (err, dat) => {
                                        if (err) throw err;
                                        fs.writeFileSync('./nbt.json', beautify(JSON.stringify(nbt.simplify(dat)), {
                                            format: 'json'
                                        }));

                                        try {

                                            let armor = nbt.simplify(dat).i;

                                            const embed = new Discord.MessageEmbed()
                                                .setTitle('✨ Hypixel Skyblock ✨')
                                                .setColor(colors.mainColor)
                                                .addField('Profile Name', profiles[0].cute_name)
                                            if (armor[3].tag != null || armor[3].tag != undefined) {
                                                embed.addField('Helmet', armor[3].tag.ExtraAttributes.id)
                                            }
                                            if (armor[2].tag != null | armor[2].tag != undefined) {
                                                embed.addField('Chestplate', armor[2].tag.ExtraAttributes.id)
                                            }
                                            if (armor[1].tag != null || armor[1].tag != undefined) {
                                                embed.addField('Leggings', armor[1].tag.ExtraAttributes.id)
                                            }
                                            if (armor[0].tag != null || armor[0].tag != undefined) {
                                                embed.addField('Boots', armor[0].tag.ExtraAttributes.id)
                                            }

                                            message.channel.send(embed)
                                                .then(msg => {
                                                    msg.react(emoji);
                                                })
                                        } catch (err) {
                                            if (err) {
                                                console.error(err);
                                                message.reply('There was an error parsing that players skyblock stats!')
                                            }
                                        }
                                    })
                                } catch (err) {
                                    if (err) {
                                        console.error(err);
                                        message.reply('There was an error parsing that players skyblock stats!')
                                    }
                                }

                            })

                    })

            } catch (err) {
                console.error(err);
            }

        }

    }
}