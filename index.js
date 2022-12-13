const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const { MessageContent, GuildMessages, Guilds, GuildMembers } = GatewayIntentBits;
const { color } = require('./config.json');
const client = new Client({ intents: [MessageContent, GuildMessages, Guilds, GuildMembers] });
const webhook = new WebhookClient({ id: process.env.webhook_id, token: process.env.webhook_token });
const chalk = require('chalk');
const keepAlive = require(`./server`);

client.on('messageDelete', async (message) => {
    const content = message.content
    const attachment = message.attachments.first()

    const embed = new EmbedBuilder()
    .setColor(color.delete)
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setDescription(`Message deleted in <#${message.channel.id}>`)
    .setFooter({ text: `User ID: ${message.author.id}` })
    .setTimestamp()

    if(attachment !== undefined) {
        const file = new AttachmentBuilder(attachment.url, { name: attachment.name });
        embed.setImage(`attachment://${file.name}`)

        if(content) embed.addFields({ name: 'Content', value: content })
        if(file) embed.addFields({ name: 'Image', value: file.name })

        return await webhook.send({ embeds: [embed], files: [file] }).catch(e => { console.log('Failed to send messages via Webhook') })
    }

    if(content) embed.addFields({ name: 'Content', value: content })

    await webhook.send({ embeds: [embed] }).catch(e => { console.log('Failed to send messages via Webhook') })
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    const oldcontent = oldMessage.content
    const newcontent = newMessage.content

    const embed = new EmbedBuilder()
    .setColor(color.edit)
    .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
    .setDescription(`Message edited in <#${newMessage.channel.id}> - **[Jump to message](${newMessage.url})**`)
    .setFooter({ text: `User ID: ${newMessage.author.id}` })
    .setTimestamp()

    if(oldcontent) embed.addFields({ name: 'Old Message', value: oldcontent })
    if(newcontent) embed.addFields({ name: 'New Message', value: newcontent })

    await webhook.send({ embeds: [embed] }).catch(e => { console.log('Failed to send messages via Webhook') })
})

client.on('ready', (client) => {
    console.log(
        `Successfully logged in as ` +
        chalk.green.bold(client.user.tag)
    );

    console.log(
        chalk.yellow.bold(`[  `) +
        `Make sure to ` +
        chalk.red.bold('SUBSCRIBE') + ` to ` +
        chalk.white.bold('Itz') + chalk.red.bold('Nexus') +
        chalk.yellow.bold(`  ]`)
    );
});

keepAlive();
client.login(process.env.token)