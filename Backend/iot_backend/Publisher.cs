using MQTTnet;
using MQTTnet.Client;

namespace iot_backend
{
    public class Publisher
    {
        static public async Task Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            var mqttFactory = new MqttFactory();
            IMqttClient mqttClient = mqttFactory.CreateMqttClient();
            var options = new MqttClientOptionsBuilder()
                .WithClientId(Guid.NewGuid().ToString())
                .WithTcpServer("test.mosquitto.org",1883)
                .WithCleanSession()
                .Build();
            await mqttClient.ConnectAsync(options);
            Console.WriteLine("Connecting to MQTT Server");
        }

        public static async Task StartUp()
        {
            Console.WriteLine("Hello World!");
            var mqttFactory = new MqttFactory();
            IMqttClient mqttClient = mqttFactory.CreateMqttClient();
            var options = new MqttClientOptionsBuilder()
                .WithClientId(Guid.NewGuid().ToString())
                .WithTcpServer("test.mosquitto.org", 1883)
                .WithCleanSession()
                .Build();
            await mqttClient.ConnectAsync(options);
            Console.WriteLine("Connecting to MQTT Server");
        }
    }
}
