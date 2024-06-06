import { Telegraf } from "telegraf"
import {message} from 'telegraf/filters'
import config from 'config'
import {chatGPT} from './chatgpt.js'
import {create} from './notion.js'
import {Loader} from './loader.js'


const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
    handlerTimeout: Infinity,
})

bot.command('start', ctx =>{
    ctx.reply('Привіт! Відправ мені текстове повідомлення ( тезісно ) про історію  і я її зроблю краще.')
})

bot.on(message('text'), async (ctx) =>{
    try{
        const text = ctx.message.text
        if(!text.trim()) ctx.reply('Текст не може бути пустим')
        
        const loader = new Loader(ctx)

        loader.show()

        const response = await chatGPT(text)

        // if(!response) ctx.reply('Ошибка с API', response) .. тут буде видавати якщо помилка з апі чат гпт, але оскільки в мене не дійсний ключ то помилка буде видаватися постійно
        
        // const notionResponse = await create(text, response.text) .. не дійсний ключ апі (потрібно заплатити)
        const notionResponse = await create (text, text)

        loader.hide()

        ctx.reply(`Ваша сторінка: ${notionResponse.url}`)

    } catch (e) {
        console.log('Error while proccessing text: ', e.message)
    }

})

bot.launch()