import { Context } from "telegraf"
import { proceedImpl, REPLY_DATA } from "../src/proceed"

describe("Testing a basic Telegram bot", () => {
    // This will catch the messages we'll send to the bot
    const replyMock = jest.fn()

    afterEach(() => { replyMock.mockClear() })

    // This one is called when the bot user start the dialog by typing /start
    let startFunc: (ctx: Context) => any

    // This will be called in response to pressing the `hello` button
    let helloFunc: (ctx: Context) => any

    // This will be called in response to pressing the `bonjour` button
    let bonjourFunc: (ctx: Context) => any

    // We mock the activity of the Telegraf object. No need to test its own behaviour
    const telegraf = {
        // From here, we start to mock/intercept the functions 
        // called on the Telegraf object to be able to test their behaviour
        start: jest.fn().mockImplementation(func => { startFunc = func }),
        action: jest.fn().mockImplementation((message, func) => {
            switch (message) {
                case "hello":
                    helloFunc = func
                    break
                case "bonjour":
                    bonjourFunc = func
                    break
            }
        }),
        handleUpdate: jest.fn(),
    } as any

    const userId = 1234
    const userName = "name"

    const fromMessage = {
        from: {
            username: userName,
            id: userId
        }
    }

    // Structure of the message received when the user sends the /start message
    const startMessage = {
        message: fromMessage,
        replyWithHTML: replyMock
    } as any

    // Structure of the message received when the user receives a message from an inline button
    const actionMessage = {
        update: {
            callback_query: fromMessage
        },
        replyWithHTML: replyMock
    } as any

    test("Should reply to start message with the prompt with two buttons", async () => {
        // GIVEN the bot webhook is called
        await proceedImpl({ telegraf })

        // WHEN the user sends the /start command
        await startFunc(startMessage)

        // THEN the bot replies with the prompt and the keyboard
        expect(replyMock).toHaveBeenLastCalledWith(expect.stringContaining("Welcome, Bienvenue"), REPLY_DATA)
    })

    test("Should correctly reply to the hello message", async () => {
        // GIVEN the bot webhook is called
        await proceedImpl({ telegraf })

        // WHEN the user activates the hello bunnon
        await helloFunc(actionMessage)

        // THEN the bot replies with the prompt and the keyboard
        expect(replyMock).toHaveBeenLastCalledWith(expect.stringContaining("Hello world"), REPLY_DATA)
    })

    test("Should correctly reply to the bonjour message", async () => {
        // GIVEN the bot webhook is called
        await proceedImpl({ telegraf })

        // WHEN the user activates the hello bunnon
        await bonjourFunc(actionMessage)

        // THEN the bot replies with the prompt and the keyboard
        expect(replyMock).toHaveBeenLastCalledWith(expect.stringContaining("Hein, qmin qu'a vo, biloute?"), REPLY_DATA)
    })
})