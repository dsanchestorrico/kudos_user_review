'use strict'

const amqp = require('amqplib')
const queue = process.env.QUEUE || 'usuarios_queue'

function exitAfterSend() {
    process.exit(0)
}

async function publish(mensaje) {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queue)

    const message = mensaje;

    const sent = await channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
            // persistent: true
        }
    )

    sent
        ? console.log(`Sent message to "${queue}" usuarios_queue`, message)
        : console.log(`Fails sending message to "${queue}" usuarios_queue`, message)

}

exports.publish = publish;