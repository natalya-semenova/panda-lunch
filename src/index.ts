import dotenv from 'dotenv';
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import {
  __,
  length,
  pipe,
  prop,
  subtract,
  values,
} from 'ramda';

import 'module-alias/register';

import baobar from './dineries/baobar';
import kammerdiener from './dineries/kammerdiener';
import sky from './dineries/sky';
import spoon from './dineries/spoonfood';

import getRandomInt from '@/helpers/random-int';


const stickers = {
  welcome: 'CAADAgADHwADWbv8Jeo5dBvZPTaZFgQ',
  eatingPanda: 'CAADAgADHAADWbv8JSrZ6qs79DMoFgQ',
};
const errorStickers = {
  difficult: 'CAADAgADdQUAAvoLtggPXCzTWLhU7BYE',
  busyToday: 'CAADAgADfAUAAvoLtgi_nAABx7w8_agWBA',
  doItTomorrow: 'CAADAgADjgUAAvoLtgjXFHO_4VRR6hYE',
  didNothing: 'CAADAgADhAUAAvoLtghpAwAB-XXWMqIWBA',
  iKnowThatFeelBro: 'CAADAgADbgUAAvoLtgh7rzojfTrKDhYE',
  fpPanda: 'CAADAgADGgADWbv8JTxSipCGVVnTFgQ',
};
const getRandonSticker = (stickerObj: { [key: string]: string }): string => {
  const indx = pipe(
    values,
    length,
    subtract(__, 1),
    getRandomInt(0),
  )(stickerObj);
  const sticker = pipe(
    values,
    prop(indx),
  )(stickerObj);
  console.log('indx', indx, sticker);

  return sticker;
};

const handleRequest = async (ctx: ContextMessageUpdate, fn: () => any) => {
  try {
    ctx.reply('Processing ...');
    const res = await fn();

    return res;
  } catch (e) {
    console.error(e);
    ctx.reply('Sorry, something went wrong');
    ctx.replyWithSticker(getRandonSticker(errorStickers));
  }
};


dotenv.config();

// const port = parseInt(process.env.PANDALUNCH_PORT, 10) || 8443;
const token = process.env.PANDALUNCH_TOKEN;

const bot = new Telegraf(token);

// bot.telegram.setWebhook(`https://96bdb457.ngrok.io`);

bot.start(async (ctx) => {
  await ctx.reply('Welcome 🐼');
  await ctx.replyWithSticker(stickers.welcome);
});

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
bot.command('spoon', async (ctx: ContextMessageUpdate) => {
  const menu = await handleRequest(ctx, spoon);
  await ctx.replyWithMarkdown(menu);
});

/**
 * Handle skylunch
 */
bot.command('sky', async (ctx: ContextMessageUpdate) => {
  const { href, name } = await handleRequest(ctx, sky);
  await ctx.replyWithDocument({
    url: href,
    filename: name,
  });
});

/**
 * Handle baobar
 */
bot.command('bao', async (ctx: ContextMessageUpdate) => {
  const buffer = await handleRequest(ctx, baobar);
  await ctx.replyWithPhoto({
    source: buffer,
  });
});

/**
 * Handle kammerdiener
 */
bot.command('kammer', async (ctx: ContextMessageUpdate) => {
  const [buf1, buf2] = await handleRequest(ctx, kammerdiener);
  await ctx.replyWithPhoto({
    source: buf1,
  });
  await ctx.replyWithPhoto({
    source: buf2,
  });
});

// bot.startWebhook('/', null, port);
bot.launch();
