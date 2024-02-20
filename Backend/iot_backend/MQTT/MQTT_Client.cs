// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

// ReSharper disable UnusedType.Global
// ReSharper disable UnusedMember.Global
// ReSharper disable InconsistentNaming

using System.Security.Authentication;
using System.Text;
using System.Text.Json;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Formatter;

namespace iot_backend.MQTT;

public static class MQTT_Client
{
    public static string brokerUrl = "b943a7dfb14f446cb8b0c381173f82f5.s1.eu.hivemq.cloud";
    public static string username = "iot-prj";
    public static string password = "Abc1@345";
    public static IMqttClient? mqttClient;


    public static async Task Connect_Mqtt_Client()
    {
        var mqttFactory = new MqttFactory();
        mqttClient = mqttFactory.CreateMqttClient();
        var mqttClientOptions = new MqttClientOptionsBuilder().WithTcpServer(brokerUrl, 8883)
            .WithCredentials(username, password).WithProtocolVersion(MqttProtocolVersion.V500)
            .WithTlsOptions(
                o =>
                {
                    o.WithCertificateValidationHandler(_ => true);
                    o.WithSslProtocols(SslProtocols.Tls12);
                }).Build();

        var response = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

        Console.WriteLine("The MQTT client is connected.");

        response.DumpToConsole();
    }

    public static TObject DumpToConsole<TObject>(this TObject @object)
    {
        var output = "NULL";
        if (@object != null)
        {
            output = JsonSerializer.Serialize(@object, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        Console.WriteLine($"[{@object?.GetType().Name}]:\r\n{output}");
        return @object;
    }

    public static async Task Publish_Message(String topic, String message)
    {
        if (mqttClient != null && mqttClient.IsConnected)
        {
            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(message)
                .Build();

            await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

            Console.WriteLine("MQTT application message is published.");
        }
        else
        {
            await Connect_Mqtt_Client();
            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(message)
                .Build();

            await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

            Console.WriteLine("MQTT application message is published.");
        }
    }
    public static async Task Subscribe_And_Received_Message()
    {
        var mqttFactory = new MqttFactory();
        mqttClient.ApplicationMessageReceivedAsync += e =>
        {
            Console.WriteLine("Received application message.");
            Console.WriteLine($"{Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment)}");
            return Task.CompletedTask;
        };
        
        var mqttSubscribeOptions = mqttFactory.CreateSubscribeOptionsBuilder()
            .WithTopicFilter(
                f =>
                {
                    f.WithTopic("test");
                })
            .Build();

        await mqttClient.SubscribeAsync(mqttSubscribeOptions, CancellationToken.None);

        Console.WriteLine("MQTT client subscribed to topic.");

    }
}