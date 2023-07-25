import * as amqp from 'amqplib/callback_api';

export function startReceiver(): Promise<void> {
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

            ch.assertQueue(q, {durable: false});
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            
            ch.consume(q, (msg: amqp.Message | null) => {
              console.log(" [x] Order created for %s", msg?.content.toString());
            }, {noAck: true});

            resolve();
          }
        });
      }
    });
  });
}