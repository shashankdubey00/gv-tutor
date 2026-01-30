import { unifiedEmailService } from '../notifications/index.js';

async function test() {
    const isConnected = await unifiedEmailService.verifyGmailConnection();
    console.log('Gmail working?', isConnected);
}

test();
