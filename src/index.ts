import dotenv from 'dotenv';
import Telegraf from 'telegraf';

import 'module-alias/register';

import baobar from './dineries/baobar';
import kammerdiener from './dineries/kammerdiener';
import sky from './dineries/sky';
import spoon from './dineries/spoonfood';

const stickers = {
  difficult: 'CAADAgADdQUAAvoLtggPXCzTWLhU7BYE',
  welcome: 'CAADAgADIwUAAmIxvRMwoI6RATWpZhYE',
  eatingPanda: 'CAADAgADHAADWbv8JSrZ6qs79DMoFgQ',
};

dotenv.config();

const port = parseInt(process.env.PANDALUNCH_PORT, 10) || 8443;
const token = process.env.PANDALUNCH_TOKEN;

const bot = new Telegraf(token);

bot.telegram.setWebhook(`https://43a95563.ngrok.io`);

bot.start((ctx) => ctx.reply('Welcome 🐼'));

bot.help((ctx) => {
  ctx.replyWithSticker(stickers.eatingPanda);
  ctx.reply('Check what you can get for your voucher');
});

bot.on('sticker', ctx => ctx.reply(ctx.message.sticker.file_id));


/**
 * Description:
 * spoon - 'spoonfood 🥣'
 * sky - 'skylunch 🍽'
 * bao - 'baobar 🥡'
 * kammer - 'kammerdiener 🌮'
 */

/**
 * Handle spoonfood
 */
bot.command('spoon', async (ctx) => {
  try {
    const menu = await spoon();
    await ctx.replyWithMarkdown(menu);
  } catch (e) {
    console.error(e);
    ctx.replyWithSticker(stickers.difficult);
  }
});

/**
 * Handle skylunch
 */
bot.command('sky', async (ctx) => {
  try {
    const buffer = await sky();
    await ctx.replyWithPhoto({
      source: buffer,
    });
  } catch (e) {
    console.error(e);
    ctx.replyWithSticker(stickers.difficult);
  }
});

/**
 * Handle baobar
 */
bot.command('bao', async (ctx) => {
  try {
    const buffer = await baobar();

    await ctx.replyWithPhoto({
      source: buffer,
    });
  } catch (e) {
    console.error(e);
    ctx.replyWithSticker(stickers.difficult);
  }
});

/**
 * Handle kammerdiener
 */
bot.command('kammer', async (ctx) => {
  try {
    const [buf1, buf2] = await kammerdiener();
    await ctx.replyWithPhoto({
      source: buf1,
    });
    await ctx.replyWithPhoto({
      source: buf2,
    });
  } catch (e) {
    console.error(e);
    ctx.replyWithSticker(stickers.difficult);
  }
});

bot.startWebhook('/', null, port);
