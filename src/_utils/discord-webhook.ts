const { Webhook, MessageBuilder } = require('discord-webhook-node');
const config = require('../../config/app.json');
const hook = new Webhook(config.hook_url);

export function sendWebhookMessage(title: string, message: string): void {
    const embed = new MessageBuilder()
        .setTitle(title)
        .setAuthor(config.discord.bot_name, config.discord.bot_avatar_url)
        .setColor(config.discord.message_color)
        .setDescription(message)
        .setTimestamp();
    hook.send(embed);
}