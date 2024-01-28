namespace iot_backend.Entities
{
    public class SensorHistory : Entity
    {
        public int Temperature { get; set; }
        public int Humidity { get; set; }
        public int Brightness { get; set; }
    }
}
