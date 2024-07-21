import { HandlerProps } from "typizator-handler";

export const REPLY_DATA = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Hello", callback_data: "hello" }],
            [{ text: "Bonjour", callback_data: "bonjour" }]
        ]
    }
}

export const proceedImpl = async ({ telegraf }: HandlerProps) => {
    telegraf!.start(async ctx => {
        await ctx.replyWithHTML("Welcome, Bienvenue", REPLY_DATA)
    })

    telegraf!.action("hello", async ctx => {
        await ctx.replyWithHTML("Hello world!", REPLY_DATA)
    })

    telegraf!.action("bonjour", async ctx => {
        await ctx.replyWithHTML("Hein, qmin qu'a vo, biloute?", REPLY_DATA)
    })
}