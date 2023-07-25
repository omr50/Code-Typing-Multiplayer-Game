import * as amqp from 'amqplib/callback_api';

export function startSender(): Promise<void> {
  return new Promise((resolve, reject) => {
    amqp.connect('amqp://rabbitmq', (err: any, conn: amqp.Connection) => {
      if (err) {
        reject(err);
      } else {
        conn.createChannel((err: any, ch: amqp.Channel) => {
          if (err) {
            reject(err);
          } else {
            const q = 'user_created';
            const msg = 'user3';

            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);

            resolve();
          }
        });
      }
    });
  });
}
