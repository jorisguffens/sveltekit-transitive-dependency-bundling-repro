import {myesmtool} from "@jorisguffens/my-esm-tool";

export const handle = async ({ event, resolve }) => {
    myesmtool();
    return resolve(event);
};