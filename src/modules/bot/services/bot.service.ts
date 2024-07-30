import { ConfigService } from '@nestjs/config';
import { Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { MESSAGE_KEYS } from 'src/common/locale/telegram/keys';
import { getLocalizedMessage } from 'src/common/locale/telegram/telegram';
import { TelegramBotConfig } from 'src/configs/configs.type';
import { Context, Markup, Telegraf } from 'telegraf';

import { TELEGRAM_COMMANDS } from '../models/constants';

@Update()
export class BotService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.bot.telegram.setMyCommands(TELEGRAM_COMMANDS);
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    const botConfig = this.configService.get<TelegramBotConfig>('telegramBot');
    const { webAppUrl } = botConfig;

    const userLanguageCode = ctx.from?.language_code ?? 'en';

    await ctx.replyWithPhoto(
      getLocalizedMessage(
        userLanguageCode,
        MESSAGE_KEYS.WELCOME_MESSAGE_IMAGE_LINK,
      ),
      {
        caption: getLocalizedMessage(
          userLanguageCode,
          MESSAGE_KEYS.WELCOME_MESSAGE,
        ),
        reply_markup: {
          inline_keyboard: [
            [
              Markup.button.webApp(
                getLocalizedMessage(
                  userLanguageCode,
                  MESSAGE_KEYS.WELCOME_MESSAGE_BUTTON,
                ),
                webAppUrl,
              ),
            ],
          ],
        },
      },
    );

    await ctx.setChatMenuButton({
      type: 'web_app',
      text: `${getLocalizedMessage(userLanguageCode, MESSAGE_KEYS.CHAT_MENU_BUTTON)} 🚀`,
      web_app: {
        url: webAppUrl,
      },
    });
  }

  @Command('debug')
  async debugWebapp(@Ctx() ctx: Context) {
    if (ctx.message.from.id !== 705421227) return;

    if (ctx.message?.chat?.type !== 'private') return;

    await ctx.reply('Debug app', {
      reply_markup: {
        inline_keyboard: [
          [
            Markup.button.webApp(
              'Open app',
              'https://7f6dfe6b.testbot-7ed.pages.dev/',
            ),
          ],
        ],
      },
    });
  }
}
