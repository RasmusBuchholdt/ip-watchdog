const { Webhook, MessageBuilder } = require('discord-webhook-node');
const config = require('../../config/app.json');
const hook = new Webhook(config.hook_url);

export function sendWebhookMessage(title: string, message: string, footer: string): void {
    const embed = new MessageBuilder()
        .setTitle(title)
        .setAuthor('Bot boy', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.google.com')
        .setColor('#00b0f4')
        .setDescription(message)
        .setFooter(footer)
        .setTimestamp();
    hook.send(embed);
}