/**
 * @summary Demonstrates how to use the EventHubConsumerClient to process events from all partitions of a consumer group in an Event Hub.
 */

const { EventHubConsumerClient, earliestEventPosition, latestEventPosition } = require("@azure/event-hubs");

// Load the .env file if it exists
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

async function main() {
  console.log(`Running receiveEvents sample`);

  const consumerClient = new EventHubConsumerClient(
    process.env.eventHubConsumerGroup,
    process.env.eventHubConnectionString
  );
  const subscriptionOptions = {
    startPosition: latestEventPosition,
  };

  const subscription = consumerClient.subscribe(
    {
      // The callback where you add your code to process incoming events
      processEvents: async (events, context) => {
        // Note: It is possible for `events` to be an empty array.
        // This can happen if there were no new events to receive
        // in the `maxWaitTimeInSeconds`, which is defaulted to
        // 60 seconds.
        // The `maxWaitTimeInSeconds` can be changed by setting
        // it in the `options` passed to `subscribe()`.
        for (const event of events) {
          // Start code made by Chris
          console.log('Received event: ', event); 
          const authMethod = JSON.parse(event.systemProperties['iothub-connection-auth-method']);
          console.log('authMethod', authMethod);
          // End code made by Chris
        }
      },
      processError: async (err, context) => {
        console.log(`Error on partition "${context.partitionId}": ${err}`);
      },
    },
    subscriptionOptions
  );

  // Wait for a bit before cleaning up the sample
  setTimeout(async (err) => {
    await subscription.close();
    await consumerClient.close();
    console.log(`Exiting receiveEvents sample`);
  }, 30 * 10000);
}

main().catch((error) => {
  console.error("Error running sample:", error);
});

module.exports = { main };