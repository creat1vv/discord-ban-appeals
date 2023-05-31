import { decodeJwt } from "./helpers/jwt-helpers.js";
import { unbanUser } from "./helpers/user-helpers.js";

export async function handler(event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    if (event.queryStringParameters.token !== undefined) {
        const unbanInfo = decodeJwt(event.queryStringParameters.token);
        if (unbanInfo.userId !== undefined) {
            try {
                await unbanUser(unbanInfo.userId, process.env.GUILD_ID, process.env.DISCORD_BOT_TOKEN);
                
                return {
                    statusCode: 303,
                    headers: {
                        "Location": `/success?msg=${encodeURIComponent("Пользователь разблокирован\nСвяжитесь с ним для информирования.")}`
                    }
                };
            } catch (e) {
                return {
                    statusCode: 303,
                    headers: {
                        "Location": `/error?msg=${encodeURIComponent("При разбане произошла ошибка.\nПопробуйте разбан вручную.")}`
                    }
                };
            }
        }
    }

    return {
        statusCode: 400
    };
}