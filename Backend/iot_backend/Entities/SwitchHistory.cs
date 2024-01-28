namespace iot_backend.Entities
{
    public class SwitchHistory : Entity
    {
        public bool State { get; set; }
        public int SwitchType { get; set; }
        public string SwitchName { get; set; }
    }
}
